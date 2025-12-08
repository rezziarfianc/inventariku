<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('supply_flows', function (Blueprint $table) {
            $table->id('supply_flow_id');
            $table->unsignedBigInteger('supply_id');
            $table->unsignedBigInteger('product_id');
            $table->foreign('supply_id')->references('supply_id')->on('supplies')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('set null');
            $table->enum('flow_type', ['inbound', 'outbound']);
            $table->integer('quantity');
            $table->timestamp('flow_date')->useCurrent();
            $table->timestamps();
            $table->softDeletes();

            $table->index('supply_id');
            $table->index('product_id');
            $table->index('flow_type');
            $table->index('flow_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supply_flows');
    }
};
