<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplyFlowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'supply_flow_id' => (string) $this->supply_flow_id,
            'product_id' => (string) $this->product_id,
            'product' => $this->whenLoaded('product', function () {
                return new ProductResource($this->product);
            }),
            'flow_type' => $this->flow_type,
            'quantity' => $this->quantity,
            'created_at' => $this->created_at
        ];
    }
}
