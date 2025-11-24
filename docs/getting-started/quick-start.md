# Quick Start Guide

Get started with Transformers.js in **5 minutes**. This guide walks you through your first AI application.

---

## Your First AI Model

### Step 1: Setup

Choose your environment:

**Option A: Browser (CDN) - Fastest**
```html
<script type="module">
  import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';
  // Your code here
</script>
```

**Option B: Node.js or Bundler**
```bash
npm install @huggingface/transformers
```

### Step 2: Import & Create Pipeline

```javascript
import { pipeline } from '@huggingface/transformers';

// Create a sentiment analysis pipeline
// The model downloads automatically (cached after first use)
const classifier = await pipeline('sentiment-analysis');
```

**What happens here:**
1. Downloads the model (~1MB, only first time)
2. Caches model locally (browser: IndexedDB, Node.js: ~/.cache)
3. Initializes the pipeline for inference
4. Returns ready-to-use classifier

### Step 3: Run Inference

```javascript
// Classify a single text
const result = await classifier('I love Transformers.js!');
console.log(result);
// Output: [{ label: 'POSITIVE', score: 0.9998 }]

// Classify multiple texts
const results = await classifier([
  'This is amazing!',
  'I hate bugs.',
  'Today is a normal day.'
]);
console.log(results);
// Output:
// [
//   [{ label: 'POSITIVE', score: 0.9998 }],
//   [{ label: 'NEGATIVE', score: 0.9994 }],
//   [{ label: 'NEUTRAL', score: 0.9023 }]
// ]
```

### Complete Example

```javascript
import { pipeline } from '@huggingface/transformers';

async function main() {
  // Create pipeline
  const classifier = await pipeline('sentiment-analysis');

  // Analyze sentiment
  const result = await classifier('Transformers.js is awesome!');

  // Display result
  console.log(`Label: ${result[0].label}`);
  console.log(`Confidence: ${(result[0].score * 100).toFixed(2)}%`);
}

main();
```

---

## Real-World Examples

### Example 1: Text Classification

Classify emails, reviews, or social media posts:

```javascript
import { pipeline } from '@huggingface/transformers';

// Create classifier
const classifier = await pipeline(
  'text-classification',
  'Xenova/toxic-bert'
);

// Classify text
const text = "You're doing a great job!";
const result = await classifier(text);

console.log(result);
// [{ label: 'non-toxic', score: 0.9987 }]
```

**Use cases:** Content moderation, spam detection, topic classification

### Example 2: Text Generation

Generate text like GPT:

```javascript
import { pipeline } from '@huggingface/transformers';

const generator = await pipeline('text-generation', 'onnx-community/gpt2');

const output = await generator('Once upon a time', {
  max_new_tokens: 50,
  temperature: 0.9,
  top_k: 50
});

console.log(output[0].generated_text);
// "Once upon a time, in a land far away, there lived a wise old wizard..."
```

**Use cases:** Chatbots, content creation, code generation

### Example 3: Question Answering

Extract answers from text:

```javascript
import { pipeline } from '@huggingface/transformers';

const qa = await pipeline('question-answering');

const context = `
  Transformers.js is a JavaScript library that allows you to run
  machine learning models directly in the browser or Node.js.
  It supports over 2000 pretrained models.
`;

const result = await qa({
  question: 'How many models does Transformers.js support?',
  context: context
});

console.log(result);
// { answer: 'over 2000', score: 0.9843 }
```

**Use cases:** Document Q&A, customer support, research assistants

### Example 4: Image Classification

Classify images:

```javascript
import { pipeline } from '@huggingface/transformers';

const classifier = await pipeline('image-classification');

// From URL
const url = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/tiger.jpg';
const result = await classifier(url);

console.log(result);
// [
//   { label: 'tiger', score: 0.9872 },
//   { label: 'tiger cat', score: 0.0098 },
//   { label: 'jaguar', score: 0.0012 }
// ]
```

**Use cases:** Photo organization, product recognition, medical imaging

### Example 5: Speech Recognition

Transcribe audio to text:

