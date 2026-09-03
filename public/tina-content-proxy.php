<?php
/**
 * Tina Cloud content API proxy for Splash Newswire.
 *
 * Purpose:
 *   Avoid browser ERR_CONTENT_DECODING_FAILED caused by zstd/brotli responses
 *   from content.tinajs.io by requesting identity encoding server-side.
 *
 * This file contains no Tina secrets. It forwards the Tina Cloud login
 * Authorization header from the browser to Tina Cloud.
 */

$allowed_origin = 'https://www.splashnewswire.com';
$upstream = 'https://content.tinajs.io/2.4/content/5e1c5147-79ba-43bb-9a90-e390b48103ba/github/main';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: ' . $allowed_origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY');
    header('Access-Control-Max-Age: 86400');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$body = file_get_contents('php://input');
$headers = [
    'Content-Type: application/json',
    'Accept: application/json, text/plain, */*',
    'Accept-Encoding: identity',
];

$auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
if ($auth) {
    $headers[] = implode('', ['Authorization', ': ', $auth]);
}

$api_key = $_SERVER['HTTP_X_API_KEY'] ?? '';
if ($api_key) {
    $headers[] = implode('', ['X-API-KEY', ': ', $api_key]);
}

$ch = curl_init($upstream);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_TIMEOUT => 45,
    CURLOPT_ENCODING => 'identity',
]);

$response = curl_exec($ch);
if ($response === false) {
    $error = curl_error($ch);
    curl_close($ch);
    http_response_code(502);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Tina proxy cURL error', 'message' => $error]);
    exit;
}

$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$response_body = substr($response, $header_size);
curl_close($ch);

http_response_code($status ?: 200);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Splash-Tina-Proxy: identity');
echo $response_body;