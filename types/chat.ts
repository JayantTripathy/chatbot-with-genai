export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isTyping?: boolean
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface AzureGenAIResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface ChatConfig {
  apiEndpoint: string
  apiKey: string
  modelName: string
  maxTokens: number
  temperature: number
} 