```javascript
import { pipeline } from '@huggingface/transformers';

const transcriber = await pipeline(
  'automatic-speech-recognition',
  'onnx-community/whisper-tiny.en'
);

// From audio file
const result = await transcriber('https://example.com/audio.mp3');

console.log(result);
// { text: 'Hello, this is a test of speech recognition.' }
```

**Use cases:** Voice assistants, transcription services, accessibility

---

## Using Different Models

### Choosing Models

Browse models at https://huggingface.co/models?library=transformers.js

```javascript
// Default model (fastest, good quality)
const classifier = await pipeline('sentiment-analysis');

// Specific model (more control)
const classifier = await pipeline(
  'sentiment-analysis',
  'nlptown/bert-base-multilingual-uncased-sentiment'
);

// From onnx-community (optimized for Transformers.js)
const classifier = await pipeline(
  'text-generation',
  'onnx-community/Phi-3.5-mini-instruct'
);
```

### Model Selection Criteria

**Size vs Accuracy:**
- `tiny` / `small` - Fast, mobile-friendly (10-50MB)
- `base` - Balanced (100-200MB) ⭐ Recommended
- `large` / `xl` - Best accuracy (500MB-2GB)

**Quantization:**
- `fp32` - Full precision
- `fp16` - Half precision (50% smaller, minimal loss)
- `q8` - 8-bit quantized (75% smaller)
- `q4` - 4-bit quantized (87.5% smaller)

Example:
```javascript
// Smallest, fastest (4-bit quantized)
const model = 'onnx-community/whisper-tiny.en_q4';

// Best quality (full precision)
const model = 'onnx-community/whisper-base.en';
```

---

## WebGPU Acceleration

Enable GPU acceleration for **10x speedup**:

```javascript
import { pipeline } from '@huggingface/transformers';

// Check WebGPU support
if ('gpu' in navigator) {
  console.log('✅ WebGPU supported!');
} else {
  console.log('❌ WebGPU not available, using CPU');
}

// Enable WebGPU
const generator = await pipeline(
  'text-generation',
  'onnx-community/Phi-3.5-mini-instruct',
  { device: 'webgpu' }  // Enable GPU acceleration
);

const output = await generator('Explain quantum computing', {
  max_new_tokens: 100
});
```

**Requirements:**
- Chrome 113+, Edge 113+, or Opera 99+
- Compatible GPU
- HTTPS (required for security)

**Performance:**
- CPU: ~2-5 tokens/sec
- WebGPU: ~20-50 tokens/sec

---

## Error Handling

Always handle errors in production:

```javascript
import { pipeline } from '@huggingface/transformers';

async function classifyText(text) {
  try {
    // Create pipeline
    const classifier = await pipeline('sentiment-analysis');

    // Run inference
    const result = await classifier(text);

    return result[0];

  } catch (error) {
    if (error.message.includes('fetch')) {
      console.error('Network error - model download failed');
      return { error: 'offline' };
    }

    if (error.message.includes('memory')) {
      console.error('Out of memory - try a smaller model');
      return { error: 'memory' };
    }

    console.error('Unexpected error:', error);
    return { error: 'unknown' };
  }
}

// Usage
const result = await classifyText('Hello world!');
if (result.error) {
  console.log('Classification failed:', result.error);
} else {
  console.log('Result:', result.label, result.score);
}
```

---

## Best Practices

### 1. Reuse Pipelines

```javascript
// ❌ BAD - Creates new pipeline each time (slow)
async function analyze(text) {
  const classifier = await pipeline('sentiment-analysis');
  return await classifier(text);
}

// ✅ GOOD - Create once, reuse many times
const classifier = await pipeline('sentiment-analysis');

async function analyze(text) {
  return await classifier(text);
}
```

### 2. Show Loading States

```javascript
// Update UI while model loads
console.log('Loading AI model...');
const classifier = await pipeline('sentiment-analysis');
console.log('Model ready!');

// Or with progress (browser)
document.getElementById('status').textContent = 'Loading AI model...';
const classifier = await pipeline('sentiment-analysis');
document.getElementById('status').textContent = 'Ready!';
```

### 3. Batch Processing

