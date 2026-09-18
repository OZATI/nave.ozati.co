# nave.ozati.co

Landing page oficial e distribuição do navegador desktop **Nave** do ecossistema **OZATI**.

## 🌐 Endereço Oficial
- [https://nave.ozati.co](https://nave.ozati.co)

## 📁 Estrutura do Repositório
- `index.html`: Landing page ultra rápida, sem dependências externas bloqueantes, otimizada para Core Web Vitals (100/100).
- `nave.svg`: Logotipo oficial vetorial do Nave.
- `favicon.svg` & `favicon.ico`: Ícones de aba e favoritos.
- `.htaccess`: Regras de compressão Gzip/Brotli, cache headers e segurança para servidores Hostinger / LiteSpeed / Apache.

## 🚀 Integração com Hostinger Git
1. No painel da Hostinger (**hPanel**), acesse o gerenciamento do domínio `ozati.co`.
2. Vá em **Avançado > Git**.
3. **Repositório**: `https://github.com/OZATI/nave.ozati.co.git`
4. **Branch**: `main`
5. **Diretório de instalação**: `/public_html/nave`
   *(Importante: o subdomínio nave.ozati.co aponta para `/home/u879659065/domains/ozati.co/public_html/nave`)*
6. Clique em **Criar / Implementar**.
7. *(Se necessário)*: Pelo **Gerenciador de Arquivos**, entre na pasta `public_html/nave` e remova o arquivo padrão `default.php` para que o `index.html` assuma imediatamente.
