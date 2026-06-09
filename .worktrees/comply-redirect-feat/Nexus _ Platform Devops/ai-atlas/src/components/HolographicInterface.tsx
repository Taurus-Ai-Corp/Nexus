import React, { useEffect, useRef, useState } from 'react';

interface HolographicInterfaceProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'targeting' | 'dashboard' | 'minimal';
  glowColor?: 'cyan' | 'purple' | 'green' | 'orange';
}

const HolographicInterface: React.FC<HolographicInterfaceProps> = ({
  children,
  className = '',
  variant = 'minimal',
  glowColor = 'cyan'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const glowColors = {
    cyan: 'rgba(0, 245, 255, 0.6)',
    purple: 'rgba(139, 92, 246, 0.6)',
    green: 'rgba(0, 255, 136, 0.6)',
    orange: 'rgba(255, 165, 0, 0.6)'
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const renderTargetingInterface = () => (
    <div className="absolute inset-0 pointer-events-none">
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
      
      {/* Scanning Lines */}
      <div className="absolute inset-0">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-1/4 animate-pulse" />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent absolute left-1/4 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute bottom-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent absolute right-1/4 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Center Target */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 border-2 border-cyan-400 rounded-full targeting-circle">
          <div className="absolute inset-2 border border-cyan-400 rounded-full opacity-60" />
        </div>
      </div>
    </div>
  );

  const renderDashboardInterface = () => (
    <div className="absolute inset-0 pointer-events-none">
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Data Points */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full pulse-glow"
          style={{
            top: `${20 + (i * 10)}%`,
            left: `${10 + (i * 8)}%`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}
      
      {/* Floating UI Elements */}
      <div className="absolute top-4 right-4 text-xs text-cyan-400 font-mono">
        STATUS: ACTIVE
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-cyan-400 font-mono">
        AI: OPTIMIZING
      </div>
    </div>
  );

  const getVariantClasses = () => {
    switch (variant) {
      case 'targeting':
        return 'relative border-2 border-cyan-400/30 rounded-lg overflow-hidden backdrop-blur-sm';
      case 'dashboard':
        return 'relative border border-cyan-400/50 rounded-xl overflow-hidden backdrop-blur-md bg-slate-900/30';
      case 'minimal':
      default:
        return 'relative border border-cyan-400/20 rounded-lg overflow-hidden';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${getVariantClasses()} ${className} group transition-all duration-300 hover:border-cyan-400/60`}
      style={{
        boxShadow: `0 0 20px ${glowColors[glowColor]}`,
      }}
    >
      {/* Mouse-following glow effect */}
      <div
        className="absolute w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColors[glowColor]} 0%, transparent 70%)`,
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          filter: 'blur(20px)'
        }}
      />
      
      {/* Variant-specific overlays */}
      {variant === 'targeting' && renderTargetingInterface()}
      {variant === 'dashboard' && renderDashboardInterface()}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </div>
  );
};

// Neural Network Background Component
export const NeuralNetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Neural network nodes
    const nodes: Array<{x: number, y: number, vx: number, vy: number, connections: number[]}> = [];
    const nodeCount = 50;

    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        connections: []
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Boundary check
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodes.slice(i + 1).forEach((otherNode, j) => {
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.2;
            ctx.strokeStyle = `rgba(0, 245, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });

        // Draw node
        ctx.fillStyle = 'rgba(0, 245, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowColor = '#00f5ff';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(0, 245, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};

export default HolographicInterface;
