import React, { useEffect, useRef } from 'react';

const MotionBackground = ({ className = '', variant = 'hero' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes configuration
    const particleCount = Math.min(width > 768 ? 45 : 22, 50);
    const particles = [];

    const colors = [
      'rgba(99, 102, 241, ',   // Indigo
      'rgba(168, 85, 247, ',   // Purple
      'rgba(236, 72, 153, ',   // Pink / Fuchsia
      'rgba(56, 189, 248, '    // Cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2
      });
    }

    // Floating glowing orbs (Liquid mesh effect)
    const orbs = [
      { x: width * 0.2, y: height * 0.3, r: 220, color: 'rgba(79, 70, 229, 0.45)', vx: 0.3, vy: 0.2 },
      { x: width * 0.8, y: height * 0.4, r: 260, color: 'rgba(147, 51, 234, 0.38)', vx: -0.25, vy: 0.3 },
      { x: width * 0.5, y: height * 0.75, r: 240, color: 'rgba(236, 72, 153, 0.28)', vx: 0.2, vy: -0.25 },
      { x: width * 0.15, y: height * 0.8, r: 190, color: 'rgba(14, 165, 233, 0.32)', vx: -0.2, vy: -0.2 }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing liquid ambient orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          10,
          orb.x,
          orb.y,
          orb.r
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw connecting web lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.22;
            ctx.strokeStyle = `rgba(165, 180, 252, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw particles with gentle breathing glow
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.pulseAngle += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulseAngle) * 0.2;

        ctx.fillStyle = `${p.baseColor}${Math.max(0.1, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo
        ctx.fillStyle = `${p.baseColor}${Math.max(0.02, currentAlpha * 0.3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Dynamic Deep Dark Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#070b19] via-[#0d122e] to-[#050814]" />

      {/* Motion Canvas: Liquid Orbs & Interconnecting Star Web */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Modern Perspective Cyber Grid Lines */}
      <div 
        className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#818cf8_1px,transparent_1px),linear-gradient(to_bottom,#818cf8_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
      />

      {/* Soft Vignette / Shading Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070b19]/90 via-transparent to-[#070b19]/40" />
    </div>
  );
};

export default MotionBackground;

