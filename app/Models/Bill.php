<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Bill extends Model {
    protected $fillable = ['table_no', 'waiter_id', 'items', 'total', 'status'];
    protected $casts = [
        'items' => 'array',
        'total' => 'decimal:2'
    ];
    public function waiter(): BelongsTo {
        return $this->belongsTo(Waiter::class);
    }
    public function reviews(): HasMany {
        return $this->hasMany(Review::class);
    }
}
