<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'audit_id' => (string) $this->id,
            'user_id' => (string) $this->user_id,
            'event' => $this->event,
            'old_values' => collect($this->old_values)->filter(function ($value, $key) {
                return $key !== 'password';
            }),
            'new_values' => collect($this->new_values)->filter(function ($value, $key) {
                return $key !== 'password';
            }),
            'created_at' => $this->created_at,
            'user' => $this->whenLoaded('user', function () {
                return [
                    'user_id' => $this->user->user_id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
        ];
    }
}
