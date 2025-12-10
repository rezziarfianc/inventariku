<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class Brand extends Model implements Auditable
{
    use AuditableTrait, SoftDeletes;
    protected $fillable = ['name', 'description', 'code'];
    public $timestamps = true;
    protected $primaryKey = 'brand_id';

    public function products()
    {
        return $this->hasMany(Product::class, 'brand_id', 'brand_id');
    }

    public function getAuditExclude(): array
    {
        return ['created_at', 'updated_at', 'deleted_at'];
    }

}