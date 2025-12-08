<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Product extends Model implements Auditable
{
    use SoftDeletes, AuditableTrait;

    public $primaryKey = 'product_id';
    protected $fillable = ['name', 'description', 'price', 'category_id', 'low_stock_threshold'];
    public $timestamps = true;


    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function supply()
    {
        return $this->hasOne(Supply::class, 'product_id');
    }

    public function getAuditCustomFields(): array
    {
        return ['name', 'description', 'price', 'category_id', 'low_stock_threshold'];
    }

    public function getAuditEventTypes(): array
    {
        return ['created', 'updated', 'deleted'];
    }

    public function getAuditIncludeRelations(): array
    {
        return ['supply'];
    }

    public function getAuditExcludeAttributes(): array
    {
        return ['updated_at', 'created_at'];
    }

}
