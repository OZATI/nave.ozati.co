import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export interface BloimAnimationBackgroundProps {
  projectId?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  production?: boolean;
  opacity?: number;
  children?: React.ReactNode;
}

/**
 * Bloim Animation Background Component (Unicorn Studio WebGL Shader)
 * Project ID: 9tVO0xGS8DIar1DF4Sqc
 */
export const BloimAnimationBackground = ({
  projectId = "9tVO0xGS8DIar1DF4Sqc",
  className,
  width: customWidth,
  height: customHeight,
  production = true,
  opacity,
  children,
}: BloimAnimationBackgroundProps) => {
  const windowSize = useWindowSize();
  const width = customWidth ?? windowSize.width;
  const height = customHeight ?? windowSize.height;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initUnicorn = () => {
      const win = window as any;
      if (win.UnicornStudio) {
        try {
          win.UnicornStudio.init();
        } catch (e) {
          console.warn("Bloim Animation init warning:", e);
        }
      }
    };

    const win = window as any;
    if (!win.UnicornStudio) {
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
    <div
      className={cn("relative flex flex-col items-center overflow-hidden", className)}
      style={opacity !== undefined ? { opacity } : undefined}
    >
      <iframe
        src={`https://www.unicorn.studio/embed/${projectId}?production=${production ? "1" : "0"}`}
        width={width}
        height={height}
        className="w-full h-full border-0 absolute inset-0 pointer-events-auto"
        title="Bloim Animation Background"
        loading="lazy"
        allow="autoplay"
      />
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
};

export const Component = BloimAnimationBackground;

export default BloimAnimationBackground;
