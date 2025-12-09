<?php

namespace App\Http\Requests\Api\V1;

use Gate;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupplyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('supplies.create');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'quantity' => ['sometimes', 'numeric', 'min:0'],
            'supply_id' =>  ['nullable', 'integer', 'exists:supplies,supply_id'],
        ];
    }
}
