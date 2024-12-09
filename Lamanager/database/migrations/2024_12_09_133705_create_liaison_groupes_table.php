<?php

use App\Models\Groupe;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('liaison_groupes', function (Blueprint $table) {
            $table->foreignIdFor(Groupe::class, 'groupe_td_id')->constrained('groupes')->onDelete('cascade');
            $table->foreignIdFor(Groupe::class, 'groupe_tp_id')->constrained('groupes')->onDelete('cascade');
            $table->timestamps();
            $table->primary(['groupe_td_id', 'groupe_tp_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('liaison_groupes');
    }
};
