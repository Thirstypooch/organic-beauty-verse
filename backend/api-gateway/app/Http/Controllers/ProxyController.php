<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ProxyController extends Controller
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client(['timeout'  => 10.0, 'verify' => false]);
    }

    /**
     * Handles all incoming requests and proxies them to the correct service.
     */
    public function proxy(Request $request, string $any)
    {
        // Get the first part of the path to identify the target service
        $pathSegments = explode('/', $any);
        $serviceIdentifier = $pathSegments[0] ?? null;

        // Use a match expression to find the correct service based on the path
        $service = match ($serviceIdentifier) {
            'register', 'login', 'user' => 'user',
            'products', 'categories' => 'product',
            default => null,
        };

        if (!$service) {
            return response()->json(['error' => 'Service for this route not found.'], 404);
        }

        $baseUrl = config("services.{$service}.base_uri");
        // Construct the full URL by appending the entire original path
        $url = $baseUrl . '/' . $any;

        $options = [
            'headers' => $request->headers->all(),
            'query' => $request->query(),
        ];

        if ($request->isJson()) {
            $options['json'] = $request->json()->all();
        } else if ($request->getContent()) {
            $options['body'] = $request->getContent();
        }

        try {
            $response = $this->client->request($request->method(), $url, $options);

            return response($response->getBody()->getContents(), $response->getStatusCode())
                ->withHeaders($response->getHeaders());

        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $response = $e->getResponse();
                return response($response->getBody()->getContents(), $response->getStatusCode())
                    ->withHeaders($response->getHeaders());
            }
            return response()->json(['error' => 'Gateway Error: Could not connect to the downstream service.'], 502);
        }
    }
}
