<?php

namespace App\Http\Requests\Api\V1;

use Gate;
use Illuminate\Foundation\Http\FormRequest;

class GetCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('categories.view');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'sort_by' => ['sometimes', 'string', 'in:name,created_at,updated_at'],
            'sort_order' => ['sometimes', 'string', 'in:asc,desc'],
        ];
    }
}
