<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class LoginWhatsapp extends Command
{
    protected $signature = 'whatsapp:login';
    protected $description = 'Login WhatsApp by scanning QR code';

    public function handle()
    {
        $whatsappService = app(\App\Services\WhatsappService::class);
        $this->info("Please scan the QR code to log in to WhatsApp.");

        $base64 = $whatsappService->getQrCode();
        $base64 = preg_replace('#^data:image/\w+;base64,#i', '', $base64);

        $imageData = base64_decode($base64);

        $this->displayAsciiQr($imageData);
    }

    private function displayAsciiQr(string $imageData)
    {
        $image = imagecreatefromstring($imageData);
        $width = imagesx($image);
        $height = imagesy($image);

        // Resize step for readability in CLI
        for ($y = 0; $y < $height; $y += 4) {
            $line = "";
            for ($x = 0; $x < $width; $x += 4) {
                $rgb = imagecolorat($image, $x, $y);
                $r = ($rgb >> 16) & 0xFF;
                $g = ($rgb >> 8) & 0xFF;
                $b = $rgb & 0xFF;

                // Lightness
                $luma = $r * 0.3 + $g * 0.59 + $b * 0.11;

                // Dark = block, Light = space
                $line .= ($luma < 128) ? "██" : "  ";
            }
            $this->line($line);
        }
    }
}
