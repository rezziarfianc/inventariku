<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\StockNotification;
use Illuminate\Console\Command;

class TestNotification extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'notify:test {--message= : Custom message to send} {--user= : Specific user ID to notify}';

    /**
     * The console command description.
     */
    protected $description = 'Send a test notification to all users or a specific user (saves to DB + broadcasts)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $message = $this->option('message') ?? 'This is a test notification from the system!';
        $userId = $this->option('user');

        if ($userId) {
            // Send to specific user
            $user = User::find($userId);
            
            if (!$user) {
                $this->error("User with ID {$userId} not found.");
                return self::FAILURE;
            }

            $this->sendNotification($user, $message);
            $this->info("Notification sent to user: {$user->name} (ID: {$user->user_id})");
        } else {
            // Send to all users
            $users = User::all();
            
            if ($users->isEmpty()) {
                $this->error('No users found in the database.');
                return self::FAILURE;
            }

            $this->info("Sending notification to {$users->count()} users...");
            $bar = $this->output->createProgressBar($users->count());
            $bar->start();

            foreach ($users as $user) {
                $this->sendNotification($user, $message);
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();
            $this->info('All notifications sent successfully!');
        }

        return self::SUCCESS;
    }

    /**
     * Send notification to a user (saves to DB + broadcasts via WebSocket).
     */
    private function sendNotification(User $user, string $message): void
    {
        StockNotification::sendToUser($user, $message);
    }
}
