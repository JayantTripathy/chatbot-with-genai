// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AIProjectClient } from '@azure/ai-projects';
import { DefaultAzureCredential } from '@azure/identity';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  threadId?: string; // optional, for multi-turn
  maxTokens?: number;
  temperature?: number;
}

interface ChatResponse {
  threadId: string;
  messages: ChatMessage[];
}

// Helper to safely extract text from message content
function getTextValue(content: any): string | null {
  return content?.type === 'text' && typeof content.text?.value === 'string'
    ? content.text.value
    : null;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, threadId, maxTokens = 1000, temperature = 0.7 } = body;
    
    if (!messages || messages?.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const projectEndpoint = process.env.PROJECT_ENDPOINT;
    const agentId = process.env.AGENT_ID;

    if (!projectEndpoint || !agentId) {
      return NextResponse.json({ error: 'PROJECT_ENDPOINT or AGENT_ID not set' }, { status: 500 });
    }

    const project = new AIProjectClient(projectEndpoint, new DefaultAzureCredential());

    // Get agent
    let agent;
    try {
      agent = await project.agents.getAgent(agentId);

    } catch (err) {
      console.error('Failed to get agent:', err);
      return NextResponse.json({ error: 'Failed to get agent' }, { status: 500 });
    }

    // Create thread if not passed
    let currentThreadId = threadId;
    if (!currentThreadId) {
      try {
        const thread = await project.agents.threads.create();
        currentThreadId = thread.id;
      } catch (err) {
        console.error('Failed to create thread:', err);
        return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 });
      }
    }

    // ...existing code...
    // Send only the latest user message
    const lastUserMsg = [...messages].reverse().find(
      m => m.role === "user" && typeof m.content === "string" && m.content.trim() !== ""
    );
    if (lastUserMsg) {
      const contentBlock = [{ type: "text" as const, text: lastUserMsg.content }];
      try {
        await project.agents.messages.create(currentThreadId, "user", contentBlock);
      } catch (err) {
        console.error("Failed to send user message:", err);
        return NextResponse.json({ error: "Failed to send user message" }, { status: 500 });
      }
    }

    const lastAssistantMsg = [...messages].reverse().find(
      m => m.role === "assistant" && typeof m.content === "string" && m.content.trim() !== ""
    );
    if (lastAssistantMsg) {
      const contentBlock = [{ type: "text" as const, text: lastAssistantMsg.content }];
      try {
        await project.agents.messages.create(currentThreadId, "assistant", contentBlock);
      } catch (err) {
        console.error("Failed to send assistant message:", err);
        return NextResponse.json({ error: "Failed to send assistant message" }, { status: 500 });
      }
    }
    // ...existing code...

    // Start agent run
   // ...existing code...
let run;
try {
  run = await project.agents.runs.create(currentThreadId, agent.id, { temperature });
} catch (err) {
  console.error('Failed to start agent run:', err);
  return NextResponse.json({ error: 'Failed to start agent run' }, { status: 500 });
}
// ...existing code...

    // Poll until run completes
    while (run.status === 'queued' || run.status === 'in_progress') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      run = await project.agents.runs.get(currentThreadId, run.id);
    }

    if (run.status === 'failed') {
      console.error('Agent run failed:', run.lastError);
      return NextResponse.json({ error: 'Agent run failed', details: run.lastError }, { status: 500 });
    }

    // Retrieve messages
    let messagesList;
    try {
      messagesList = await project.agents.messages.list(currentThreadId, { order: 'asc' });
    } catch (err) {
      console.error('Failed to retrieve messages:', err);
      return NextResponse.json({ error: 'Failed to retrieve messages' }, { status: 500 });
    }

    const responseMessages: ChatMessage[] = [];

    for await (const m of messagesList) {
      for (const content of m.content) {
        const textValue = getTextValue(content);
        if (textValue) {
          responseMessages.push({
            role: m.role as 'user' | 'assistant',
            content: textValue
          });
        }
      }
    }

    return NextResponse.json({
      threadId: currentThreadId,
      messages: responseMessages
    } as ChatResponse);
   
  } catch (err) {
    console.error('Route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
