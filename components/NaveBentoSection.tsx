import { useState } from "react";
import { 
  ShieldCheck, 
  ArrowUpRight, 
  Sparkles, 
  Lock,
  Layers,
  Globe2,
  Boxes,
  Zap,
  Radio
} from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { Compose, type ComposeMention, type ComposeCommand } from "@/components/ui/compose";
import GatewayFlow from "@/components/ui/gateway-flow";
import { BloimAnimationBackground } from "@/components/ui/bloim-animation-background";

const BENTO_MENTIONS: ComposeMention[] = [
  { id: "claude", label: "claude", sublabel: "Claude 3.7 Sonnet (Anthropic)" },
  { id: "gpt4o", label: "gpt4o", sublabel: "GPT-4o Omni (OpenAI)" },
  { id: "deepseek", label: "deepseek", sublabel: "DeepSeek R1 (Reasoner)" },
];

const BENTO_COMMANDS: ComposeCommand[] = [
  { id: "resumir", label: "resumir", hint: "Resumir contexto ativo" },
  { id: "comparar", label: "comparar", hint: "Comparar respostas de IAs" },
  { id: "mcp", label: "mcp", hint: "Chamar ferramenta MCP do sistema" },
];

export function NaveBentoSection() {
  const [promptFeedback, setPromptFeedback] = useState<string | null>(null);

  const handleComposeSubmit = (text: string) => {
    setPromptFeedback(text);
    if (typeof window !== "undefined") {
      window.open(`https://chat.ozati.co/?prompt=${encodeURIComponent(text)}&send=1`, "_blank");
    }
  };

  return (
    <section id="bento" className="w-full max-w-7xl mx-auto px-4 py-20">
      {/* Cabeçalho do Bento Grid */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 w-fit text-xs font-mono text-emerald-400 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            NAVE ENGINE • BENTO GRID TOPOLOGIA
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            A Camada de Inteligência Nave em 5 Blocos
          </h2>
          <p className="text-zinc-400 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
            5 componentes essenciais de nova geração integrados: interfaces 3D imersivas, composição agêntica inline, feixe luminoso de perímetro e malha de nós em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="px-3.5 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 text-zinc-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
            5 CARDS ATIVOS
          </span>
        </div>
      </div>

      {/* Grid Bento de 5 Cards (Linha 1: 7 cols + 5 cols | Linha 2: 4 cols + 4 cols + 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* =========================================================================
            CARD 1: Spline 3D Crystal Ball (7 colunas)
            ========================================================================= */}
        <div className="lg:col-span-7 relative min-h-[440px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/90 shadow-2xl flex flex-col justify-between group backdrop-blur-md">
          {/* Iframe Spline 3D Interativo */}
          <div className="absolute inset-0 z-0">
            <iframe
              src="https://my.spline.design/crystalball-de222de54d6fc4752fa850b54fb654de/"
              className="w-full h-full border-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              title="Spline 3D Crystal Ball"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-10" />
          </div>

          {/* HUD Superior */}
          <div className="relative z-20 p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-700/60 text-xs text-zinc-200 font-mono shadow-lg">
              <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>SPLINE 3D • AURA ESPACIAL</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-500/20">
              WebGL 120 FPS
            </span>
          </div>

          {/* Footer Card 1 */}
          <div className="relative z-20 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  01 • Interface Espacial
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Aura Tridimensional dos Agentes
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  Renderização 3D de alta fidelidade que reage à voz, cursor e presença do usuário para orquestração espacial de IA.
                </p>
              </div>
              <a
                href="https://chat.ozati.co"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl border border-white/10 bg-white/5 text-emerald-400 hover:bg-white/10 transition-colors"
                title="Abrir no Nave Chat"
              >
                <ArrowUpRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: Compose Prompt Engine (5 colunas)
            ========================================================================= */}
        <div className="lg:col-span-5 relative min-h-[440px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          {/* Header Card 2 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
              <Boxes className="h-3.5 w-3.5" />
              <span>COMPOSE • @MENTIONS &amp; /COMMANDS</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
              Inline Engine
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Compositor Agêntico de Prompts</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4">
              Experimente digitar <kbd className="text-emerald-400 font-mono">@</kbd> para selecionar o modelo ou <kbd className="text-cyan-400 font-mono">/</kbd> para comandos inline.
            </p>

            {/* Componente Compose Interativo */}
            <div className="relative">
              <Compose
                placeholder="Pergunte ao Nave, mencione @modelo ou digite / para comandos..."
                maxLength={300}
                mentions={BENTO_MENTIONS}
                commands={BENTO_COMMANDS}
                onSubmit={handleComposeSubmit}
                submitLabel="Despachar"
                className="w-full"
              />
            </div>

            {promptFeedback && (
              <p className="text-[11px] font-mono text-emerald-400 mt-2 truncate">
                ✓ Enviado para Nave Chat: &ldquo;{promptFeedback}&rdquo;
              </p>
            )}
          </div>

          {/* Footer Card 2 */}
          <div className="pt-3 border-t border-zinc-800/80 mt-4 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>02 • Atalhos &amp; Produtividade</span>
            <span className="text-emerald-400">Ring SVG Dinâmico</span>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: Magic UI Border Beam (4 colunas)
            ========================================================================= */}
        <div className="lg:col-span-4 relative min-h-[380px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <BorderBeam size="md" colorVariant="colorful" duration={2.8} className="h-full w-full">
            <div className="relative z-10 p-6 h-full flex flex-col justify-between bg-zinc-950/95 rounded-3xl">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-purple-950/30 border border-purple-500/30 text-purple-300 flex items-center gap-1.5">
                    <Zap className="h-3 w-3" /> BORDER BEAM
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">Perímetro Criptográfico Zero Trust</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Proteção perimetral ativa com feixe de luz guiado e verificação HMAC-SHA256.
                </p>

                {/* Telemetria de Segurança */}
                <div className="mt-4 p-3 rounded-2xl bg-black/80 border border-zinc-800/80 font-mono text-[10px] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">X-Nave-Signature</span>
                    <span className="text-emerald-400 font-semibold truncate">v1=9941a87b...</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">X-Nave-Nonce</span>
                    <span className="text-zinc-300">16-byte anti-replay</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Segredo Mestre</span>
                    <span className="text-purple-300">HMAC-SHA256</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-mono">
                  <Lock className="h-3 w-3" /> 03 • Assinado &amp; Seguro
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Magic UI</span>
              </div>
            </div>
          </BorderBeam>
        </div>

        {/* =========================================================================
            CARD 4: Bloim Animation Background (Serge Bunas / Unicorn Studio Shader)
            ========================================================================= */}
        <div className="lg:col-span-4 relative min-h-[380px] rounded-3xl overflow-hidden border border-zinc-800 bg-black shadow-2xl flex flex-col justify-between group">
          {/* Bloim Animation Background Component */}
          <div className="absolute inset-0 z-0">
            <BloimAnimationBackground />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 z-10" />
          </div>

          {/* Header Card 4 */}
          <div className="relative z-20 p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/20 text-xs text-cyan-300 font-mono">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>BLOIM ANIMATION BACKGROUND</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-500/20">
              Bloom &bull; Shaders
            </span>
          </div>

          {/* Footer Card 4 */}
          <div className="relative z-20 p-6 bg-gradient-to-t from-black via-black/85 to-transparent">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              04 • Bloim Shader FX
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              Bloim Animation Background
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Shader orgânico de Bloom e partículas aceleradas por WebGL GPU (Serge Bunas / Unicorn Studio) para feedback háptico visual dos agentes.
            </p>
          </div>
        </div>

        {/* =========================================================================
            CARD 5: Gateway Flow (4 colunas)
            ========================================================================= */}
        <div className="lg:col-span-4 relative min-h-[380px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col justify-between group">
          {/* Canvas GatewayFlow */}
          <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <GatewayFlow className="h-full w-full" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />
          </div>

          {/* Header Card 5 */}
          <div className="relative z-20 p-6 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs text-emerald-400 font-mono">
              <Layers className="h-3.5 w-3.5" />
              <span>GATEWAY FLOW</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              Mesh Ativa
            </span>
          </div>

          {/* Metrics & Footer Card 5 */}
          <div className="relative z-20 p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="grid grid-cols-2 gap-2 border-b border-zinc-800 pb-3 mb-3">
              <div>
                <span className="text-[9px] font-mono uppercase text-zinc-500">Fluxo de Tokens</span>
                <p className="text-sm font-bold font-mono text-white">18.4K <span className="text-[10px] text-zinc-400 font-sans">tok/s</span></p>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-zinc-500">Latência P50</span>
                <p className="text-sm font-bold font-mono text-emerald-400">14 <span className="text-[10px] text-zinc-400 font-sans">ms</span></p>
              </div>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              05 • Topologia de Nós
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              Malha de Conexões em Tempo Real
            </h4>
            <p className="text-xs text-zinc-400 mt-1">
              Convergência dinâmica de nós com balanceamento autônomo e failover sem interrupções.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default NaveBentoSection;
