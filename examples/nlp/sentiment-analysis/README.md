# Sentiment Analysis Example

A beautiful, production-ready sentiment analysis web application using Transformers.js.

## Features

- ✅ **Zero Setup** - Just open the HTML file
- ✅ **Beautiful UI** - Modern, responsive design
- ✅ **Fast** - Shows inference time
- ✅ **Privacy** - Runs 100% locally in browser
- ✅ **Smart** - Pretrained BERT model
- ✅ **Examples** - Quick test buttons included

## Quick Start

### Option 1: Open Directly

```bash
# Download the file and open in browser
open index.html
```

### Option 2: Local Server

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# Then visit: http://localhost:8000
```

## How It Works

### 1. Model Loading

```javascript
import { pipeline } from '@huggingface/transformers';

// Create sentiment analysis pipeline
// Model: distilbert-base-uncased-finetuned-sst-2-english
const classifier = await pipeline('sentiment-analysis');
```

**What happens:**
- Downloads model (~67MB, only first time)
- Caches in browser (IndexedDB)
- Subsequent loads are instant (<100ms)

### 2. Inference

```javascript
const result = await classifier('I love this!');
console.log(result);
// [{ label: 'POSITIVE', score: 0.9998 }]
```

**Performance:**
- Inference time: 50-200ms (CPU)
- Supports batching for multiple texts
- WebGPU acceleration available

### 3. Result Format

```javascript
{
  label: 'POSITIVE' | 'NEGATIVE',
  score: 0.0 - 1.0  // Confidence score
}
```

## Code Walkthrough

### HTML Structure

```html
<textarea id="text">Text to analyze...</textarea>
<button onclick="analyzeSentiment()">Analyze</button>
<div id="result"></div>
```

### JavaScript Logic

```javascript
// Load model once on page load
const classifier = await pipeline('sentiment-analysis');

// Reuse for multiple inferences
async function analyzeSentiment() {
  const text = document.getElementById('text').value;
  const result = await classifier(text);
  displayResult(result[0]);
}
```

### Key Points

1. **Load Once**: Model loads once, reused for all inferences
2. **Error Handling**: Catches network/memory errors gracefully
3. **UI Feedback**: Shows loading states and inference time
4. **Performance**: Displays actual inference time

## Customization

### Use Different Model

```javascript
// Default (English sentiment)
const classifier = await pipeline('sentiment-analysis');

// Multilingual sentiment (100+ languages)
const classifier = await pipeline(
  'sentiment-analysis',
  'nlptown/bert-base-multilingual-uncased-sentiment'
);

// Emotion detection (6 emotions)
const classifier = await pipeline(
  'text-classification',
  'j-hartmann/emotion-english-distilroberta-base'
);
```

### Enable WebGPU

```javascript
// 5-10x faster on compatible browsers
const classifier = await pipeline(
  'sentiment-analysis',
  'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
  { device: 'webgpu' }
);
```

### Batch Processing

```javascript
// Analyze multiple texts at once
const texts = [
  'I love this!',
  'This is terrible.',
  'It\'s okay.'
];

const results = await classifier(texts);
console.log(results);
// [
//   [{ label: 'POSITIVE', score: 0.9998 }],
//   [{ label: 'NEGATIVE', score: 0.9995 }],
//   [{ label: 'POSITIVE', score: 0.7234 }]
// ]
```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Recommended |
| Edge 90+ | ✅ Full | Recommended |
| Firefox 89+ | ✅ Full | |
| Safari 14.1+ | ✅ Full | |
| Mobile Chrome | ✅ Full | May be slower |
| Mobile Safari | ✅ Full | May be slower |

**WebGPU Support:** Chrome 113+, Edge 113+, Opera 99+

## Performance

### Model Size
- Compressed: ~28MB
- Uncompressed: ~67MB
- First load: ~5-10 seconds (download + init)
- Subsequent loads: <100ms (cached)

### Inference Speed (CPU)
- Short text (10 words): ~50ms
- Medium text (50 words): ~100ms
- Long text (200 words): ~200ms

### Inference Speed (WebGPU)
- 5-10x faster than CPU
- Requires compatible GPU

## Use Cases

### 1. Social Media Monitoring
Monitor brand mentions and customer feedback sentiment in real-time.

### 2. Customer Support
Automatically triage support tickets by sentiment (urgent vs. routine).

### 3. Review Analysis
Analyze product reviews to understand customer satisfaction.

### 4. Content Moderation
Detect negative or toxic content before publication.

### 5. Survey Analysis
Analyze open-ended survey responses at scale.

## Production Considerations

### Caching Strategy
```javascript
// Models are automatically cached in browser
// No additional code needed!

// To check cache:
console.log(await caches.keys());
```

### Error Handling
```javascript
try {
  const classifier = await pipeline('sentiment-analysis');
  const result = await classifier(text);
} catch (error) {
  if (error.message.includes('fetch')) {
    // Network error - user is offline
    showError('Please check your internet connection');
  } else if (error.message.includes('memory')) {
    // Out of memory - try smaller model
    showError('Device memory too low');
  } else {
    // Unknown error
    showError('Something went wrong');
  }
}
```

### Loading State
```javascript
// Always show loading state
button.disabled = true;
button.textContent = 'Loading model...';

const classifier = await pipeline('sentiment-analysis');

button.disabled = false;
button.textContent = 'Analyze';
```

## Advanced Features

### Confidence Threshold

```javascript
const result = await classifier(text);
const { label, score } = result[0];

if (score < 0.7) {
  // Low confidence - treat as neutral
  console.log('Uncertain sentiment');
} else if (label === 'POSITIVE' && score > 0.95) {
  // High confidence positive
  console.log('Very positive!');
}
```

### Real-Time Analysis

```javascript
let timeout;
textarea.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const result = await classifier(textarea.value);
    updateUI(result);
  }, 500); // Debounce 500ms
});
```

## Troubleshooting

### Model won't load
- Check internet connection (first load only)
- Check browser console for errors
- Try clearing browser cache
- Ensure browser is up-to-date

### Slow performance
- Use smaller model (distilbert vs bert)
- Enable WebGPU if available
- Reduce text length
- Consider batching requests

### Out of memory
- Close other tabs
- Use smaller model
- Reduce batch size
- Restart browser

## Next Steps

- ✅ [Text Generation Example](../text-generation/)
- ✅ [Question Answering Example](../question-answering/)
- ✅ [Translation Example](../translation/)
- ✅ [NLP Guide](../../../docs/guides/nlp/)

## Resources

- [Transformers.js Docs](https://huggingface.co/docs/transformers.js)
- [Model Card](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english)
- [Pipeline API](../../../docs/api-reference/pipelines.md)

## License

MIT - Feel free to use in your projects!
