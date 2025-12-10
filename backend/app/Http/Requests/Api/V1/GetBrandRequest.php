<?php

namespace App\Http\Requests\Api\V1;

use Gate;
use Illuminate\Foundation\Http\FormRequest;

class GetBrandRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('brands.view');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:30',
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:100',
            'sort_by' => 'sometimes|string|in:brand_id,name,created_at,updated_at',
            'sort_order' => 'sometimes|string|in:asc,desc',
        ];
    }
}
