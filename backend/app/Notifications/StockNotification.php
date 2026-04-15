<?php

namespace App\Notifications;

use App\Events\NotificationEvent;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public string $message;

    public function __construct(string $message)
    {
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     * We removed 'broadcast' since we're using a custom event instead
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Called after the notification is sent.
     * Dispatch our custom public channel event.
     */
    public function afterCommit(): bool
    {
        return true;
    }

    /**
     * Send the notification and also broadcast via public channel.
     */
    public static function sendToUser($user, string $message): void
    {
        // Store in database
        $user->notify(new static($message));

        // Broadcast via public channel
        event(new NotificationEvent($message, 'stock', $user->user_id));
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Stock Alert: ' . substr($this->message, 0, 20) . '...')
            ->line($this->message)
            ->action('View Inventory', url('/inventory'))
            ->line('Please check the stock levels immediately.');
    }

    /**
     * Get the array representation of the notification.
     * This data is stored in the 'data' JSON column in your database.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type'    => 'stock',
            'message' => $this->message,
            'sent_at' => now()->toDateTimeString(),
        ];
    }
}
