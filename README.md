# AI Chatbot with Azure GenAI

A modern, touch-friendly chatbot interface built with Next.js, TypeScript, and Azure Generative AI. This application provides a beautiful and responsive chat experience with real-time communication capabilities.

## ✨ Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Touch-Friendly**: Optimized for mobile and tablet devices
- **Real-time Chat**: Instant message delivery with typing indicators
- **Azure GenAI Integration**: Powered by Azure's Generative AI models
- **TypeScript**: Full type safety and better development experience
- **Responsive Design**: Works perfectly on all screen sizes
- **Auto-scroll**: Messages automatically scroll to the latest
- **Error Handling**: Graceful error handling with user-friendly messages
- **Conversation History**: Maintains context across messages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Azure OpenAI Service account
- Azure GenAI model deployment

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chatbot-with-genai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your Azure GenAI credentials:
   ```env
   NEXT_PUBLIC_AZURE_GENAI_ENDPOINT=https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2023-05-15
   NEXT_PUBLIC_AZURE_GENAI_API_KEY=your-azure-openai-api-key
   NEXT_PUBLIC_AZURE_GENAI_MODEL=gpt-35-turbo
   NEXT_PUBLIC_AZURE_GENAI_MAX_TOKENS=1000
   NEXT_PUBLIC_AZURE_GENAI_TEMPERATURE=0.7
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
chatbot-with-genai/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ChatContainer.tsx  # Main chat container
│   ├── ChatInput.tsx      # Message input component
│   └── ChatMessage.tsx    # Individual message component
├── lib/                   # Utility libraries
│   ├── azure-genai.ts     # Azure GenAI client
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript type definitions
│   └── chat.ts            # Chat-related types
└── public/                # Static assets
```

## 🔧 Configuration

### Azure GenAI Setup

1. **Create Azure OpenAI Service**
   - Go to Azure Portal
   - Create a new Azure OpenAI resource
   - Deploy a model (e.g., GPT-35-Turbo)

2. **Get your credentials**
   - Copy the endpoint URL
   - Generate an API key
   - Note your deployment name

