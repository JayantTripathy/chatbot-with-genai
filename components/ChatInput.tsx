'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Paperclip } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  placeholder?: string
  isDarkMode?: boolean
}

export default function ChatInput({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Type your message...",
  isDarkMode = false
}: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="flex items-end gap-4">
        {/* Attachment Button */}
        <button
          type="button"
          className="touch-button p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          disabled={isLoading}
        >
          <Paperclip size={20} />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full resize-none border border-gray-200 dark:border-gray-600 rounded-3xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px] max-h-[120px] text-sm transition-all duration-300 focus:scale-[1.02] bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm shadow-lg"
            rows={1}
          />
          
          {/* Voice Button */}
          <button
            type="button"
            className="absolute right-2 bottom-2 touch-button p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <Mic size={18} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="touch-button bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-4 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
} 