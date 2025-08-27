// ...existing code...
import { Message } from '@/types/chat'

export interface ChatResponse {
  message?: string
  threadId?: string
  messages?: { role: 'user' | 'assistant'; content: any }[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

export class ChatAPIClient {
  private apiUrl: string

  constructor(apiUrl: string = '/api/chat') {
    this.apiUrl = apiUrl
  }

  // helper to extract string from possible content shapes
  private extractText(content: any): string {
    if (content == null) return ''
    if (typeof content === 'string') return content
    if (Array.isArray(content)) return content.map(c => this.extractText(c)).filter(Boolean).join('\n').trim()
    if (content.type === 'text') {
      if (typeof content.text === 'string') return content.text
      if (content.text && typeof content.text.value === 'string') return content.text.value
    }
    if (typeof content.value === 'string') return content.value
    if (typeof content.content === 'string') return content.content
    return ''
  }

  async sendMessage(message: string, conversationHistory: Message[] = []): Promise<string> {
    try {
      const messages = conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant' as const,
        content: msg.content,
      }))

      messages.push({
        role: 'user',
        content: message,
      })

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          maxTokens: 1000,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()
      console.log('Chat API response:', data)

      // Preferred: return data.message if present
      if (typeof data.message === 'string' && data.message.trim() !== '') {
        return data.message
      }

      // Otherwise try to extract assistant message from returned messages array
      if (Array.isArray(data.messages)) {
        // find last assistant message
        const lastAssistant = [...data.messages].reverse().find(m => m.role === 'assistant')
        const assistantText = this.extractText(lastAssistant?.content ?? lastAssistant)
        if (assistantText) return assistantText
      }

      // fallback: try top-level fields
      const fallback = this.extractText(data)
      if (fallback) return fallback

      return '' // no content found
    } catch (error) {
      console.error('Error calling chat API:', error)
      throw new Error(`Failed to get response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // ...existing code...
}