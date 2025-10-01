import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles } from 'lucide-react';

const Qalam = () => {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Simulate AI response (will be replaced with actual AI integration)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: settings.language === 'ar' 
          ? 'أنا قلم، مساعدك الإسلامي الذكي. كيف يمكنني مساعدتك اليوم؟'
          : 'I am Qalam, your Islamic AI assistant. How can I help you today?'
      }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {settings.language === 'ar' ? 'قلم - المساعد الذكي' : 'Qalam - AI Assistant'}
          </span>
        </div>
        <p className="text-muted-foreground">
          {settings.language === 'ar' 
            ? 'اسأل أي سؤال إسلامي'
            : 'Ask any Islamic question'}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <p className="text-muted-foreground">
              {settings.language === 'ar'
                ? 'ابدأ محادثة مع قلم'
                : 'Start a conversation with Qalam'}
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'glass-effect'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="glass-effect rounded-2xl p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={settings.language === 'ar' ? 'اكتب سؤالك...' : 'Type your question...'}
          className="border-0 bg-transparent focus-visible:ring-0"
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Qalam;
