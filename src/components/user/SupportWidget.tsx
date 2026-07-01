"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, HelpCircle, PhoneCall, Link2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: Date;
}

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "agent",
      text: "Hi there! Welcome to Slmalkoha I am Chamodya from Support. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show tooltip after 3 seconds, fade out after 8 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 9000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Auto-scroll to bottom of chat window
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate Agent Reply
    setTimeout(() => {
      let replyText = "Thank you for reaching out! A support coordinator will join the chat shortly. You can also email us directly at support@Slmalkohacom.";

      const lower = textToSend.toLowerCase();
      if (lower.includes("track") || lower.includes("order")) {
        replyText = "Sure! You can track your packages live using our Order Tracking portal. Click here to check status: /track";
      } else if (lower.includes("shipping") || lower.includes("deliver")) {
        replyText = "We ship globally via DHL Express and FedEx Cargo. Standard global delivery takes 3-5 business days. You can configure baseline rates in our logistics profiles.";
      } else if (lower.includes("whatsapp") || lower.includes("phone")) {
        replyText = "Redirecting you to our active WhatsApp hotline: +94 77 123 4567. We are online 24/7 for order verification.";
      } else if (lower.includes("coupon") || lower.includes("discount")) {
        replyText = "Try using code 'DISCOUNT10' at checkout to receive an instant 10% discount on your cart items!";
      }

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: replyText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    if (action === "whatsapp") {
      toast.success("Redirecting to WhatsApp hotline...");
      window.open("https://wa.me/94771234567", "_blank");
      handleSendMessage("I want to contact WhatsApp Support");
    } else if (action === "track") {
      handleSendMessage("How do I track my order?");
    } else if (action === "rates") {
      handleSendMessage("Tell me about global shipping rates and delivery times");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {/* Tooltip Prompt bubble */}
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => { setIsOpen(true); setShowTooltip(false); }}
            className="absolute bottom-16 right-0 mb-2 w-48 bg-card border border-border rounded-2xl p-3 shadow-card cursor-pointer text-left hover:border-brand transition"
          >
            <div className="text-[10px] font-bold text-brand uppercase tracking-wider">Slmalkoha Concierge</div>
            <p className="text-xs text-foreground font-semibold mt-0.5">Need help with shipping or order tracking?</p>
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-card border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Chat Window Popup */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 sm:w-96 h-[480px] bg-card border border-border rounded-3xl shadow-card overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-brand-foreground text-xs font-bold shadow-glow border border-brand">
                    AM
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1">
                    Chamodya <span className="text-[9px] font-bold bg-brand/10 text-brand px-1.5 py-0.5 rounded-full">Support</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online · Active Support Agent
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted text-muted-foreground transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Body */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide bg-muted/10 text-left text-xs"
            >
              {messages.map((m) => {
                const isAgent = m.sender === "agent";
                return (
                  <div key={m.id} className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 leading-relaxed ${isAgent
                        ? "bg-muted text-foreground border border-border"
                        : "bg-brand text-brand-foreground shadow-glow font-medium"
                        }`}
                    >
                      {m.text.includes("/track") ? (
                        <div>
                          <span>You can track your packages live using our Order Tracking portal: </span>
                          <a
                            href="/track"
                            className="underline font-bold text-brand block mt-1 hover:text-brand-dark"
                          >
                            Go to Tracking Portal
                          </a>
                        </div>
                      ) : (
                        m.text
                      )}
                      <span
                        className={`block text-[9px] mt-1 text-right ${isAgent ? "text-muted-foreground" : "text-brand-foreground/70"
                          }`}
                      >
                        {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground border border-border rounded-2xl px-4 py-3 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce delay-150" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce delay-300" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Actions */}
            <div className="px-4 py-2 border-t border-border bg-muted/10 flex flex-wrap gap-1.5 justify-start">
              <button
                onClick={() => handleQuickAction("whatsapp")}
                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200 transition"
              >
                <PhoneCall size={10} /> Chat WhatsApp
              </button>
              <button
                onClick={() => handleQuickAction("track")}
                className="inline-flex items-center gap-1 bg-brand/10 hover:bg-brand hover:text-brand-foreground text-brand px-2.5 py-1 rounded-full text-[10px] font-bold border border-brand/20 transition"
              >
                <HelpCircle size={10} /> Track Package
              </button>
              <button
                onClick={() => handleQuickAction("rates")}
                className="inline-flex items-center gap-1 bg-muted hover:bg-muted-foreground/10 text-foreground px-2.5 py-1 rounded-full text-[10px] font-bold border border-border transition"
              >
                📦 Shipping Rates
              </button>
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="p-3 border-t border-border bg-card flex gap-2"
            >
              <input
                type="text"
                placeholder="Ask about orders, shipping rates, VAT..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-muted px-4 py-2 text-xs rounded-xl border border-border outline-none focus:ring-2 ring-brand font-medium text-foreground"
              />
              <button
                type="submit"
                className="grid h-8 w-8 place-items-center bg-brand text-brand-foreground hover:bg-brand-dark rounded-xl transition shadow-glow shrink-0"
              >
                <Send size={12} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating launcher trigger Button */}
      <motion.button
        onClick={() => { setIsOpen(!isOpen); setShowTooltip(false); }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="grid h-14 w-14 place-items-center bg-brand text-brand-foreground rounded-full shadow-glow hover:bg-brand-dark transition border border-brand/40"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>
    </div>
  );
}
