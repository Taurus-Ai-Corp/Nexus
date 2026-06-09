'use client';

const MODELS = [
  { id: 'anthropic-sonnet', label: 'Claude Sonnet', badge: 'FAST' },
  { id: 'anthropic-opus',   label: 'Claude Opus',   badge: 'SMART' },
  { id: 'gemini',           label: 'Gemini Flash',  badge: 'FREE' },
  { id: 'groq',             label: 'Groq Llama',    badge: 'FREE' },
  { id: 'ollama-cloud',     label: 'DeepSeek V3',   badge: 'LARGE' },
] as const;

export type ModelId = (typeof MODELS)[number]['id'];

export const MODEL_IDS = MODELS.map((m) => m.id) as unknown as readonly ModelId[];

interface ModelSelectorProps {
  value: ModelId;
  onChange: (model: ModelId) => void;
  className?: string;
}

export function ModelSelector({ value, onChange, className }: ModelSelectorProps) {
  return (
    <div className={`flex gap-2 flex-wrap justify-center${className ? ` ${className}` : ''}`}>
      {MODELS.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`px-3 py-1 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all
            ${
              value === m.id
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/50'
            }`}
          style={{ border: '1px solid' }}
          title={`Use ${m.label} as the AI model`}
        >
          {m.label} <span className="opacity-50">{m.badge}</span>
        </button>
      ))}
    </div>
  );
}
