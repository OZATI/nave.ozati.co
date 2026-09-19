import React, { useEffect } from "react";

export interface BloimAnimationBackgroundProps {
  projectId?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Bloim Animation Background component (Serge Bunas / 21st.dev)
 * Interactive WebGL Bloom & Particle Shader background powered by Unicorn Studio.
 */
export const BloimAnimationBackground: React.FC<BloimAnimationBackgroundProps> = ({
  projectId = "p7Ff6pfTrb5Gs59C7nLC",
  className = "w-full h-full",
  children,
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initUnicorn = () => {
      const win = window as any;
      if (win.UnicornStudio) {
        try {
          win.UnicornStudio.init();
          win.UnicornStudio.isInitialized = true;
        } catch (e) {
          console.warn("Bloim Animation init warning:", e);
        }
      }
    };

    const win = window as any;
    if (!win.UnicornStudio) {
      win.UnicornStudio = { isInitialized: false };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      script.async = true;
      script.onload = initUnicorn;
      document.body.appendChild(script);
    } else {
      initUnicorn();
    }
  }, [projectId]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Container do Shader WebGL do Bloim */}
      <div
        data-us-project={projectId}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ minHeight: "100%", minWidth: "100%" }}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

export default BloimAnimationBackground;
