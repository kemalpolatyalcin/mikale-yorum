<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class Review extends Model {
    protected $fillable = ['waiter_id', 'bill_id', 'stars', 'comment', 'customer_name'];
    public function waiter(): BelongsTo {
        return $this->belongsTo(Waiter::class);
    }
    public function bill(): BelongsTo {
        return $this->belongsTo(Bill::class);
    }
}
