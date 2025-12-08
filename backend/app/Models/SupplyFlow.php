<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;
use OwenIt\Auditing\Auditable as AuditableTrait;

class SupplyFlow extends Model implements Auditable
{
    use SoftDeletes, AuditableTrait;
    public $primaryKey = 'supply_flow_id';
    protected $fillable = ['supply_id', 'product_id', 'quantity', 'flow_type', 'flow_date'];
    public $timestamps = true;

    public function supply()
    {
        return $this->belongsTo(Supply::class, 'supply_id');
    }
}
