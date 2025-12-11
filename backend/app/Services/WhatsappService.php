<?php

namespace App\Services;

use App\Models\SupplyFlow;
use GuzzleHttp\Client;
use \Psr\Http\Message\ResponseInterface;

class WhatsappService
{
    public string $apiUrl;
    public string $apiKey;
    public string $numberSuffix = '@c.us';
    public Client $httpClient;
    public array $defaultHeaders = [
        'Content-Type' => 'application/json',
    ];

    public string $sessionId;

    public function __construct(string $apiUrl, string $apiKey, string $sessionId, string $numberSuffix = '@c.us')
    {
        $this->apiUrl = rtrim($apiUrl, '/');
        $this->apiKey = $apiKey;
        $this->numberSuffix = $numberSuffix;
        $this->defaultHeaders['x-api-key'] = $this->apiKey;
        $this->sessionId = $sessionId;
    }

    public function getHttpClient(): Client
    {
        if (!isset($this->httpClient)) {
            $this->httpClient = new Client();
        }
        return $this->httpClient;
    }

    public function sendMessage($number, $message): bool
    {
        $payload = [
            'chatId' => $number . $this->numberSuffix,
            'content' => $message,
            'contentType' => 'string',
        ];

        try {
            $response = $this->post('client/sendMessage/' . $this->sessionId, $payload);
            \Log::info("WhatsApp message sent to {$number}", [
                'payload' => $payload,
                'session_id' => $this->sessionId,
                'number' => $number,
                'response_status' => $response->getStatusCode(),
            ]);
            return $response->getStatusCode() === 200;

        } catch (\Exception $e) {
            \Log::error("Failed to send WhatsApp message to {$number}: {$e->getMessage()}", [
                'session_id' => $this->sessionId,
                'number' => $number,
                'payload' => $payload,
            ]);

            return false;
        }
    }

    private function get($endpoint, $params = []): ResponseInterface
    {
        $client = $this->httpClient ?? new Client();

        return $client->get($this->apiUrl . '/' . ltrim($endpoint, '/'), [
            'headers' => $this->defaultHeaders,
            'query' => $params,
        ]);
    }

    private function post($endpoint, $data = []): ResponseInterface
    {
        $client = $this->httpClient ?? new Client();

        return $client->post(
            rtrim($this->apiUrl, '/') . '/' . ltrim($endpoint, '/'),
            [
                'headers' => $this->defaultHeaders,
                'json' => $data,
            ]
        );
    }

    public function startSession(): bool
    {
        $response = $this->get('session/start/' . $this->sessionId);
        return $response->getStatusCode() === 200;
    }

    public function sendNotification(SupplyFlow $supplyFlow)
    {
        try {
            $supplyFlow->load(['product', 'supply']);
            $product = $supplyFlow->product;
            $supply = $supplyFlow->supply;

            $message = "*Stock Alert!*\n
            Product: {$product->name}\n
            *{$product->name}* is now low on stock (*{$supply->quantity}* units) after an *{$supplyFlow->flow_type}* of *{$supplyFlow->quantity}* units.\n
            Please take action to restock.";
            $this->sendMessage('6289601871947', preg_replace('/[ \t]+/', ' ', $message));
        } catch (\Exception $e) {
            \Log::error("Failed to send stock alert for product {$product->product_id}: {$e->getMessage()}");
        }
    }

}