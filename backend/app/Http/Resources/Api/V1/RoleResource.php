<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // 'role_id' => (string) $this->id,
            'name' => str_replace('_', ' ', ucwords($this->name)),
            'code' => $this->name,
        ];
    }
}
