# nave.ozati.co — Nave AI

Plataforma oficial do **Nave AI**: a camada de interface e conexão entre o usuário e as IAs + APIs que ele já utiliza.

## Endereços Oficiais
- **Landing Page**: [https://nave.ozati.co](https://nave.ozati.co)
- **Nave Chat (Web App)**: [https://chat.ozati.co](https://chat.ozati.co)
- **Shader WebGL (Demo isolada)**: [https://nave.ozati.co/wave.html](https://nave.ozati.co/wave.html)
- **Nave Agent Embed SDK**: [https://nave.ozati.co/agent.js](https://nave.ozati.co/agent.js)

## Arquitetura dos 3 Produtos
1. **Nave Chat**: Interface web de alta velocidade para múltiplos modelos (Claude 3.5 Sonnet, GPT-4o, DeepSeek R1, Llama 3.3, Gemini) via BYOK OpenRouter.
2. **Nave Extension**: Extensão de navegador (Side Panel) contextual para leitura de sistemas parceiros (ex: Clinic Kiosk, ERPs, CRMs).
3. **Nave Connect**: Camada de integração corporativa entre APIs de clientes, webhooks e provedores de IA sem cobrança de markup sobre tokens.

## Estrutura de Arquivos
- `index.html`: Landing page minimalista dark brutalist (SpaceX/Linear style) com shader WebGL de aberração cromática procedural nativo em GLSL.
- `chat.html`: Aplicação de chat funcional com streaming SSE, suporte a microfone (Web Speech API), BYOK e modo demonstração.
- `agent.js`: SDK encapsulado em Shadow DOM para incorporar o assistente em qualquer site via `<script>`.
- `wave-background.js` & `wave.html`: Shader de ondas senoidais com aberração cromática a 60 FPS sem dependências pesadas.
- `.htaccess`: Regras de cache, compactação Brotli/Gzip e cabeçalhos de segurança para LiteSpeed/Hostinger.

## Deploy no Hostinger Git
1. No painel da Hostinger (**hPanel**), acesse **Avançado > Git**.
2. **Repositório**: `https://github.com/OZATI/nave.ozati.co.git`
3. **Branch**: `main`
4. **Diretório**: `/public_html/nave`
5. Clique em **Atualizar / Implementar**.
