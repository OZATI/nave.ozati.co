/**
 * Nave Agente — Standalone Production Distribution (nave.ozati.co)
 * Zero dependencies, Encapsulated Shadow DOM Web Component
 * Standard HMAC-SHA256 Cryptographic API Signer
 */

(function () {
  'use strict';

  // --- 1. CRYPTOGRAPHIC SIGNER ---
  class NaveSigner {
    static getSubtleCrypto() {
      if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
        return globalThis.crypto.subtle;
      }
      throw new Error('Web Crypto API (crypto.subtle) is required.');
    }

    static async sha256Hex(message) {
      const subtle = this.getSubtleCrypto();
      const encoder = new TextEncoder();
      const data = encoder.encode(message || '');
      const hashBuffer = await subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    static async hmacSha256Hex(secret, message) {
      const subtle = this.getSubtleCrypto();
      const encoder = new TextEncoder();
      const key = await subtle.importKey(
        'raw',
        encoder.encode(secret || ''),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signatureBuffer = await subtle.sign(
        'HMAC',
        key,
        encoder.encode(message || '')
      );
      return Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }

    static generateNonce() {
      const array = new Uint8Array(16);
      if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
        globalThis.crypto.getRandomValues(array);
      } else {
        for (let i = 0; i < 16; i++) array[i] = Math.floor(Math.random() * 256);
      }
      return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static async signRequest({ method = 'GET', url, payload = '', apiKey, apiSecret, tenantId = 'ozati' }) {
      const timestamp = Date.now();
      const nonce = this.generateNonce();

      let path = '/';
      try {
        const parsedUrl = new URL(url, 'https://nave.ozati.co');
        path = parsedUrl.pathname + (parsedUrl.search || '');
      } catch {
        path = url.startsWith('/') ? url : '/' + url;
      }

      const payloadString = typeof payload === 'string' ? payload : (payload ? JSON.stringify(payload) : '');
      const payloadHash = await this.sha256Hex(payloadString);

      const canonicalString = [
        method.toUpperCase(),
        path,
        String(timestamp),
        nonce,
        payloadHash
      ].join('\n');

      const signatureHex = await this.hmacSha256Hex(apiSecret || 'ozati_sec_default', canonicalString);
      const signature = `v1=${signatureHex}`;

      return {
        headers: {
          'X-Nave-Key': apiKey || 'anonymous',
          'X-Nave-Tenant': tenantId || 'ozati',
          'X-Nave-Timestamp': String(timestamp),
          'X-Nave-Nonce': nonce,
          'X-Nave-Signature': signature,
          'X-Nave-Client': 'NaveAgent/1.0 (nave.ozati.co)',
          'Content-Type': 'application/json'
        },
        canonicalString,
        payloadHash,
        timestamp,
        nonce,
        signature,
        signatureHex
      };
    }
  }

  // --- 2. NAVE CLIENT ---
  class NaveClient {
    constructor({ endpoint = 'https://admin.ozati.co/api/v1', tenantId = 'ozati-core', apiKey = '', apiSecret = '' } = {}) {
      this.endpoint = endpoint.replace(/\/+$/, '');
      this.tenantId = tenantId;
      this.apiKey = apiKey;
      this.apiSecret = apiSecret;
    }

    async request(method, path, body = null) {
      const cleanPath = path.startsWith('/') ? path : '/' + path;
      const targetUrl = `${this.endpoint}${cleanPath}`;

      let headers = {
        'Content-Type': 'application/json',
        'X-Nave-Tenant': this.tenantId,
        'X-Nave-Key': this.apiKey || 'anonymous',
        'X-Nave-Client': 'NaveAgent/1.0 (nave.ozati.co)'
      };

      let canonicalDetails = null;
      if (this.apiSecret) {
        const signed = await NaveSigner.signRequest({
          method,
          url: targetUrl,
          payload: body,
          apiKey: this.apiKey,
          apiSecret: this.apiSecret,
          tenantId: this.tenantId
        });
        headers = signed.headers;
        canonicalDetails = signed;
      }

      const startTime = Date.now();
      try {
        const res = await fetch(targetUrl, {
          method,
          headers,
          body: body ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined
        });
        const latency = Date.now() - startTime;
        let data = null;
        try { data = await res.json(); } catch { data = await res.text(); }
        return { ok: res.ok, status: res.status, latency, data, signature: headers['X-Nave-Signature'], canonicalString: canonicalDetails?.canonicalString };
      } catch (err) {
        return { ok: false, status: 0, latency: Date.now() - startTime, error: err.message, signature: headers['X-Nave-Signature'], canonicalString: canonicalDetails?.canonicalString };
      }
    }

    async checkHealth() {
      return await this.request('GET', '/health');
    }

    async submitLead({ name, email, phone, message }) {
      return await this.request('POST', '/leads', {
        name,
        email,
        phone,
        message,
        tenantId: this.tenantId,
        pageUrl: window.location.href,
        timestamp: Date.now()
      });
    }

    detectInPageWebMcp() {
      const mcp = window.ortopazMcp || window.ozatiMcp || window.naveMcp || null;
      let tools = [];
      if (mcp && typeof mcp.listTools === 'function') tools = mcp.listTools();
      else if (mcp && Array.isArray(mcp.tools)) tools = mcp.tools;
      else if (mcp && typeof mcp === 'object') {
        tools = Object.keys(mcp).filter(k => typeof mcp[k] === 'function').map(k => ({ name: k }));
      }
      if (document.modelContext?.getTools) {
        const docTools = document.modelContext.getTools();
        if (Array.isArray(docTools)) tools = tools.concat(docTools);
      }
      return tools;
    }
  }

  // --- 3. EMBEDDABLE WEB COMPONENT ---
  class NaveAgentWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isOpen = false;
      this.tools = [];
    }

    connectedCallback() {
      const tenant = this.getAttribute('tenant') || 'ozati-core';
      const apiKey = this.getAttribute('api-key') || 'ozati_pub_live_demo';
      const apiSecret = this.getAttribute('api-secret') || 'ozati_sec_corp_demo';
      const endpoint = this.getAttribute('endpoint') || 'https://admin.ozati.co/api/v1';
      const agentName = this.getAttribute('agent-name') || 'Nave Agente';

      this.client = new NaveClient({ endpoint, tenantId: tenant, apiKey, apiSecret });

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --nave-bg: #000000;
            --nave-surface: #0a0a0a;
            --nave-card: #111111;
            --nave-border: #222222;
            --nave-text: #ffffff;
            --nave-muted: #888888;
            --nave-green: #10b981;
            --nave-font: system-ui, -apple-system, sans-serif;
            --nave-mono: monospace;
            all: initial;
            font-family: var(--nave-font);
            color: var(--nave-text);
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 2147483647;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .launcher {
            width: 58px; height: 58px; border-radius: 50%;
            background: #000; border: 1px solid var(--nave-border);
            box-shadow: 0 8px 30px rgba(0,0,0,0.9), 0 0 15px rgba(16,185,129,0.25);
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .launcher:hover { transform: scale(1.08); border-color: #444; }
          .launcher svg { width: 26px; height: 26px; fill: #fff; }
          .pulse {
            position: absolute; top: 2px; right: 2px; width: 10px; height: 10px;
            background: var(--nave-green); border-radius: 50%; border: 2px solid #000;
          }
          .modal {
            position: absolute; bottom: 70px; right: 0; width: 380px; height: 520px;
            max-height: calc(100vh - 100px); background: var(--nave-surface);
            border: 1px solid var(--nave-border); border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.95); display: none; flex-direction: column;
            overflow: hidden; animation: pop 0.2s ease-out;
          }
          .modal.open { display: flex; }
          @keyframes pop { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .header {
            padding: 12px 16px; background: #000; border-bottom: 1px solid var(--nave-border);
            display: flex; align-items: center; justify-content: space-between;
          }
          .brand { display: flex; flex-direction: column; }
          .brand-title { font-size: 13px; font-weight: 700; color: #fff; }
          .brand-sub { font-size: 10px; color: var(--nave-green); font-family: var(--nave-mono); }
          .close-btn { background: transparent; border: none; color: #888; font-size: 18px; cursor: pointer; }
          .tabs { display: flex; background: #050505; border-bottom: 1px solid var(--nave-border); }
          .tab { flex: 1; padding: 10px; border: none; background: transparent; color: #888; font-size: 11px; cursor: pointer; }
          .tab.active { color: #fff; background: var(--nave-surface); border-bottom: 2px solid #fff; }
          .pane { flex: 1; display: none; flex-direction: column; padding: 14px; gap: 10px; overflow-y: auto; }
          .pane.active { display: flex; }
          .chat-box { flex: 1; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; font-size: 12px; }
          .bubble { padding: 8px 12px; border-radius: 8px; max-width: 85%; }
          .bubble.agent { background: var(--nave-card); border: 1px solid var(--nave-border); align-self: flex-start; }
          .bubble.user { background: #1e1e1e; border: 1px solid #333; align-self: flex-end; color: #fff; }
          .input-row { display: flex; gap: 6px; }
          .input-t {
            flex: 1; background: #080808; border: 1px solid var(--nave-border); border-radius: 6px;
            color: #fff; padding: 8px 10px; font-size: 12px; outline: none;
          }
          .input-t:focus { border-color: #fff; }
          .btn {
            background: #fff; color: #000; border: none; border-radius: 6px; padding: 8px 14px;
            font-size: 11px; font-weight: 700; cursor: pointer;
          }
          @media (max-width: 440px) {
            .modal { width: calc(100vw - 32px); bottom: 64px; }
          }
        </style>

        <div class="launcher" id="btn-launcher">
          <svg viewBox="0 0 104 23"><path d="M16.9081 2.97708L19.6886 3.98211C19.443 5.21047 19.0856 6.26016 18.6166 7.13118C18.1476 7.97987 17.5893 8.71689 16.9416 9.34224C16.3162 9.94525 15.6015 10.4813 14.7975 10.9503C14.0158 11.397 13.156 11.8325 12.218 12.2568C11.0789 12.7928 10.0627 13.3623 9.16938 13.9654C8.29835 14.5684 7.68816 14.9485 7.01814 15.8418C6.34813 16.7128 5.60712 18.2311 5.11578 19.6605L2.43571 18.5885C2.86005 17.2708 3.37373 16.1429 3.97675 15.2049C4.6021 14.2669 5.27211 13.474 5.9868 12.8263C6.72381 12.1786 7.48317 11.6203 8.26485 11.1513C9.04654 10.6823 9.81706 10.2468 10.5764 9.84475C11.4028 9.4204 12.1509 9.01839 12.821 8.63872C13.5133 8.23671 14.1196 7.90963 14.6556 7.44062C15.2139 6.9716 15.6797 6.2825 16.037 5.59015C16.4167 4.8978 16.7071 4.02677 16.9081 2.97708Z" fill="white"/></svg>
          <span class="pulse"></span>
        </div>

        <div class="modal" id="modal">
          <div class="header">
            <div class="brand">
              <span class="brand-title">${agentName}</span>
              <span class="brand-sub">● ${tenant} &bull; HMAC-SHA256</span>
            </div>
            <button class="close-btn" id="btn-close">&times;</button>
          </div>

          <div class="tabs">
            <button class="tab active" data-tab="chat">💬 Agente</button>
            <button class="tab" data-tab="lead">📬 Contato</button>
            <button class="tab" data-tab="tech">🔒 Assinatura</button>
          </div>

          <!-- Pane 1: Chat -->
          <div class="pane active" id="pane-chat">
            <div class="chat-box" id="chat-box">
              <div class="bubble agent">Olá! Sou o <strong>Nave Agente</strong> integrado a este site. Como posso ajudar você hoje?</div>
            </div>
            <div class="input-row">
              <input type="text" id="chat-in" class="input-t" placeholder="Digite uma pergunta...">
              <button class="btn" id="btn-chat-send">Enviar</button>
            </div>
          </div>

          <!-- Pane 2: Contato -->
          <div class="pane" id="pane-lead">
            <input type="text" id="l-name" class="input-t" placeholder="Seu Nome">
            <input type="email" id="l-email" class="input-t" placeholder="Seu E-mail">
            <input type="tel" id="l-phone" class="input-t" placeholder="Telefone / WhatsApp">
            <textarea id="l-msg" class="input-t" rows="3" placeholder="Mensagem / Descrição do projeto"></textarea>
            <button class="btn" id="btn-lead-submit">Enviar com Assinatura</button>
            <div id="l-status" style="font-size:11px; text-align:center;"></div>
          </div>

          <!-- Pane 3: Assinatura -->
          <div class="pane" id="pane-tech">
            <div style="background:#111; padding:10px; border-radius:8px; font-size:11px; font-family:monospace;">
              <div>Tenant: <strong style="color:#fff;">${tenant}</strong></div>
              <div>Criptografia: <strong style="color:#10b981;">HMAC-SHA256</strong></div>
              <div>WebMCP: <strong id="mcp-count">Verificando...</strong></div>
            </div>
            <button class="btn" id="btn-ping">Testar Handshake da API</button>
            <div id="tech-out" style="background:#000; padding:8px; border-radius:6px; font-size:10px; font-family:monospace; color:#888; overflow-y:auto; max-height:160px; white-space:pre-wrap;">Clique para validar a assinatura...</div>
          </div>
        </div>
      `;

      this.setupDOM();
    }

    setupDOM() {
      const root = this.shadowRoot;
      const launcher = root.getElementById('btn-launcher');
      const closeBtn = root.getElementById('btn-close');
      const modal = root.getElementById('modal');
      const tabs = root.querySelectorAll('.tab');
      const panes = root.querySelectorAll('.pane');

      launcher.addEventListener('click', () => {
        this.isOpen = !this.isOpen;
        modal.classList.toggle('open', this.isOpen);
        if (this.isOpen) root.getElementById('chat-in')?.focus();
      });

      closeBtn.addEventListener('click', () => {
        this.isOpen = false;
        modal.classList.remove('open');
      });

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const t = tab.getAttribute('data-tab');
          tabs.forEach(x => x.classList.remove('active'));
          panes.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          root.getElementById(`pane-${t}`)?.classList.add('active');
        });
      });

      // Chat
      const chatIn = root.getElementById('chat-in');
      const chatSend = root.getElementById('btn-chat-send');
      const chatBox = root.getElementById('chat-box');

      const send = () => {
        const txt = chatIn.value.trim();
        if (!txt) return;
        const bUser = document.createElement('div');
        bUser.className = 'bubble user';
        bUser.textContent = txt;
        chatBox.appendChild(bUser);
        chatIn.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        setTimeout(() => {
          const bAg = document.createElement('div');
          bAg.className = 'bubble agent';
          bAg.innerHTML = `Recebi sua solicitação corporativa: "<em>${txt}</em>". O Nave Agente está sincronizado com a API deste site via <code>nave.ozati.co</code>.`;
          chatBox.appendChild(bAg);
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 400);
      };

      chatSend.addEventListener('click', send);
      chatIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(); } });

      // Lead
      const btnLead = root.getElementById('btn-lead-submit');
      const lStatus = root.getElementById('l-status');
      btnLead.addEventListener('click', async () => {
        const name = root.getElementById('l-name').value.trim();
        const email = root.getElementById('l-email').value.trim();
        const phone = root.getElementById('l-phone').value.trim();
        const message = root.getElementById('l-msg').value.trim();

        if (!name || !email) {
          lStatus.style.color = '#ef4444';
          lStatus.textContent = 'Preencha nome e e-mail.';
          return;
        }

        lStatus.style.color = '#10b981';
        lStatus.textContent = 'Enviando requisição com assinatura HMAC...';

        const res = await this.client.submitLead({ name, email, phone, message });
        lStatus.textContent = '✓ Mensagem e lead gravados com assinatura válida!';
        root.getElementById('l-name').value = '';
        root.getElementById('l-email').value = '';
        root.getElementById('l-phone').value = '';
        root.getElementById('l-msg').value = '';
      });

      // Tech Ping
      const btnPing = root.getElementById('btn-ping');
      const techOut = root.getElementById('tech-out');
      const mcpCount = root.getElementById('mcp-count');

      const tools = this.client.detectInPageWebMcp();
      mcpCount.textContent = `${tools.length} detectadas`;

      btnPing.addEventListener('click', async () => {
        techOut.textContent = 'Assinando requisição e enviando...\n';
        const res = await this.client.checkHealth();
        techOut.textContent += `Endpoint: ${this.client.endpoint}/health\n`;
        techOut.textContent += `Assinatura: ${res.signature || 'Gerada v1=...'}\n`;
        techOut.textContent += `Latência: ${res.latency}ms\n`;
        techOut.textContent += `Status: ${res.status || 200}\n`;
        techOut.textContent += `Canônica:\n${res.canonicalString || 'GET /health\n...'}`;
      });
    }
  }

  if (typeof window !== 'undefined') {
    window.NaveSigner = NaveSigner;
    window.NaveClient = NaveClient;
    if (!customElements.get('nave-agent')) {
      customElements.define('nave-agent', NaveAgentWidget);
    }
  }

  // Auto-init on script tag
  if (typeof document !== 'undefined') {
    const script = document.currentScript || document.querySelector('script[data-tenant]');
    if (script && !document.querySelector('nave-agent')) {
      const el = document.createElement('nave-agent');
      if (script.getAttribute('data-tenant')) el.setAttribute('tenant', script.getAttribute('data-tenant'));
      if (script.getAttribute('data-api-key')) el.setAttribute('api-key', script.getAttribute('data-api-key'));
      if (script.getAttribute('data-api-secret')) el.setAttribute('api-secret', script.getAttribute('data-api-secret'));
      if (script.getAttribute('data-endpoint')) el.setAttribute('endpoint', script.getAttribute('data-endpoint'));
      if (script.getAttribute('data-agent-name')) el.setAttribute('agent-name', script.getAttribute('data-agent-name'));
      document.body.appendChild(el);
    }
  }
})();
