import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { ArrowUp, AtSign, ChevronDown, Mic } from "lucide-react";

import { BorderBeam } from "@/components/ui/border-beam";

/* ─────────────────────────────────────────────────────────────
   Reconhecimento de voz (Web Speech API)
   Funciona em Chrome, Edge e Safari. No Firefox o botão fica desativado.
   ───────────────────────────────────────────────────────────── */

interface SpeechResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechEventLike {
  results: ArrayLike<SpeechResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function useVoiceInput(opts: {
  lang?: string;
  onStart?: () => void;
  onText: (transcript: string) => void;
}) {
  const { lang = "pt-BR", onStart, onText } = opts;
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const cbRef = useRef({ onStart, onText });
  cbRef.current = { onStart, onText };

  useEffect(() => {
    setSupported(getSpeechRecognition() !== null);
    return () => recRef.current?.stop();
  }, []);

  const toggle = useCallback(() => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      const text = Array.from(e.results, (r) => r[0].transcript).join("");
      cbRef.current.onText(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    cbRef.current.onStart?.();
    rec.start();
    setListening(true);
  }, [listening, lang]);

  return { supported, listening, toggle };
}

/* ───────────────────────────────────────────────────────────── */

const CHIP: CSSProperties = {
  borderRadius: 36,
  background: "rgba(255,255,255,0.04)",
  boxShadow:
    "inset 0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 0 rgba(255,255,255,0.04)",
};

const SELECT_CHIP: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  height: 24,
  padding: "0 6px 0 8px",
  fontSize: 12,
  lineHeight: "14px",
  color: "#caccd2",
  ...CHIP,
};

const ICON_BUTTON: CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  padding: 0,
  border: 0,
  cursor: "pointer",
  ...CHIP,
};

const CSS = `
.chat-input__textarea::placeholder { color: #4e4e4e; }
.chat-input__textarea:focus { outline: none; }
.chat-input__btn:focus-visible { outline: 2px solid rgba(255,255,255,.5); outline-offset: 2px; }
.chat-input__btn:disabled { cursor: not-allowed; opacity: .5; }
@keyframes chat-input-voice-pulse {
  0%   { transform: scale(1);   opacity: .55; }
  100% { transform: scale(1.9); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .chat-input__pulse { animation: none !important; opacity: .35 !important; }
}
`;

function VoiceButton(props: {
  supported: boolean;
  listening: boolean;
  onClick: () => void;
}) {
  const { supported, listening, onClick } = props;
  return (
    <button
      type="button"
      className="chat-input__btn"
      onClick={onClick}
      disabled={!supported}
      aria-pressed={listening}
      aria-label={listening ? "Parar gravação" : "Falar"}
      title={
        !supported
          ? "Voz não é suportada neste navegador"
          : listening
            ? "Parar gravação"
            : "Falar"
      }
      style={{
        ...ICON_BUTTON,
        background: listening ? "rgba(255,84,84,0.16)" : CHIP.background,
        transition: "background .2s",
      }}
    >
      {listening && (
        <span
          aria-hidden="true"
          className="chat-input__pulse"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 36,
            background: "rgba(255,84,84,0.45)",
            animation: "chat-input-voice-pulse 1.4s ease-out infinite",
          }}
        />
      )}
      <Mic
        size={16}
        strokeWidth={1.5}
        color={listening ? "#ff6b6b" : "#8B8B8B"}
        aria-hidden="true"
        style={{ position: "relative" }}
      />
    </button>
  );
}

export function ChatInput(props: { onSubmit?: (value: string) => void }) {
  const [value, setValue] = useState("");
  const baseRef = useRef("");

  const { supported, listening, toggle } = useVoiceInput({
    lang: "pt-BR",
    onStart: () => {
      baseRef.current = value;
    },
    onText: (transcript) => {
      const base = baseRef.current;
      setValue(base && !/\s$/.test(base) ? `${base} ${transcript}` : base + transcript);
    },
  });

  const canSend = value.trim().length > 0;
  const send = () => {
    if (!canSend) return;
    props.onSubmit?.(value.trim());
    setValue("");
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div
      style={{
        width: 348,
        maxWidth: "100%",
        borderRadius: 20,
        background: "#1d1d1d",
        boxShadow:
          "inset 0 0 0 1px rgba(44,47,54,0.52), inset 0 0 50px 0 rgba(255,255,255,0.02)",
        overflow: "hidden",
        position: "relative",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style>{CSS}</style>
      <div
        style={{
          padding: "7px 7px 8px",
          display: "flex",
          flexDirection: "column",
          height: 122,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
            height: 24,
            padding: "0 4px",
            marginLeft: 1,
            ...CHIP,
          }}
        >
          <AtSign size={16} strokeWidth={1.5} color="#808388" aria-hidden="true" />
        </div>

        <textarea
          className="chat-input__textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={listening ? "Ouvindo..." : "Build anything..."}
          aria-label="Mensagem"
          rows={1}
          style={{
            flex: 1,
            minHeight: 0,
            resize: "none",
            border: 0,
            background: "transparent",
            padding: "16px 4px 0",
            font: "inherit",
            fontSize: 13,
            lineHeight: "16px",
            color: "#e6e7ea",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: "auto",
          }}
        >
          <div style={{ ...SELECT_CHIP, marginLeft: 1 }}>
            Agent
            <ChevronDown size={16} strokeWidth={1.5} color="#8B9099" opacity={0.6} aria-hidden="true" />
          </div>
          <div style={SELECT_CHIP}>
            Auto
            <ChevronDown size={16} strokeWidth={1.5} color="#8B9099" opacity={0.6} aria-hidden="true" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <VoiceButton supported={supported} listening={listening} onClick={toggle} />
            <button
              type="button"
              className="chat-input__btn"
              aria-label="Enviar"
              onClick={send}
              disabled={!canSend}
              style={{
                ...ICON_BUTTON,
                background: canSend ? "rgba(255,255,255,0.12)" : CHIP.background,
              }}
            >
              <ArrowUp size={16} strokeWidth={1.5} color={canSend ? "#fff" : "#8B8B8B"} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Default() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 600,
        maxWidth: "100%",
        minHeight: 360,
        margin: "0 auto",
        background: "#0d0d0f",
        borderRadius: 24,
      }}
    >
      <BorderBeam size="md" colorVariant="colorful">
        <ChatInput onSubmit={(text) => console.log("enviar:", text)} />
      </BorderBeam>
    </div>
  );
}
