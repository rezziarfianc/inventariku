<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class LoginWhatsapp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'whatsapp:login';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $whatsappService = app(\App\Services\WhatsappService::class);
        $this->info("Please scan the QR code to log in to WhatsApp.");
    }
}
