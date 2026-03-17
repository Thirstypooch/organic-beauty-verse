<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shippingAddress' => 'required|array',
            'shippingAddress.fullName' => 'required|string|max:255',
            'shippingAddress.street' => 'required|string|max:255',
            'shippingAddress.city' => 'required|string|max:128',
            'shippingAddress.state' => 'required|string|max:128',
            'shippingAddress.zipCode' => 'required|string|max:20',
            'shippingAddress.phone' => 'required|string|max:30',
            'items' => 'required|array|min:1',
            'items.*.productId' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated, $request) {
            $total = 0;
            $itemsData = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['productId']);
                $price = $product->price;
                $total += $price * $item['quantity'];
                $itemsData[] = [
                    'product_id' => $item['productId'],
                    'quantity' => $item['quantity'],
                    'price' => $price,
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'total' => $total,
                'shipping_address' => $validated['shippingAddress'],
            ]);

            $order->items()->createMany($itemsData);

            return $order;
        });

        $order->load('items.product');

        return new OrderResource($order);
    }

    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('items.product')
            ->orderByDesc('created_at')
            ->get();

        return OrderResource::collection($orders);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $order->load('items.product');

        return new OrderResource($order);
    }
}
