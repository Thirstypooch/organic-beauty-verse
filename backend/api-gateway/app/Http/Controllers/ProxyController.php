<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ProxyController extends Controller
{
    protected Client $client;

    /**
     * Constructor to initialize the Guzzle HTTP client.
     */
    public function __construct()
    {
        $this-> client = new Client([
            'timeout'  => 10.0,
            'verify' => false
            // In production, you'd want to configure SSL verification properly
        ]);
    }

    /**
     * A generic proxy method to forward requests to the appropriate service.
     *
     * @param string $service The name of the service to proxy to (e.g., 'user', 'product').
     * @param string $any The rest of the URI path.
     * @param Request $request The incoming Laravel request object.
     * @return JsonResponse|Response
     */

    public function proxy(string $service, string $any, Request $request)
    {
        $baseUrl = config("services.{$service}.base_uri");

        if (!$baseUrl) {
            return response()->json(['error' => "Service '{$service}' not configured."], 503);
        }

        $url = $baseUrl . '/' . $any;

        try {
            $response = $this-> client-> request($request-> method(), $url, [
                'headers' => $request-> header(),
                'query' => $request-> query(),
                'json' => $request-> json()-> all()
            ]);
            return response($response-> getBody()-> getContents(), $response-> getStatusCode())
                -> withHeaders($response-> getHeaders());

        } catch (RequestException $e) {
            if ($e-> hasResponse()) {
                $response = $e-> getResponse();
                return response($response-> getBody()-> getContents(), $response-> getStatusCode())
                    -> withHeaders($response-> getHeaders());
            }
            return response()-> json(['error' => 'Gateway Error: Could not connect to the service.'], 502);
        }
    }
}
