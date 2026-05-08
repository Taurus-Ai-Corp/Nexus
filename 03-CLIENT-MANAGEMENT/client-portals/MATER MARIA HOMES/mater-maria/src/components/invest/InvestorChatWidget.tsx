"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, ArrowRight, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "How does AI health monitoring work?",
  "Tell me about the solar-powered campus",
  "What smart home features are included?",
  "What's the Diamond tier ROI?",
  "Compare all tiers for me",
];

function BrandIcon({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/images/mater-maria-logo.svg"
      alt="Mater Maria"
      width={size}
      height={size}
      style={{ objectFit: "contain" }}
    />
  );
}

export function InvestorChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [glowCycles, setGlowCycles] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Gold glow pulse — 3 cycles on first load
  useEffect(() => {
    if (glowCycles >= 3) return;
    const timer = setTimeout(() => setGlowCycles((c) => c + 1), 1500);
    return () => clearTimeout(timer);
  }, [glowCycles]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = { role: "user", content: text.trim() };
      const newHistory = [...messages, userMsg];
      setMessages(newHistory);
      setInput("");
      setIsTyping(true);

      try {
        const res = await fetch("/api/investor-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMsg.content,
            history: newHistory.slice(-10),
          }),
        });

        if (!res.ok) throw new Error("Chat API error");

        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now. Please try WhatsApp for immediate assistance.",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages],
  );

  const handleWhatsAppHandoff = () => {
    const summary = messages
      .slice(-6)
      .map((m) =>
        m.role === "user"
          ? `Q: ${m.content}`
          : `A: ${m.content.length > 100 ? m.content.slice(0, 100) + "..." : m.content}`,
      )
      .join("\n");

    const text = encodeURIComponent(
      `Hi, I'm interested in investing in Mater Maria Homes. Here's my conversation:\n\n${summary}`,
    );
    window.open(`${SITE.whatsapp}?text=${text}`, "_blank");
  };

  return (
    <>
      {/* Floating trigger — MM wings logo with speech bubble badge */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              y: [0, -3, 0, 3, 0],
            }}
            exit={{ scale: 0 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              scale: { type: "spring", stiffness: 260, damping: 20 },
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 left-6 z-50 flex size-14 items-center justify-center rounded-full border-2 border-accent-default/30 bg-surface shadow-lg transition-all hover:scale-110 hover:border-accent-default/60"
            style={{
              boxShadow:
                glowCycles < 3
                  ? `0 0 ${12 + glowCycles * 4}px hsl(42, 72%, 55%, ${0.3 + glowCycles * 0.1})`
                  : "0 4px 20px rgba(0,0,0,0.15)",
            }}
            aria-label="Open investor chat"
          >
            <BrandIcon size={36} />
            {/* Speech bubble badge */}
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-surface bg-accent-default">
              <MessageCircle className="size-2.5 text-white" fill="white" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-6 z-50 flex w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border-accent bg-surface/95 shadow-2xl backdrop-blur-xl"
            style={{ height: "min(520px, calc(100vh - 6rem))" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border-default px-4 py-3">
              <BrandIcon size={28} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Mater Maria Concierge
                </p>
                <p className="text-[10px] text-text-muted">
                  AI-powered investor assistance
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-text-primary"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-center text-xs text-text-muted">
                    Ask anything about investing in Mater Maria Homes
                  </p>
                  {/* Starter chips */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {STARTERS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="rounded-full border border-border-default bg-bg-base px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent-default/40 hover:text-accent-default"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "rounded-br-md bg-accent-default/15 text-text-primary"
                        : "rounded-bl-md border border-border-default bg-bg-base text-text-secondary"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border-default bg-bg-base px-4 py-3">
                    <span className="size-1.5 animate-bounce rounded-full bg-accent-default/60 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-accent-default/60 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-accent-default/60 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp handoff bar */}
            {messages.length >= 2 && (
              <button
                onClick={handleWhatsAppHandoff}
                className="flex items-center justify-center gap-2 border-t border-border-default bg-[#25D366]/10 px-4 py-2 text-xs font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20"
              >
                Continue on WhatsApp with your summary{" "}
                <ArrowRight className="size-3" />
              </button>
            )}

            {/* Input */}
            <div className="border-t border-border-default p-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about investment tiers..."
                  className="flex-1 rounded-lg border border-border-default bg-bg-base px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-default/50 focus:outline-none focus:ring-1 focus:ring-accent-default/30"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex size-9 items-center justify-center rounded-lg bg-accent-default text-white transition-colors disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
