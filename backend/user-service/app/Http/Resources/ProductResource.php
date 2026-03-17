<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Outputs camelCase keys to match the frontend Zod schema (productSchema).
     * Price is cast to float to match the frontend expectation of z.number().
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'externalId' => $this->external_id,
            'name' => $this->name,
            'price' => (float) $this->price,
            'description' => $this->description,
            'categoryId' => $this->category_id,
            'howToUse' => $this->how_to_use,
            'warnings' => $this->warnings,
            'imageUrl' => $this->image_url,
        ];
    }
}
