<?php

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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('snap_token')->nullable()->after('status');
            $table->string('transaction_type')->default('snap')->after('snap_token');
            $table->string('payment_type')->nullable()->after('transaction_type');
            $table->string('va_number')->nullable()->after('payment_type');
            $table->decimal('gross_amount', 15, 2)->nullable()->after('va_number');
            $table->string('fraud_status')->nullable()->after('gross_amount');
            $table->timestamp('settlement_time')->nullable()->after('fraud_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'snap_token',
                'transaction_type',
                'payment_type',
                'va_number',
                'gross_amount',
                'fraud_status',
                'settlement_time',
            ]);
        });
    }
};
