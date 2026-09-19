<?php
// Custom 404 handler with Markdown Content Negotiation for AI Agents
http_response_code(404);

$accept = isset($_SERVER['HTTP_ACCEPT']) ? $_SERVER['HTTP_ACCEPT'] : '';
header('Vary: Accept');
header('Access-Control-Allow-Origin: *');

// If the agent requested markdown, return markdown 404
if (stripos($accept, 'text/markdown') !== false || stripos($accept, 'text/x-markdown') !== false) {
    header('Content-Type: text/markdown; charset=utf-8');
    echo "# 404 - Recurso Não Encontrado | Nave AI by OZATI\n\n";
    echo "O endereço ou recurso solicitado não existe neste servidor ou foi movido permanentemente.\n\n";
    echo "## Links Úteis para Agentes de IA e Desenvolvedores:\n";
    echo "- [Documentação LLMs (llms.txt)](https://nave.ozati.co/llms.txt)\n";
    echo "- [Instruções para Agentes (agent-instructions.md)](https://nave.ozati.co/agent-instructions.md)\n";
    echo "- [Portal do Desenvolvedor (APIs e MCP)](https://nave.ozati.co/developers)\n";
    echo "- [Especificação OpenAPI 3.1](https://nave.ozati.co/openapi.json)\n";
    echo "- [Mapa do Site XML](https://nave.ozati.co/sitemap.xml)\n";
    echo "- [Nave Chat Web](https://chat.ozati.co/)\n";
    exit;
}

// Otherwise render HTML 404
header('Content-Type: text/html; charset=utf-8');
if (file_exists(__DIR__ . '/404.html')) {
    include __DIR__ . '/404.html';
} else {
    echo '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>The requested URL was not found on this server.</p></body></html>';
}
exit;
