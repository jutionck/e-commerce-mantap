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
            // Only add columns that don't already exist
            // payment_type and va_number already exist from previous migration
            if (!Schema::hasColumn('payments', 'bank')) {
                $table->string('bank')->nullable()->after('va_number'); // Bank name for VA
            }
            if (!Schema::hasColumn('payments', 'response_data')) {
                $table->text('response_data')->nullable()->after('gross_amount'); // Raw API response
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Only drop columns that we added (not payment_type and va_number from previous migration)
            if (Schema::hasColumn('payments', 'bank')) {
                $table->dropColumn('bank');
            }
            if (Schema::hasColumn('payments', 'response_data')) {
                $table->dropColumn('response_data');
            }
        });
    }
};