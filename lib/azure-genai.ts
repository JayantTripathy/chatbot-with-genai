import { AzureGenAIResponse, ChatConfig } from '@/types/chat'

export class AzureGenAIClient {
  private config: ChatConfig

  constructor(config: ChatConfig) {
    this.config = config
  }

  async sendMessage(message: string, conversationHistory: Array<{ role: string; content: string }> = []): Promise<string> {
    try {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: message }
      ]

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          model: this.config.modelName,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: AzureGenAIResponse = await response.json()
  

      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from AI model')
      }
      console.log('Azure GenAI response:', data.choices[0].message.content);
      return data.choices[0].message.content
    } catch (error) {
      console.error('Error calling Azure GenAI:', error)
      throw new Error(`Failed to get response from AI: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Method to create a streaming response (for real-time chat)
  async *streamMessage(message: string, conversationHistory: Array<{ role: string; content: string }> = []): AsyncGenerator<string> {
    try {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: message }
      ]

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
          model: this.config.modelName,
          stream: true, // Enable streaming
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') return
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
                yield parsed.choices[0].delta.content
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming response:', error)
      throw new Error(`Failed to stream response: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Default configuration - you can override these with environment variables
export const defaultConfig: ChatConfig = {
  apiEndpoint: process.env.NEXT_PUBLIC_AZURE_GENAI_ENDPOINT || '',
  apiKey: process.env.NEXT_PUBLIC_AZURE_GENAI_API_KEY || '',
  modelName: process.env.NEXT_PUBLIC_AZURE_GENAI_MODEL || 'gpt-35-turbo',
  maxTokens: parseInt(process.env.NEXT_PUBLIC_AZURE_GENAI_MAX_TOKENS || '1000'),
  temperature: parseFloat(process.env.NEXT_PUBLIC_AZURE_GENAI_TEMPERATURE || '0.7'),
} 