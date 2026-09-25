import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, Minimize2 } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export const FloatingAiChat = ({ onSelectConditionByName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am MediHelp AI Health Assistant. Ask me about symptoms, drug safety, or general health protocols.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/tools/ai-chat', { message: query });
      if (res.data.success) {
        const aiMsg = {
          sender: 'ai',
          text: res.data.response,
          action: res.data.suggestedAction,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);

        if (res.data.suggestedAction && res.data.suggestedAction.type === 'SEARCH' && onSelectConditionByName) {
          onSelectConditionByName(res.data.suggestedAction.query);
        }
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'I am experiencing connection issues. Please try again shortly.', timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What to do for a severe migraine?",
    "Check drug interaction rules",
    "How to lower high blood pressure?",
    "Symptoms of acute appendicitis"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black shadow-2xl shadow-cyan-500/40 glow-cyan transition-all transform hover:scale-110 cursor-pointer flex items-center gap-2"
        >
          <Bot className="w-6 h-6 animate-bounce" />
          <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">AI Medical Assistant</span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-[90vw] sm:w-96 h-[500px] rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden glass-card">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1">
                  <span>MediHelp Assistant</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-semibold block">Online Clinical AI</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-left">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                
                <div
                  className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2 border-t border-white/5 bg-slate-950/60 overflow-x-auto flex gap-1.5 whitespace-nowrap">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-cyan-950 text-[10px] text-slate-300 hover:text-cyan-300 border border-white/5 transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-slate-950 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask a health question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
