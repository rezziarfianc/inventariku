<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_id' => (string) $this->product_id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'low_stock_threshold' => (int) $this->low_stock_threshold,
            'category_id' => (string) $this?->category_id ?: null,
            'category' => $this->whenLoaded('category', function () {
                return [
                    'name' => $this->category->name,
                    'code' => $this->category->code,
                ];
            }),
            'quantity' => (int) $this->supply?->quantity ?? 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
