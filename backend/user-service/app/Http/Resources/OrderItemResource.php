<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'productName' => $this->product->name,
            'productImageUrl' => $this->product->image_url,
            'quantity' => $this->quantity,
            'price' => (float) $this->price,
        ];
    }
}
