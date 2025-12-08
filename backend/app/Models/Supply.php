<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supply extends Model
{
    use SoftDeletes;
    public $primaryKey = 'supply_id';
    protected $fillable = ['product_id', 'quantity'];
    public $timestamps = true;

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function flow()
    {
        return $this->hasMany(SupplyFlow::class, 'supply_id');
    }
}
