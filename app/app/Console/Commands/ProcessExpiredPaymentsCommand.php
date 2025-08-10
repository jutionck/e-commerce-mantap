<?php

namespace App\Console\Commands;

use App\Jobs\ProcessExpiredPayments;
use Illuminate\Console\Command;

class ProcessExpiredPaymentsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payments:process-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and mark expired payments as expired';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Processing expired payments...');
        
        // Dispatch the job
        ProcessExpiredPayments::dispatch();
        
        $this->info('✅ Expired payments processing job has been dispatched.');
        $this->line('   Job will run in the background and mark expired orders/payments.');
        
        return 0;
    }
}