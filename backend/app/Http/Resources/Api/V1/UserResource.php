<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name');
            }),
            'can' => $this->whenLoaded('roles', function () {
                return $this->roles->flatMap(function ($role) {
                    $permissions = $role->permissions->pluck('name');
                    $grouped = [];
                    foreach ($permissions as $permission) {
                        $exploded = explode('.', $permission);
                        $name = $exploded[0];
                        $action = $exploded[1];
                        if (!isset($grouped[$name])) {
                            $grouped[$name] = [];
                        }
                        $grouped[$name][] = $action;
                    }
                    // dump($grouped);

                    return $grouped;
                });
            }),
        ];
    }
}
