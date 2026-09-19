"use client";

import React, { useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { AtSign, ChevronDown, ArrowUp, Sparkles } from "lucide-react";

interface ChatInputProps {
  onSend?: (value: string) => void;
}

export function NaveChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [agent, setAgent] = useState("Nave Agente");
  const [mode, setMode] = useState("Auto");

  const toggleAgent = () => {
    setAgent((prev) => (prev === "Nave Agente" ? "DeepSeek R1" : prev === "DeepSeek R1" ? "Claude 3.7" : "Nave Agente"));
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "Auto" ? "WebMCP" : prev === "WebMCP" ? "BYOK" : "Auto"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSend?.(value);
      setValue("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-[360px] max-w-full rounded-[22px] bg-[#121215] p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_40px_0_rgba(16,185,129,0.03)] transition-colors"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <div className="flex flex-col h-[130px] justify-between">
        {/* Topo do Input: Chip de Menção / Contexto */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Mencionar agente ou sistema"
            className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
          >
            <AtSign className="h-3 w-3 text-emerald-400" aria-hidden="true" />
            <span className="text-[11px] font-mono">nave</span>
          </button>

          <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Zero Trust
          </span>
        </div>

        {/* Campo de Entrada de Texto */}
        <div className="px-1 py-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Peça à Nave ou execute um comando…"
            aria-label="Mensagem ou comando para a Nave"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
        </div>

        {/* Barra de Ações Inferior: Seletores & Botão de Envio */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={toggleAgent}
            aria-label={`Agente selecionado: ${agent}. Clique para alternar.`}
            className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-emerald-400" aria-hidden="true" />
            <span>{agent}</span>
            <ChevronDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={toggleMode}
            aria-label={`Modo de execução: ${mode}. Clique para alternar.`}
            className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.06] text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 cursor-pointer"
          >
            <span>{mode}</span>
            <ChevronDown className="h-3 w-3 text-zinc-500" aria-hidden="true" />
          </button>

          {/* Botão de Enviar com acento Nave Emerald */}
          <button
            type="submit"
            aria-label="Enviar comando para a Nave"
            className="ml-auto flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
          >
            <ArrowUp className="h-3.5 w-3.5 stroke-[2.2]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </form>
  );
}

export default function BorderBeamDemo() {
  return (
    <div className="relative flex items-center justify-center w-full max-w-2xl min-h-[360px] mx-auto p-8 rounded-3xl bg-[#09090b] border border-zinc-800/80 shadow-2xl overflow-hidden">
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl" 
      />

      <BorderBeam size="md" colorVariant="colorful" duration={2.2}>
        <NaveChatInput />
      </BorderBeam>
    </div>
  );
}