```javascript
// ❌ BAD - Individual requests
for (const text of texts) {
  await classifier(text);  // Slow!
}

// ✅ GOOD - Batch all at once
const results = await classifier(texts);  // Fast!
```

### 4. Choose Appropriate Models

```javascript
// For mobile/low-power devices
const model = 'onnx-community/distilbert-base-uncased';  // Small, fast

// For desktops/powerful devices
const model = 'onnx-community/bert-large-uncased';  // Large, accurate
```

---

## Complete Application Example

Here's a complete sentiment analyzer web app:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sentiment Analyzer</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    textarea {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
    }
    button {
      margin-top: 10px;
      padding: 10px 20px;
      font-size: 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .result {
      margin-top: 20px;
      padding: 20px;
      border-radius: 8px;
      font-size: 18px;
    }
    .positive { background: #d4edda; color: #155724; }
    .negative { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <h1>🤖 AI Sentiment Analyzer</h1>
  <p>Analyze the sentiment of any text using AI:</p>

  <textarea id="text" rows="4" placeholder="Enter text to analyze...">I love Transformers.js!</textarea>
  <br>
  <button id="analyze" onclick="analyzeSentiment()">Analyze Sentiment</button>

  <div id="result"></div>

  <script type="module">
    import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';

    let classifier = null;

    // Load model on page load
    window.addEventListener('DOMContentLoaded', async () => {
      document.getElementById('analyze').textContent = 'Loading AI model...';
      document.getElementById('analyze').disabled = true;

      try {
        classifier = await pipeline('sentiment-analysis');
        document.getElementById('analyze').textContent = 'Analyze Sentiment';
        document.getElementById('analyze').disabled = false;
      } catch (error) {
        document.getElementById('result').innerHTML = `
          <div class="result" style="background: #f8d7da;">
            ❌ Failed to load model: ${error.message}
          </div>
        `;
      }
    });

    // Analyze function
    window.analyzeSentiment = async function() {
      const text = document.getElementById('text').value.trim();

      if (!text) {
        alert('Please enter some text!');
        return;
      }

      // Disable button
      document.getElementById('analyze').disabled = true;
      document.getElementById('analyze').textContent = 'Analyzing...';

      try {
        // Run inference
        const result = await classifier(text);
        const { label, score } = result[0];

        // Display result
        const confidence = (score * 100).toFixed(1);
        const sentiment = label.toLowerCase();
        const emoji = sentiment === 'positive' ? '😊' : '😞';

        document.getElementById('result').innerHTML = `
          <div class="result ${sentiment}">
            ${emoji} <strong>${label}</strong><br>
            Confidence: ${confidence}%
          </div>
        `;

      } catch (error) {
        document.getElementById('result').innerHTML = `
          <div class="result" style="background: #f8d7da;">
            ❌ Error: ${error.message}
          </div>
        `;
      } finally {
        document.getElementById('analyze').disabled = false;
        document.getElementById('analyze').textContent = 'Analyze Sentiment';
      }
    };
  </script>
</body>
</html>
```

**Try it:** Save as `index.html` and open in your browser!

---

## Next Steps

Now that you've built your first AI app:

1. **[Core Concepts](core-concepts.md)** - Understand how Transformers.js works
2. **[Tutorials](../tutorials/)** - Step-by-step guides for each task
3. **[Examples](../../examples/)** - 20+ working code examples
4. **[API Reference](../api-reference/)** - Complete API documentation

---

## Common Questions

**Q: Do models download every time?**
A: No! Models are cached after the first download. Subsequent loads are instant.

**Q: Can I use Transformers.js offline?**
A: Yes! After the first download, models are cached locally. You can also pre-download models.

**Q: What about privacy?**
A: All inference happens locally (browser or your server). No data is sent to external servers.

**Q: How big are the models?**
A: Ranges from 1MB (tiny) to 2GB (extra large). Most popular models are 50-200MB.

**Q: Does it work on mobile?**
A: Yes! Works on iOS Safari and Android Chrome. Use smaller models for better performance.

---

## Need Help?

- **Discord:** https://discord.com/invite/JfAtkvEtRb
- **Forums:** https://discuss.huggingface.co
- **GitHub:** https://github.com/huggingface/transformers.js
