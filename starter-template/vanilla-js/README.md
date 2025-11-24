# Vanilla JavaScript Starter Template

Production-ready starter template for Transformers.js with Vite.

## Features

- ⚡ **Vite** - Lightning-fast development
- 🤗 **Transformers.js** - Pre-configured and ready
- 📦 **ES Modules** - Modern JavaScript
- 🎨 **Beautiful UI** - Responsive design included
- 🚀 **Production Build** - Optimized output

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
vanilla-js/
├── index.html      # Main HTML file
├── main.js         # JavaScript logic
├── style.css       # Styles
├── package.json    # Dependencies
└── README.md       # This file
```

## Usage

### Basic Example

```javascript
import { pipeline } from '@huggingface/transformers';

// Load model
const classifier = await pipeline('sentiment-analysis');

// Run inference
const result = await classifier('Hello world!');
console.log(result);
```

### Available Pipelines

```javascript
// Text tasks
await pipeline('sentiment-analysis');
await pipeline('text-generation');
await pipeline('question-answering');
await pipeline('translation');

// Vision tasks
await pipeline('image-classification');
await pipeline('object-detection');

// Audio tasks
await pipeline('automatic-speech-recognition');
await pipeline('text-to-speech');
```

## Customization

### Change Model

Edit `main.js`:

```javascript
// Use different model
const classifier = await pipeline(
  'sentiment-analysis',
  'nlptown/bert-base-multilingual-uncased-sentiment'
);
```

### Enable WebGPU

```javascript
const classifier = await pipeline(
  'text-generation',
  'onnx-community/Phi-3.5-mini-instruct',
  { device: 'webgpu' }
);
```

### Add More Tasks

```javascript
// Add image classification
const imageClassifier = await pipeline('image-classification');
const result = await imageClassifier(imageUrl);
```

## Deployment

### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Vercel

```bash
npm run build
# Deploy with: vercel --prod
```

### GitHub Pages

```bash
npm run build
# Commit dist/ folder
git subtree push --prefix dist origin gh-pages
```

## Browser Support

- Chrome 90+
- Firefox 89+
- Safari 14.1+
- Edge 90+

## License

MIT
