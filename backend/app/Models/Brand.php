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
}