import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatbotProps {
  user: any;
  apiKey?: string; 
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot({ user, apiKey }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!apiKey) return; 
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (data.reply) {
        const botMessage: Message = { role: 'assistant', content: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 md:w-96 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden">
      <div className="bg-blue-600 text-white font-bold p-3">Insurance Assistant</div>

      <div className="flex-1 p-3 overflow-y-auto h-64 space-y-2">
        {!apiKey && (
          <div className="text-red-600 text-center text-sm">
            Chatbot temporarily unavailable. Please provide an API key to enable it.
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg ${
              m.role === 'user'
                ? 'bg-blue-100 text-blue-900 self-end'
                : 'bg-gray-100 text-gray-900 self-start'
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && <div className="text-gray-500 text-sm">Typing...</div>}
      </div>

      <div className="flex border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={apiKey ? "Ask me about insurance..." : "Chat disabled"}
          className="flex-1 px-3 py-2 outline-none"
          disabled={!apiKey} 
        />
        <button
          onClick={handleSend}
          className="px-3 flex items-center justify-center text-blue-600 hover:text-blue-700"
          disabled={!apiKey} 
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

