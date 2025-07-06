# Website Cloner - Minimal Implementation

A simple Node.js/TypeScript tool that clones a website and deploys it to the web.

## Features

- **Clone any website** using Playwright for reliable rendering
- **Automatic deployment** to Vercel
- **Minimal dependencies** - only Playwright required
- **Simple CLI interface** - one command does everything

## Installation

```bash
npm install
```

For deployment, you'll need to login to Vercel once:
```bash
npx vercel login
```

## Usage

```bash
npm run clone-and-deploy <URL>
```

### Example

```bash
npm run clone-and-deploy https://example.com
```

This will:
1. Clone the website using Playwright
2. Download all HTML, CSS, JS, and images
3. Deploy automatically to a unique Vercel URL
4. Provide you with a live URL

## Architecture

```
src/
├── types.ts      # TypeScript interfaces
├── cloner.ts     # Website cloning with Playwright
├── deployer.ts   # Vercel deployment
└── cli.ts        # Command-line interface
```

## Requirements

- Node.js 16+
- Playwright (for website cloning)
- Vercel account (free, for deployment)

## Limitations

- Only clones a single page + immediate resources
- Only deploys to Vercel
- No recursive link following

This is intentionally minimal to meet the core requirement: "enter a website and the program will try clone the website and deploy it somewhere".

## License

MIT License - see [LICENSE](LICENSE) file for details.