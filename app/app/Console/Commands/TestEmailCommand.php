<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailCommand extends Command
{
    protected $signature = 'email:test {email}';
    protected $description = 'Test email configuration by sending a test email';

    public function handle()
    {
        $email = $this->argument('email');

        try {
            Mail::raw('Test email dari E-Commerce Mantap!', function ($message) use ($email) {
                $message->to($email)
                        ->subject('Test Email Configuration');
            });

            $this->info("✅ Test email berhasil dikirim ke: {$email}");
            $this->info("Silakan cek inbox/spam folder Anda.");
        } catch (\Exception $e) {
            $this->error("❌ Gagal mengirim email: " . $e->getMessage());
        }
    }
}