3. **Update environment variables**
   - Set `NEXT_PUBLIC_AZURE_GENAI_ENDPOINT`
   - Set `NEXT_PUBLIC_AZURE_GENAI_API_KEY`
   - Configure other parameters as needed

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_AZURE_GENAI_ENDPOINT` | Azure OpenAI endpoint URL | Required |
| `NEXT_PUBLIC_AZURE_GENAI_API_KEY` | Azure OpenAI API key | Required |
| `NEXT_PUBLIC_AZURE_GENAI_MODEL` | Model deployment name | `gpt-35-turbo` |
| `NEXT_PUBLIC_AZURE_GENAI_MAX_TOKENS` | Maximum tokens per response | `1000` |
| `NEXT_PUBLIC_AZURE_GENAI_TEMPERATURE` | Response creativity (0-1) | `0.7` |

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize:

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Animations**: Modify animation classes in `globals.css`
- **Layout**: Adjust component layouts in individual component files

### Components

Each component is modular and can be easily customized:

- `ChatMessage.tsx`: Message bubble styling and layout
- `ChatInput.tsx`: Input field and button design
- `ChatContainer.tsx`: Overall chat layout and behavior

## 📱 Mobile Optimization

The application is optimized for mobile devices with:

- Touch-friendly button sizes (44px minimum)
- Responsive design that adapts to screen size
- Smooth scrolling and animations
- Optimized input handling for mobile keyboards

## 🔒 Security

- API keys are stored in environment variables
- Client-side validation for user inputs
- Error handling prevents sensitive information exposure
- HTTPS recommended for production

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Google Cloud Run
- Azure Static Web Apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include your environment and error logs

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Powered by [Azure OpenAI](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service)

Architecture: Azure OpenAI + Azure AI Search + Blob + Foundry (Local Dev)

                        ┌─────────────────────────────┐
                        │        Your Local App        │
                        │   (CLI / Script / Postman)   │
                        └────────────┬────────────────┘
                                     │
                            [1] User question input
                                     ▼
                        ┌─────────────────────────────┐
                        │      Azure AI Search         │
                        │ jt-search-chatassist-dev-eus │
                        └────────────┬────────────────┘
                                     │
                    [2] Retrieves top-k relevant documents
                                     ▼
                        ┌─────────────────────────────┐
                        │     Azure Blob Storage       │
                        │ jt-blob-chatassist-dev-eus   │
                        └────────────┬────────────────┘
                                     │
                   [3] Documents are indexed via Foundry pipeline
                                     ▼
                        ┌─────────────────────────────┐
                        │      Azure AI Foundry        │
                        │ jt-foundry-chatassist-dev-eus│
                        └────────────┬────────────────┘
                                     │
                   [4] Passes search result context to GPT
                                     ▼
                        ┌─────────────────────────────┐
                        │       Azure OpenAI GPT       │
                        │ jt-aoai-chatassist-dev-eus   │
                        └────────────┬────────────────┘
                                     │
                         [5] GPT generates final answer
                                     ▼
                        ┌─────────────────────────────┐
                        │        Local Output          │
                        │  (Console / JSON / Postman)  │
                        └─────────────────────────────┘


Typical Architecture for Advanced GenAI Use Case

               ┌─────────────────────────────┐
               │        Users (Chat UI)      │
               └────────────┬────────────────┘
                            │
                  User query/question
                            ▼
               ┌─────────────────────────────┐
               │      Azure OpenAI GPT       │
               │ (jt-gen-open-ai-11)         │
               └────────────┬────────────────┘
                            │
        Sends query to Search engine with context
                            ▼
               ┌─────────────────────────────┐
               │     Azure AI Search Index   │
               │ (jt-genai-az-ai-search-1)   │
               └────────────┬────────────────┘
                            │
             Retrieves top-k relevant docs
                            ▼
               ┌─────────────────────────────┐
               │     Blob Storage / SQL      │
               │ (jtmyblobstorage1 etc.)     │
               └─────────────────────────────┘
                            │
           Retrieved data sent back to OpenAI
                            ▼
               ┌─────────────────────────────┐
               │ GPT Generates Grounded Answer│
               └─────────────────────────────┘
                            │
                   Response to User (Chat)


🔹 Architecture of GenAI with Azure AI Foundry + Your Knowledge

User (Web/Frontend)
        |
        v
Your API (.NET Core / Node.js)
        |
        v
Azure AI Foundry
   ├── OpenAI Model (GPT-4/3.5)
   ├── Azure AI Search (Vector DB)
   └── Prompt Flow / Orchestration
        |
        v
Your Data (Blob Storage + Index in AI Search)





Option 1: GenAI with Azure AI Foundry + "Your Knowledge"

This is the built-in retrieval-augmented generation (RAG) capability inside Azure AI Foundry.

You just upload documents (PDF, text, etc.) into “Your Knowledge”.

Azure AI Foundry automatically:

Stores them in an internal vector index (you don’t manage Azure AI Search directly).

Handles embedding generation + chunking.

Integrates with Azure OpenAI for responses.

Your app calls one endpoint (the Foundry deployed endpoint) → it does both search + LLM response.

✅ Benefits

No need to manage Azure AI Search, Blob, or indexing pipelines yourself.

Faster development (no infra setup).

Great for POCs, small/medium workloads, quick business solutions.

Security & access control integrated.

❌ Limitations

Limited customization (can’t tune chunking, re-ranking, hybrid search, custom metadata filters deeply).

Storage and indexing managed internally (less control over scaling & cost optimizations).

Not ideal for very large datasets or when you need full control over search/index pipeline.

Option 2: Azure OpenAI + Azure AI Search + Blob + Foundry (Local Dev)

This is the modular architecture where you manage each component.

Documents go to Blob Storage.

You index them into Azure AI Search with embeddings.

Your .NET Core API orchestrates:

Query → Azure AI Search → gets top-k docs.

Passes docs as context to Azure OpenAI (GPT).

Returns final answer.

✅ Benefits

Full control of vector search (hybrid search, filters, synonyms, re-ranking).

Better for large datasets and enterprise-scale workloads.

Can customize pipelines (chunking strategies, multi-index search, data enrichment).

Easier integration with other external systems (ERP, CRM, APIs).

❌ Limitations

More infra to manage (Search, Blob, pipelines, monitoring).

Higher complexity in code + DevOps.

Development time increases.

Side-by-Side Comparison
Feature	GenAI + Your Knowledge	OpenAI + AI Search + Blob
Setup Time	🚀 Fast (no AI Search setup)	⚙️ Slower (need Blob + AI Search + pipeline)
Control	🔒 Limited	🎛️ Full control over search + indexing
Scaling	✅ Managed automatically	✅ Customizable, but you manage scaling
Cost	💰 May be higher (bundled, black box)	💰 More cost-efficient if optimized
Best for	POCs, small-medium projects	Large, enterprise-scale, custom needs
Endpoint Call	1 API call (Foundry endpoint)	Multiple calls (Search + OpenAI) orchestrated in your API

👉 Rule of Thumb

If you want fast go-live / minimal setup → use GenAI + Your Knowledge.

If you want enterprise control / scalability → use OpenAI + AI Search + Blob.
