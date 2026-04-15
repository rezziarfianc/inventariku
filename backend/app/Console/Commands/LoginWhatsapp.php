<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use chillerlan\QRCode\Output\QROutputInterface;
use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Common\Version;
use chillerlan\QRCode\Output\QRConsole;

class LoginWhatsapp extends Command
{
    protected $signature = 'whatsapp:login';
    protected $description = 'Login WhatsApp by scanning QR code';

    public function handle()
    {
        $whatsappService = app(\App\Services\WhatsappService::class);
        $this->info("Please scan the QR code to log in to WhatsApp.");

        $qrData = $whatsappService->getQrCode();

        if (!$qrData) {
            $this->error("Failed to retrieve QR data.");
            return;
        }

        $this->displayQr($qrData);
    }

    private function displayQr(string $data)
    {
        $options = new QROptions([
            'version'  => Version::AUTO,
            'eccLevel' => EccLevel::M,
            'addQuietzone' => false,
        ]);

        $qrcode = new QRCode($options);

        // Correct way to load the string and fetch the raw matrix in modern versions
        $qrcode->addByteSegment($data);
        $matrix = $qrcode->getQRMatrix();

        $size = $matrix->getSize();
        $margin = 2; // Keep a small margin so the phone camera can detect the edges

        // ANSI format: Forces a White Background with Black Text, ignoring terminal themes
        $colorFormat = "\033[48;5;255m\033[38;5;0m%s\033[0m";

        // Iterate through the Y-axis two rows at a time
        for ($y = -$margin; $y < $size + $margin; $y += 2) {
            $rowString = '';

            for ($x = -$margin; $x < $size + $margin; $x++) {
                // Check if the current (top) module and the one directly below it are dark
                $isDarkTop    = ($y >= 0 && $y < $size && $x >= 0 && $x < $size) ? $matrix->check($x, $y) : false;
                $isDarkBottom = (($y + 1) >= 0 && ($y + 1) < $size && $x >= 0 && $x < $size) ? $matrix->check($x, $y + 1) : false;

                // Build the terminal UI blocks
                if ($isDarkTop && $isDarkBottom) {
                    $rowString .= '█'; // Full text block (Both Black)
                } elseif ($isDarkTop && !$isDarkBottom) {
                    $rowString .= '▀'; // Upper half text (Top Black, Bottom White)
                } elseif (!$isDarkTop && $isDarkBottom) {
                    $rowString .= '▄'; // Lower half text (Top White, Bottom Black)
                } else {
                    $rowString .= ' '; // Empty space (Both White background)
                }
            }

            // Print the perfectly compressed line
            $this->line(sprintf($colorFormat, $rowString));
        }
    }
}
