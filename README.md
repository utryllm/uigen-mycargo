# MyCargo UI Generator

A real-time AI-powered UI generator for enterprise dashboards. Describe the interface you want, and watch it come to life instantly.

![MyCargo UI Generator](https://via.placeholder.com/800x400?text=MyCargo+UI+Generator)

## Features

- **Real-Time UI Generation** - Type a description and see your UI generated live
- **Enterprise Dashboard Focus** - Optimized for data tables, admin panels, and forms
- **Multiple AI Providers** - Supports OpenAI (GPT-4o) and Anthropic (Claude)
- **Live Preview** - Interactive preview powered by Sandpack
- **View Code** - See the clean JSX/Tailwind code with syntax highlighting
- **Export & Share** - Generate shareable links for your prototypes
- **Design System** - Consistent styling with MyCargo design tokens

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **AI Integration**: Vercel AI SDK
- **Live Preview**: Sandpack (CodeSandbox)
- **Code Editor**: Monaco Editor
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI or Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd uigen-mycargo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Add your API key**
   Click "Add API Key" in the header and enter your OpenAI or Anthropic API key.

## Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Manual Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Configure Environment (Optional)**
   For production export functionality with Vercel KV:
   - Go to your project settings in Vercel
   - Add a KV database from the Storage tab
   - Environment variables will be auto-configured

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KV_REST_API_URL` | No | Vercel KV URL for export feature |
| `KV_REST_API_TOKEN` | No | Vercel KV token |

**Note**: API keys are stored locally in the browser - no server-side keys needed.

## Usage

### Basic Usage

1. Enter your API key (OpenAI or Anthropic)
2. Type a description in the chat:
   - "Create a dashboard with user metrics and charts"
   - "Build an orders table with filters and pagination"
   - "Design a settings page with form fields"
3. Watch your UI generate in real-time
4. Toggle between Preview and Code view
5. Export to share with others

### Commands

| Command | Description |
|---------|-------------|
| `/new` | Create a new screen |
| `/edit [name]` | Edit an existing screen |
| `/delete [name]` | Delete a screen |
| `/clear` | Clear chat history |
| `/export` | Export prototype |

### Tips for Better Results

- Be specific about the data you want displayed
- Mention specific components: "table", "cards", "form", "filters"
- Reference existing screens for navigation
- Describe the layout: "sidebar", "header", "grid layout"

## Project Structure

```
uigen-mycargo/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── generate/      # LLM generation
│   │   │   ├── export/        # Export prototype
│   │   │   └── validate-key/  # Key validation
│   │   ├── preview/[id]/      # Shared preview page
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── canvas/            # Preview & code viewer
│   │   ├── chat/              # Chat interface
│   │   ├── layout/            # Header, split pane
│   │   └── ui/                # Design system
│   ├── lib/
│   │   ├── store/             # Zustand stores
│   │   ├── ai/                # LLM prompts & parser
│   │   └── utils/
│   ├── hooks/
│   └── types/
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

## Design System

MyCargo uses a consistent design system:

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#C41230` | Buttons, accents |
| Background | `#F5F5F5` | Page background |
| Card | `#FFFFFF` | Cards, panels |
| Text Primary | `#333333` | Headings, body |
| Text Secondary | `#666666` | Labels |
| Border | `#E0E0E0` | Borders, dividers |
| Link | `#0066CC` | Links, actions |

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Security

- API keys are stored only in browser localStorage
- Generated code is validated and sanitized
- Sandpack runs in an isolated iframe
- No server-side storage of sensitive data

## License

MIT License - feel free to use this for your own projects!

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
