"use client";

import { useEffect, useRef } from "react";

interface GatewayFlowProps {
  className?: string;
}

export function GatewayFlow({ className = "h-full w-full" }: GatewayFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener("resize", handleResize);

    // Stream lines converging to center/right
    const streamsCount = 28;
    const streams = Array.from({ length: streamsCount }, (_, i) => {
      const startX = Math.random() * 0.4;
      const startY = (i / streamsCount) * 1.2 - 0.1;
      const speed = 0.003 + Math.random() * 0.004;
      const length = 0.15 + Math.random() * 0.25;
      const color =
        i % 3 === 0
          ? "rgba(16, 185, 129," // Emerald Nave
          : i % 3 === 1
          ? "rgba(56, 189, 248," // Sky/Cyan
          : "rgba(168, 85, 247,"; // Purple
      return {
        progress: Math.random(),
        speed,
        length,
        startX,
        startY,
        color,
        thickness: 1.2 + Math.random() * 1.8,
      };
    });

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radial dark vignette
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        width * 0.1,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      gradient.addColorStop(0, "rgba(9, 9, 11, 0.4)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.95)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Central gateway node glow
      const cx = width * 0.75;
      const cy = height * 0.5;

      const nodeGlow = ctx.createRadialGradient(cx, cy, 2, cx, cy, width * 0.22);
      nodeGlow.addColorStop(0, "rgba(16, 185, 129, 0.25)");
      nodeGlow.addColorStop(0.4, "rgba(56, 189, 248, 0.08)");
      nodeGlow.addColorStop(1, "transparent");
      ctx.fillStyle = nodeGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, width * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Render Bezier flow streams
      streams.forEach((s) => {
        if (!mediaQuery.matches) {
          s.progress += s.speed;
          if (s.progress > 1) {
            s.progress = 0;
            s.startY = Math.random() * 1.2 - 0.1;
          }
        }

        const x0 = s.startX * width;
        const y0 = s.startY * height;
        const cp1x = width * 0.35;
        const cp1y = y0;
        const cp2x = width * 0.55;
        const cp2y = cy;

        // Draw bezier guide
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, cx, cy);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Calculate position on curve
        const t = s.progress;
        const omt = 1 - t;
        const px =
          omt * omt * omt * x0 +
          3 * omt * omt * t * cp1x +
          3 * omt * t * t * cp2x +
          t * t * t * cx;
        const py =
          omt * omt * omt * y0 +
          3 * omt * omt * t * cp1y +
          3 * omt * t * t * cp2y +
          t * t * t * cy;

        // Particle stream head
        const alpha = Math.sin(t * Math.PI) * 0.85;
        ctx.beginPath();
        ctx.arc(px, py, s.thickness * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color} ${alpha})`;
        ctx.shadowColor = s.color.replace(",", "") + ")";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Gateway central target pulse
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#10b981";
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}

export default GatewayFlow;
