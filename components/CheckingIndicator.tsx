'use client'

import { Bot } from 'lucide-react'

interface CheckingIndicatorProps {
  message?: string
  isDarkMode?: boolean
}

export default function CheckingIndicator({ message = "AI is thinking...", isDarkMode = false }: CheckingIndicatorProps) {
  return (
    <div className="flex items-center gap-4 p-6 animate-fade-in">
      {/* AI Avatar with pulse animation */}
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
        <Bot size={16} className="text-white" />
      </div>
      
      {/* Message with typing dots */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-200 font-semibold">{message}</span>
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-40 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
} 