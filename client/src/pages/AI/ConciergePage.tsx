import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import api from '../../lib/api';
import { ChatMessage } from '../../types';

export default function ConciergePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: "Hi! I'm Glow, your AI beauty concierge. Tell me what kind of salon or service you're looking for in Chennai, and I'll find the perfect match for you. 💅✨"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await api.post('/ai/concierge', { messages: newMsgs });
      setMessages([...newMsgs, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages([...newMsgs, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my database right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "I need bridal makeup under ₹8000 near Adyar.",
    "Best places for a Keratin treatment in T Nagar?",
    "Looking for a cheap haircut for men in Velachery.",
    "Where can I get a relaxing hair spa today?"
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 shrink-0 shadow-sm z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-rose flex items-center justify-center shadow-sm"
               style={{ background: 'linear-gradient(135deg, #C9A84C, #E8A0A0)' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-dark font-display text-lg">AI Beauty Concierge</h1>
            <p className="text-xs text-green-500 font-medium flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse"/> Online</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-plum-900 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`px-4 py-3 rounded-2xl max-w-[85%] sm:max-w-[75%] whitespace-pre-wrap text-sm leading-relaxed ${m.role === 'user' ? 'bg-plum-900 text-white rounded-tr-sm' : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-full bg-plum-900 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 p-4 shrink-0 pb-safe">
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {messages.length === 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  className="whitespace-nowrap px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-gray-50 border border-gray-200 text-dark rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center text-[10px] text-gray-400">
            Glow AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
}
