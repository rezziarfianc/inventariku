<?php

namespace App\Providers;

use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class WhatsappServiceProvider extends ServiceProvider implements DeferrableProvider

{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(\App\Services\WhatsappService::class, function ($app) {
            $config = config('services.whatsapp');

            return new \App\Services\WhatsappService(
                $config['api_url'],
                $config['api_key'],
                $config['session_id'],
            );
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        return;
    }

    public function provides(): array
    {
        return [\App\Services\WhatsappService::class];
    }
}
