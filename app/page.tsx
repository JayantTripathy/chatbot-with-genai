'use client'

import { useState, useCallback, useEffect } from 'react'
import { Message } from '@/types/chat'
import { generateId } from '@/lib/utils'
import { ChatAPIClient } from '@/lib/chat-api'
import ChatContainer from '@/components/ChatContainer'
import ThemeToggle from '@/components/ThemeToggle'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Apply dark mode class to document and persist theme
  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Initialize chat API client
  const chatClient = new ChatAPIClient()

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content,
      role: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      // Get AI response
      const aiResponse = await chatClient.sendMessage(content, messages)
      console.log('AI response Result:', aiResponse)
      // Add AI message
      const botMessage: Message = {
        id: generateId(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      console.log('AI response:', botMessage)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI'
      setError(errorMessage)
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  // console.log('Chat request:', messages);

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="glass-effect sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">AI Chatbot</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Azure GenAI</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
            <button
              onClick={clearChat}
              className="px-3 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-hidden">
        <div className="glass-effect shadow-2xl rounded-3xl overflow-hidden h-full flex flex-col backdrop-blur-md">
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            error={error}
            isDarkMode={isDarkMode}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/30 dark:border-gray-700/30 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>Built with Next.js, TypeScript, and Azure Generative AI</p>
          <p className="mt-1">
            Made with <span className="text-red-500 animate-pulse">❤️</span> by Jayant Tripathy
          </p>
        </div>
      </footer>
    </div>
  )
} 