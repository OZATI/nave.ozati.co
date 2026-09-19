import { useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { NaveChatInput } from "@/components/ui/border-beam-demo";

interface NaveHeroProps {
  onInteract?: () => void;
}

export function NaveHero({ onInteract }: NaveHeroProps) {
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const handlePromptSend = (val: string) => {
    setLastPrompt(val);
    onInteract?.();
  };

  return (
    <section className="relative text-center max-w-4xl mx-auto pt-10 pb-12 px-4">
      {/* Luz ambiente de fundo no Hero */}
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
        <p className="text-xs font-mono text-emerald-400 mb-4 animate-fade-in">
          ✓ Comando despachado via HMAC-SHA256: &ldquo;{lastPrompt}&rdquo;
        </p>
      )}

      {/* Sugestões Rápidas */}
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
  );
}

export default NaveHero;
