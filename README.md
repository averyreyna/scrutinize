# Specter

Specter is an experimental writing assistant designed to help you improve your writing through actionable feedback and creative suggestions. The tool uses DeepSeek's model to analyze your writing in real time, offering potential directions for development and specific, actionable areas for improvement—all while preserving your unique voice.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or later)
- npm (v9 or later)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/specter.git
cd specter
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your DeepSeek API key:
```
VITE_DEEPSEEK_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
