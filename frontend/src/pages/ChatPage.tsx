import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Loader, User, ShieldCheck } from 'lucide-react';
import type { ChatMessage } from '../types';

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch chat history logs
  const fetchChatHistory = async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error loading chat logs: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Poll for new messages (e.g. Agent replies) every 1.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChatHistory();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // 2. Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 3. Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    setSending(true);
    const textToSend = inputText;
    setInputText('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'user',
          text: textToSend
        })
      });

      if (!response.ok) throw new Error("Could not deliver message");
      
      // Instantly refresh list locally
      fetchChatHistory();
    } catch (err) {
      console.error("Chat sending failed: ", err);
      alert("Error de conexión al enviar el mensaje.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bgDark flex justify-center items-center text-secondary">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-bgDark text-white min-h-screen py-10 px-4 flex flex-col justify-center items-center relative overflow-hidden font-sans">
      
      {/* Background glow effects */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Back to Home shortcut */}
      <div className="max-w-xl w-full mb-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-secondary text-xs font-bold transition font-display"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
        </button>
      </div>

      {/* 💬 CHATBOX PANEL BOX */}
      <div className="max-w-xl w-full h-[600px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)] flex flex-col relative z-10 group">
        
        {/* Chat Header */}
        <div className="p-5 bg-gradient-to-b from-primary/60 to-transparent border-b border-white/10 flex items-center justify-between relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-secondary/5 opacity-50 pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30 text-secondary font-bold text-lg shadow-inner">
              🥥
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-black rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div>
              <h3 className="font-black text-base font-display text-white drop-shadow-md tracking-wider">Soporte VIP Fire Tour</h3>
              <p className="text-[10px] text-emerald-400 font-black tracking-[0.2em] uppercase mt-1">Asesor Activo En Vivo</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 rounded-full px-3 py-1.5 text-[9px] text-gray-400 font-black tracking-widest uppercase relative z-10 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.6)]" /> Chat Seguro
          </div>
        </div>

        {/* Message Log Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              
              {/* Message Bubble */}
              <div 
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-md backdrop-blur-md border ${
                  msg.sender === 'user'
                    ? 'bg-secondary/90 border-secondary/50 text-white rounded-tr-none shadow-[0_5px_15px_rgba(249,115,22,0.2)]'
                    : 'bg-white/5 border-white/10 text-gray-200 rounded-tl-none shadow-inner'
                }`}
              >
                {msg.text}
              </div>

              {/* Timestamp */}
              <span className="text-[9px] text-gray-500 mt-1.5 font-bold tracking-widest uppercase">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

            </div>
          ))}

          {/* Invisible anchor for scrolling */}
          <div ref={scrollRef} />
        </div>

        {/* Chat Input Footer Form */}
        <form onSubmit={handleSendMessage} className="p-5 border-t border-white/10 bg-black/40 flex gap-3 relative z-10 backdrop-blur-xl">
          
          <input
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregúntanos sobre Saona, tirolinas o precios..."
            className="flex-1 bg-white/5 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary/50 rounded-2xl py-3.5 px-5 text-sm focus:outline-none text-white transition-all duration-300 placeholder-gray-500 font-bold"
          />

          <button
            type="submit"
            disabled={sending}
            className="p-4 bg-secondary hover:bg-orange-500 border border-secondary/50 text-white rounded-2xl flex items-center justify-center transition-all duration-300 disabled:opacity-50 flex-shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transform hover:scale-105"
          >
            <Send className="w-5 h-5 drop-shadow-md ml-1" />
          </button>

        </form>

      </div>

    </div>
  );
}
