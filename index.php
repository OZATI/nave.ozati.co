<?php
// Markdown Content Negotiation (acceptmarkdown.com standard) for Nave AI Homepage
$accept = isset($_SERVER['HTTP_ACCEPT']) ? $_SERVER['HTTP_ACCEPT'] : '';
header('Vary: Accept, Accept-Encoding');
header('Cache-Control: no-cache, no-store, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, HEAD, OPTIONS');

// Check if client explicitly requests Markdown
if (stripos($accept, 'text/markdown') !== false || stripos($accept, 'text/x-markdown') !== false) {
    header('Content-Type: text/markdown; charset=utf-8');
    if (file_exists(__DIR__ . '/llms-full.txt')) {
        readfile(__DIR__ . '/llms-full.txt');
    } elseif (file_exists(__DIR__ . '/llms.txt')) {
        readfile(__DIR__ . '/llms.txt');
    } else {
        echo "# Nave AI\n\nNave AI by OZATI Tecnologia & Inovação. https://chat.ozati.co\n";
    }
    exit;
}

// Otherwise serve HTML homepage
header('Content-Type: text/html; charset=utf-8');
if (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
} else {
    echo '<!DOCTYPE html><html><head><title>Nave AI</title></head><body><h1>Nave AI</h1></body></html>';
}
exit;
