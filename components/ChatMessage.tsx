'use client'

import { Message } from '@/types/chat'
import { formatTime } from '@/lib/utils'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  message: Message
  isLastMessage?: boolean
  isDarkMode?: boolean
}
export default function ChatMessage({ message, isLastMessage = false, isDarkMode = false }: ChatMessageProps) {
  //console.log('ChatMessage content:', message);
  const isUser = message.role === 'user'
  return (
    
    <div 
      className={`flex items-start gap-3 mb-4 animate-messageEnter ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300'
      }`}>
        {isUser ? (
          <User size={20} />
        ) : (
          <Bot size={20} />
        )}
      </div>
      
      {/* Message Bubble */}
      <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`chat-bubble animate-bubblePop ${
          isUser ? 'chat-bubble-user' : 'chat-bubble-bot'
        }`}>
          {message.isTyping ? (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>
        
        {/* Timestamp */}
        <span className={`text-xs text-gray-500 dark:text-gray-400 mt-2 opacity-75 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  )
} 