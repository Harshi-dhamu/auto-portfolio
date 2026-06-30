"use client";
import { useEffect } from "react";

export default function Effects() {
  useEffect(() => {
    // LIVE CLOCK
    function tick() {
      const n = new Date();
      const t = String(n.getHours()).padStart(2,"0") + ":" +
                String(n.getMinutes()).padStart(2,"0") + ":" +
                String(n.getSeconds()).padStart(2,"0");
      const el = document.getElementById("nav-clock");
      if (el) el.textContent = t;
    }
    tick();
    const clockInterval = setInterval(tick, 1000);

    // CURSOR GLOW
    const glow = document.getElementById("cursor-glow");
    const onMouseMove = (e: MouseEvent) => {
      if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", onMouseMove);

    // NEURAL PARTICLE NETWORK
    const canvas = document.getElementById("neural-canvas") as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3,
      col: Math.random() > 0.6 ? "#00ffc8" : Math.random() > 0.5 ? "#a855f7" : "#ec4899",
    }));

    let animId: number;
    function draw() {
      ctx!.fillStyle = "rgba(2,2,10,0.18)";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = p.col;
        ctx!.globalAlpha = 0.5;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      });
      pts.forEach((p, i) => {
        for (let j = i + 1; j < pts.length; j++) {
          const p2 = pts[j];
          const d = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (d < 100) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);
            ctx!.strokeStyle = "#00ffc8";
            ctx!.globalAlpha = (1 - d / 100) * 0.08;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
            ctx!.globalAlpha = 1;
          }
        }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      clearInterval(clockInterval);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return null;
}