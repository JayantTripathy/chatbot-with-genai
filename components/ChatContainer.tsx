'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/types/chat'
import { generateId } from '@/lib/utils'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import CheckingIndicator from './CheckingIndicator'

interface ChatContainerProps {
  onSendMessage: (message: string) => Promise<void>
  isLoading?: boolean
  messages: Message[]
  error?: string | null
  isDarkMode?: boolean
}

export default function ChatContainer({ 
  onSendMessage, 
  isLoading = false, 
  messages, 
  error,
  isDarkMode = false
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    await onSendMessage(content)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto chat-container p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 animate-slide-up">Welcome to AI Chatbot!</h3>
            <p className="text-sm max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Start a conversation with our AI assistant. Ask questions, get help, or just chat!
            </p>
          </div>
        ) : (
          <>
          {}
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLastMessage={index === messages.length - 1}
                isDarkMode={isDarkMode}
              />
            ))}
            
            {/* Show checking indicator when loading */}
            {isLoading && <CheckingIndicator isDarkMode={isDarkMode} />}
          </>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-400 text-sm animate-slide-up">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container - Fixed to bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg mt-auto">
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Type your message..."
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  )
} 