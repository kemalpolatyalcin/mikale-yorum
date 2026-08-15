<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model {
    protected $fillable = [
        'step_number',
        'title',
        'subtitle',
        'category_name',
        'icon_class',
        'key_name',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'step_number' => 'integer',
        'sort_order' => 'integer'
    ];
}
