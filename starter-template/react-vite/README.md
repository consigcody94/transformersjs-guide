# React + TypeScript + Vite Starter

Production-ready React starter template for Transformers.js with TypeScript, custom hooks, and modern tooling.

## Features

- ⚡ **Vite** - Lightning-fast HMR and builds
- ⚛️ **React 18** - Latest React features
- 📘 **TypeScript** - Full type safety with strict mode
- 🎣 **Custom Hooks** - Reusable `usePipeline` hook
- 🎨 **Modern UI** - Gradient design with animations
- 🔥 **Hot Reload** - Instant feedback during development
- 📦 **Optimized Build** - Tree-shaking and code splitting

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

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
react-vite/
├── src/
│   ├── hooks/
│   │   └── usePipeline.ts    # Custom hook for Transformers.js
│   ├── App.tsx                # Main app component
│   ├── App.css                # App styles
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Custom Hook: `usePipeline`

The `usePipeline` hook provides a clean interface for using Transformers.js models:

```typescript
import { usePipeline } from './hooks/usePipeline';

function MyComponent() {
  const { ready, loading, error, output, run } = usePipeline('sentiment-analysis');

  return (
    <div>
      {ready && (
        <button onClick={() => run('Hello world')}>
          Analyze
        </button>
      )}
      {output && <div>{output[0].label}</div>}
    </div>
  );
}
```

### Hook API

```typescript
const {
  ready,      // boolean - Pipeline is loaded and ready
  loading,    // boolean - Inference in progress
  error,      // string | null - Error message if failed
  output,     // T | null - Inference result
  run,        // (input: any) => Promise<void> - Run inference
  reset       // () => void - Clear output and error
} = usePipeline<T>(task, options);
```

### Supported Tasks

```typescript
type PipelineTask =
  | 'sentiment-analysis'
  | 'text-generation'
  | 'image-classification'
  | 'automatic-speech-recognition'
  // ... and 23+ more tasks
```

### Options

```typescript
interface UsePipelineOptions {
  model?: string;  // Specific model to use
  device?: 'auto' | 'webgpu' | 'wasm';  // Execution device
}
```

## Examples

### Sentiment Analysis

```typescript
function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const { output, loading, run } = usePipeline('sentiment-analysis');

  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => run(text)} disabled={loading}>
        Analyze
      </button>
      {output && <div>{output[0].label}: {output[0].score}</div>}
    </>
  );
}
```

### Text Generation

```typescript
function TextGenerator() {
  const { output, run } = usePipeline('text-generation', {
    model: 'onnx-community/gpt2'
  });

  return (
    <>
      <button onClick={() => run('Once upon a time')}>
        Generate Story
      </button>
      {output && <p>{output[0].generated_text}</p>}
    </>
  );
}
```

### Image Classification

```typescript
function ImageClassifier() {
  const [image, setImage] = useState<string | null>(null);
  const { output, run } = usePipeline('image-classification');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        run(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleFile} />
      {image && <img src={image} alt="Preview" />}
      {output && (
        <ul>
          {output.map((item, i) => (
            <li key={i}>{item.label}: {(item.score * 100).toFixed(1)}%</li>
          ))}
        </ul>
      )}
    </>
  );
}
```

### With WebGPU Acceleration

```typescript
const { output, run } = usePipeline('sentiment-analysis', {
  device: 'webgpu'  // 5-10x faster!
});
```

## TypeScript Best Practices

### Typed Pipeline Output

```typescript
interface SentimentOutput {
  label: 'POSITIVE' | 'NEGATIVE';
  score: number;
}

const { output } = usePipeline<SentimentOutput[]>('sentiment-analysis');

// output is now typed as SentimentOutput[] | null
```

### Custom Model Types

```typescript
interface GenerationOutput {
  generated_text: string;
}

const { output } = usePipeline<GenerationOutput[]>('text-generation');
```

## Advanced Usage

### Multiple Pipelines

```typescript
function MultiModelApp() {
  const sentiment = usePipeline('sentiment-analysis');
  const generator = usePipeline('text-generation');

  return (
    <>
      <SentimentAnalyzer pipeline={sentiment} />
      <TextGenerator pipeline={generator} />
    </>
  );
}
```

### Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AIComponent />
    </ErrorBoundary>
  );
}
```

### Suspense Support

```typescript
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<div>Loading model...</div>}>
      <AIComponent />
    </Suspense>
  );
}
```

## Performance Optimization

### Lazy Load Components

```typescript
const AIComponent = lazy(() => import('./components/AIComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AIComponent />
    </Suspense>
  );
}
```

### Memoization

```typescript
const MemoizedAIComponent = memo(AIComponent, (prev, next) => {
  return prev.input === next.input;
});
```

### Web Workers (Advanced)

```typescript
// worker.ts
import { pipeline } from '@huggingface/transformers';

self.onmessage = async (e) => {
  const classifier = await pipeline('sentiment-analysis');
  const result = await classifier(e.data);
  self.postMessage(result);
};
```

## Deployment

### Build

```bash
npm run build
# Outputs to dist/
```

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

### Deploy to GitHub Pages

```bash
npm run build
# Copy dist/ to gh-pages branch
```

## Browser Support

- Chrome 90+
- Firefox 89+
- Safari 14.1+
- Edge 90+

## Troubleshooting

### Models not loading

Ensure you have internet connection for first load. Models are cached after first download.

### TypeScript errors

Run `npm run type-check` to see all type errors.

### Build errors

Clear cache: `rm -rf node_modules .vite && npm install`

## Next Steps

- Add more AI features
- Implement streaming responses
- Add file upload handling
- Create reusable AI components
- Add error boundaries
- Implement caching strategies

## License

MIT
