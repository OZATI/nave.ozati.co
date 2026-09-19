import { useState } from "react";
import GatewayFlow from "@/components/ui/gateway-flow";
import { BorderBeam } from "@/components/ui/border-beam";
import { NaveChatInput } from "@/components/ui/border-beam-demo";
import { 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  ArrowUpRight, 
  CheckCircle2, 
  Cpu, 
  KeyRound,
  Layers,
  Network
} from "lucide-react";

export function NaveHeroSection() {
  const [selectedModel, setSelectedModel] = useState<"claude" | "gpt" | "deepseek">("claude");
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const handlePromptSend = (val: string) => {
    setLastPrompt(val);
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* =========================================================================
          1. HERO COM CHAT INPUT + BORDER BEAM
         ========================================================================= */}
      <section className="relative text-center max-w-4xl mx-auto pt-8 pb-16 px-4">
        {/* Glow de fundo do Hero */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-cyan-500/5 to-transparent blur-[120px] rounded-full -z-10" 
        />

        {/* Badge do Hero */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>NAVE AI • CHAT CONTEXTUAL & AGENTES</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12] mb-4">
          Converse com as Melhores IAs <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Lado a Lado com seus Sistemas
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          O Nave é a camada de interface universal entre você, os modelos de IA mais avançados do mundo e os softwares da sua rotina diária.
        </p>

        {/* CHAT INPUT COM BORDER BEAM NO HERO */}
        <div className="relative flex items-center justify-center max-w-xl mx-auto mb-6">
          <BorderBeam size="md" colorVariant="colorful" duration={2.4}>
            <NaveChatInput onSend={handlePromptSend} />
          </BorderBeam>
        </div>

        {lastPrompt && (
          <p className="text-xs font-mono text-emerald-400 mb-4">
            ✓ Comando despachado via HMAC-SHA256: &ldquo;{lastPrompt}&rdquo;
          </p>
        )}

        {/* Pills de Ação Rápida */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-zinc-400">
          <span className="text-zinc-600">Sugestões:</span>
          {["Resuma este prontuário", "Analise a tela ativa", "OpenRouter BYOK"].map((s, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-300 cursor-pointer hover:border-emerald-500/40 hover:text-emerald-300 transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* =========================================================================
          2. SEÇÃO BENTO GRID: 50% PRINCIPAL (GatewayFlow) + 50% QUADROS 2x2
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 w-fit text-xs font-mono text-emerald-400 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TOPOLOGIA NAVE ENGINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Arquitetura de Borda & Roteamento Agêntico
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Malha distribuída de tráfego, protocolo criptográfico Zero Trust e telemetria em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80">
              TENANT: <strong className="text-white">nave.ozati.co</strong>
            </span>
          </div>
        </div>

        {/* Bento Grid 50% / 50% */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 h-auto lg:h-[580px]">
          
          {/* Quadro Principal (50% no Desktop) com GatewayFlow */}
          <div className="relative h-[480px] lg:h-full rounded-3xl border border-zinc-800/90 bg-zinc-950 overflow-hidden shadow-2xl flex flex-col justify-between group">
            <div className="pointer-events-none absolute -top-28 -left-28 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl z-10" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 z-10" />

            <div className="absolute inset-0">
              <GatewayFlow className="h-full w-full" />
            </div>

            {/* Topo do Quadro */}
            <div className="relative z-20 p-6 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-700/60 text-xs text-zinc-200 shadow-md font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Nave Mesh Sincronizada</span>
              </div>

              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 text-[11px] font-mono text-zinc-400">
                <Network className="h-3.5 w-3.5 text-zinc-400" />
                <span>WebMCP Bridge Ativa</span>
              </div>
            </div>

            {/* Rodapé do Quadro */}
            <div className="relative z-20 p-6 bg-gradient-to-t from-black via-zinc-950/95 to-transparent">
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-800/80 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Fluxo de Tokens</span>
                  <p className="text-base sm:text-xl font-bold font-mono text-white">18.4K <span className="text-xs text-zinc-400 font-sans">tok/s</span></p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Latência Borda</span>
                  <p className="text-base sm:text-xl font-bold font-mono text-emerald-400">14 <span className="text-xs text-zinc-400 font-sans">ms</span></p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">Assinatura</span>
                  <p className="text-base sm:text-xl font-bold font-mono text-zinc-200">HMAC-256</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                    Orquestração Central
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    Conexão Direta com Provedores e Sistemas
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Roteia prompts, lê dados visíveis de tela e despacha ações com zero latência residual.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-emerald-400">
                  <Layers className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Os 4 Quadros Laterais (50% em 2x2 com micro-componentes Nave) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 sm:gap-5 h-full">
            
            {/* Card 1: BYOK Multi-LLM */}
            <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-950/70 p-5 flex flex-col justify-between hover:border-zinc-700/80 hover:bg-zinc-900/30 transition-all group backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-purple-300">
                    BYOK • OpenRouter
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">Roteamento Multi-Modelos</h4>
                <p className="text-xs text-zinc-400">Sua chave, seus tokens, zero markup.</p>

                <div className="mt-3 flex gap-1.5 p-1 bg-black/60 rounded-xl border border-zinc-900">
                  {[
                    { id: "claude", label: "Claude 3.7" },
                    { id: "gpt", label: "GPT-4o" },
                    { id: "deepseek", label: "DeepSeek R1" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedModel(m.id as any)}
                      className={`flex-1 py-1 text-[10px] font-mono rounded-lg transition-all ${
                        selectedModel === m.id 
                          ? "bg-purple-600/30 text-purple-200 border border-purple-500/30 font-semibold" 
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-baseline justify-between pt-1 border-t border-zinc-900">
                <span className="text-[11px] font-mono text-zinc-500">Latência do Modelo:</span>
                <span className="text-sm font-mono font-bold text-white">
                  {selectedModel === "claude" ? "420ms" : selectedModel === "gpt" ? "380ms" : "290ms"}
                </span>
              </div>
            </div>

            {/* Card 2: Assinatura HMAC-SHA256 */}
            <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-950/70 p-5 flex flex-col justify-between hover:border-zinc-700/80 hover:bg-zinc-900/30 transition-all group backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-950/30 border border-emerald-500/30 text-emerald-400">
                    Zero Trust
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">Assinatura de API</h4>
                <p className="text-xs text-zinc-400">Proteção anti-adulteração com Nonce</p>

                <div className="mt-3 p-2 rounded-xl bg-black/60 border border-zinc-900 font-mono text-[9px] text-zinc-400 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">X-Nave-Signature</span>
                    <span className="text-emerald-400">v1=9941a87b...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">X-Nave-Nonce</span>
                    <span className="text-zinc-300">16-byte replay safe</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 pt-1 border-t border-zinc-900">
                <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Assinado & Verificado
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 3: Consciência de Tela */}
            <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-950/70 p-5 flex flex-col justify-between hover:border-zinc-700/80 hover:bg-zinc-900/30 transition-all group backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                    DOM Context
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">Consciência de Tela</h4>
                <p className="text-xs text-zinc-400">Lê CRMs, ERPs e prontuários ativos</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Clinic Kiosk", "Active URL", "Selection Text", "WebMCP"].map((ctx, i) => (
                    <span 
                      key={i} 
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      {ctx}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-900">
                <span className="flex items-center gap-1 font-mono">
                  <Cpu className="h-3 w-3 text-zinc-400" /> Side Panel Ativo
                </span>
                <span className="text-zinc-400 font-mono">1-Click Prompt</span>
              </div>
            </div>

            {/* Card 4: Event Stream & Auditoria */}
            <div className="relative rounded-3xl border border-zinc-800/90 bg-zinc-950/70 p-5 flex flex-col justify-between hover:border-zinc-700/80 hover:bg-zinc-900/30 transition-all group backdrop-blur-sm">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-400">LIVE FEED</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-white">Event Stream</h4>
                <p className="text-xs text-zinc-400">Auditoria instantânea de chamadas</p>

                <div className="mt-2.5 rounded-xl bg-black/80 border border-zinc-900 p-2 font-mono text-[9px] space-y-1">
                  <div className="flex items-center gap-1 text-zinc-300 truncate">
                    <span className="text-emerald-400 font-bold">200</span>
                    <span className="text-zinc-500">POST</span>
                    <span className="truncate">/v1/lead (signed)</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-300 truncate">
                    <span className="text-cyan-400 font-bold">MCP</span>
                    <span className="text-zinc-500">TOOL</span>
                    <span className="truncate">ortopazMcp.detect()</span>
                  </div>
                  <div className="flex items-center gap-1 text-purple-300 truncate">
                    <span className="text-purple-400 font-bold">BYOK</span>
                    <span className="text-zinc-500">OPENROUTER</span>
                    <span className="truncate">claude-3-7-sonnet</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-900">
                <span className="font-mono text-zinc-400">nave.submitLead()</span>
                <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1">
                  Ver SDK <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}

export default NaveHeroSection;
