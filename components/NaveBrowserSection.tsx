import type { FC } from 'react'
import {
  Download,
  Zap,
  ShieldCheck,
  Cpu,
  Puzzle,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { NaveLogo } from './NaveLogo'

interface NaveBrowserSectionProps {
  onInteract?: () => void
}

export const NaveBrowserSection: FC<NaveBrowserSectionProps> = ({ onInteract }) => {
  return (
    <section id="nave" className="mt-16 sm:mt-24 pt-12 border-t border-zinc-800/80 scroll-mt-20">
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-zinc-900/80 via-zinc-950/90 to-black border border-emerald-500/20 overflow-hidden shadow-2xl shadow-emerald-950/20">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          {/* Header & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Lançamento Oficial • Nave v1.0</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Base Chromium 151 Pure</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-700/80 flex items-center justify-center p-2.5 shadow-lg shadow-emerald-950/40">
                  <NaveLogo variant="icon" size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Nave
                  </h2>
                  <p className="text-xs text-emerald-400 font-medium">
                    O Navegador Desktop da OZATI
                  </p>
                </div>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                A velocidade bruta do Chromium.{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Sem telemetria e sem travas.
                </span>
              </h3>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Desenvolvido para quem exige desempenho extremo. Eliminamos todas as conexões
                fantasmas de fundo, liberamos aceleração direta por GPU e garantimos 100% de
                compatibilidade com qualquer extensão da Chrome Web Store.
              </p>

              {/* Botões de Download */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href="https://github.com/OZATI/nave-browser/releases/latest/download/Nave-v1.0.0-win64.zip"
                  onClick={onInteract}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Nave para Windows (x64)</span>
                </a>

                <a
                  href="https://nave.ozati.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Site Oficial (nave.ozati.co)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                </a>
              </div>
            </div>

            {/* Mockup da Janela do Navegador */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-800 bg-black/80 shadow-2xl p-3 space-y-3 backdrop-blur-md">
                {/* Barra de título do Nave */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 text-zinc-300 text-[11px] font-mono border border-zinc-800">
                    <NaveLogo variant="icon" size={13} className="text-emerald-400" />
                    <span>nave://start</span>
                  </div>
                  <div className="w-4" />
                </div>

                {/* Prévia interna */}
                <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-900 space-y-3 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2.5">
                    <NaveLogo variant="icon" size={26} className="text-white" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Nave Pronto para Decolar</h4>
                  <p className="text-xs text-zinc-500">
                    Aceleração de GPU ativada • Zero rastreadores • Cache em SSD
                  </p>
                  <div className="flex justify-center gap-2 pt-1 text-[10px] font-mono text-emerald-400">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      0ms telemetry
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      120 FPS render
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards com os 4 Pilares do Nave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-zinc-800/80">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">Velocidade Pura</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Sem processos fantasmas em segundo plano. Inicialização em menos de 0,5s e consumo
                de RAM reduzido.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">Aceleração por GPU</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Rasterização direta pela placa de vídeo. Vídeos em 4K e páginas pesadas sem
                engasgar a CPU.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Puzzle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">Extensões Chrome</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Suporte nativo e irrestrito a qualquer extensão da Chrome Web Store com 1 clique.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">Privacidade Local</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Seus dados, histórico e senhas ficam isolados na sua máquina. Zero dados vendidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
