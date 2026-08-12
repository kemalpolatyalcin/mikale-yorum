<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Waiter extends Model {
    protected $fillable = ['name', 'photo', 'phone'];
    protected $appends = ['average_rating'];
    public function reviews(): HasMany {
        return $this->hasMany(Review::class);
    }
    public function bills(): HasMany {
        return $this->hasMany(Bill::class);
    }
    public function getAverageRatingAttribute(): float {
        $avg = $this->reviews()->avg('stars') ?? 0;
        return round((float) $avg, 1);
    }
}
