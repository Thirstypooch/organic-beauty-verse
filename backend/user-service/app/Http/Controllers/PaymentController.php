<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;

class PaymentController extends Controller
{
    public function __construct()
    {
        MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
    }

    /**
     * Create a MercadoPago preference for an order and return the checkout URL.
     */
    public function createPreference(Request $request, Order $order): JsonResponse
    {
        // Verify the order belongs to the authenticated user
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        // Don't create a preference for already-paid orders
        if ($order->payment_status === 'approved') {
            return response()->json(['message' => 'Este pedido ya fue pagado'], 400);
        }

        $order->load('items.product');

        // Build items array for MercadoPago
        $items = $order->items->map(function ($item) {
            return [
                'id' => (string) $item->product_id,
                'title' => $item->product->name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->price,
                'currency_id' => 'USD',
            ];
        })->toArray();

        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');

        $client = new PreferenceClient();
        $preference = $client->create([
            'items' => $items,
            'back_urls' => [
                'success' => $frontendUrl . '/checkout/success?order_id=' . $order->id,
                'failure' => $frontendUrl . '/checkout/failure?order_id=' . $order->id,
                'pending' => $frontendUrl . '/checkout/pending?order_id=' . $order->id,
            ],
            'auto_return' => 'approved',
            'external_reference' => (string) $order->id,
            'notification_url' => config('app.url') . '/api/webhooks/mercadopago',
        ]);

        // Save the preference ID on the order
        $order->update(['preference_id' => $preference->id]);

        return response()->json([
            'initPoint' => $preference->init_point,
            'sandboxInitPoint' => $preference->sandbox_init_point,
            'preferenceId' => $preference->id,
        ]);
    }

    /**
     * Handle MercadoPago IPN webhook notifications.
     */
    public function webhook(Request $request): JsonResponse
    {
        $type = $request->input('type') ?? $request->input('topic');

        if ($type === 'payment') {
            $paymentId = $request->input('data.id') ?? $request->input('id');

            if ($paymentId) {
                $this->processPayment((string) $paymentId);
            }
        }

        // Always return 200 to acknowledge receipt
        return response()->json(['status' => 'ok']);
    }

    /**
     * Fetch payment details from MercadoPago and update the order.
     */
    private function processPayment(string $paymentId): void
    {
        try {
            $client = new \MercadoPago\Client\Payment\PaymentClient();
            $payment = $client->get((int) $paymentId);

            if (!$payment || !$payment->external_reference) {
                return;
            }

            $order = Order::find((int) $payment->external_reference);
            if (!$order) {
                return;
            }

            // Map MercadoPago status to our order status
            $statusMap = [
                'approved' => 'paid',
                'pending' => 'pending',
                'in_process' => 'pending',
                'rejected' => 'failed',
                'cancelled' => 'cancelled',
                'refunded' => 'refunded',
            ];

            $order->update([
                'payment_id' => $paymentId,
                'payment_status' => $payment->status,
                'status' => $statusMap[$payment->status] ?? $order->status,
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('MercadoPago webhook error: ' . $e->getMessage());
        }
    }
}
