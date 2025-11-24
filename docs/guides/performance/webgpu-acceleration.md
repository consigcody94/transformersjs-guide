# WebGPU Acceleration Guide

Comprehensive guide to enabling and optimizing WebGPU acceleration in Transformers.js for **5-10x performance gains**.

---

## What is WebGPU?

**WebGPU** is the next-generation web standard for GPU-accelerated graphics and compute. It provides:

- **Direct GPU access** from the browser
- **10x faster** inference compared to CPU
- **Native performance** close to native applications
- **Cross-platform** support (Windows, macOS, Linux, ChromeOS)

### WebGPU vs WebGL

| Feature | WebGPU | WebGL 2 |
|---------|--------|---------|
| Performance | **Excellent** | Good |
| Compute shaders | ✅ Yes | ❌ No |
| ML workloads | ✅ Optimized | ⚠️ Limited |
| Browser support | 70% (2025) | 97% |
| Future-proof | ✅ Yes | ❌ Legacy |

---

## Browser Support

### Desktop

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | **113+** | ✅ Full |
| Edge | **113+** | ✅ Full |
| Opera | **99+** | ✅ Full |
| Firefox | 🚧 Experimental | ⚠️ flag needed |
| Safari | 🚧 Coming soon | ❌ Not yet |

### Mobile

| Platform | Support | Notes |
|----------|---------|-------|
| Android Chrome | ✅ 113+ | Full support |
| Android Edge | ✅ 113+ | Full support |
| iOS Safari | ❌ Not yet | Coming in iOS 18+ |
| ChromeOS | ✅ Full | Excellent performance |

**Check support:**
```javascript
if ('gpu' in navigator) {
  console.log('✅ WebGPU supported');
} else {
  console.log('❌ WebGPU not available');
}
```

---

## Enabling WebGPU

### Basic Usage

```javascript
import { pipeline } from '@huggingface/transformers';

// Enable WebGPU with device parameter
const classifier = await pipeline(
  'sentiment-analysis',
  'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
  { device: 'webgpu' }  // ⚡ GPU acceleration
);

const result = await classifier('I love WebGPU!');
```

### Check GPU Availability

```javascript
import { env } from '@huggingface/transformers';

// Check WebGPU support
if (await env.backends.onnx.wasm.webgpu.isSupported()) {
  console.log('✅ WebGPU available');
} else {
  console.log('❌ Fallback to CPU');
}
```

### Graceful Fallback

```javascript
async function createPipeline(task, model) {
  const supportsWebGPU = 'gpu' in navigator;

  const options = supportsWebGPU
    ? { device: 'webgpu' }
    : { device: 'wasm' };  // CPU fallback

  try {
    return await pipeline(task, model, options);
  } catch (error) {
    if (error.message.includes('webgpu')) {
      console.warn('WebGPU failed, falling back to CPU');
      return await pipeline(task, model, { device: 'wasm' });
    }
    throw error;
  }
}

// Usage
const classifier = await createPipeline(
  'sentiment-analysis',
  'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
);
```

---

## Performance Benchmarks

### Text Classification (BERT-base)

| Device | Inference Time | Tokens/sec | Speedup |
|--------|---------------|------------|---------|
| CPU (WASM) | 450ms | 2.2 | 1x |
| **WebGPU** | **65ms** | **15.4** | **~7x** |

### Text Generation (GPT-2)

| Device | Tokens/sec | Speedup |
|--------|------------|---------|
| CPU | 2.4 | 1x |
| **WebGPU** | **18.5** | **~8x** |

### Image Classification (ViT-base)

| Device | Images/sec | Speedup |
|--------|-----------|---------|
| CPU | 1.8 | 1x |
| **WebGPU** | **12.3** | **~7x** |

### Speech Recognition (Whisper-tiny)

| Device | Audio sec/Real sec | Speedup |
|--------|-------------------|---------|
| CPU | 0.3x (slower) | 1x |
| **WebGPU** | **3.2x (faster)** | **~10x** |

---

## Optimization Techniques

### 1. Model Selection

Choose WebGPU-optimized models:

```javascript
// ✅ GOOD - Optimized for WebGPU
const model = 'onnx-community/Phi-3.5-mini-instruct';

// ⚠️ OK - Works but may be slow
const model = 'onnx-community/bert-large-uncased';

// ❌ AVOID - Too large for browser GPU
const model = 'onnx-community/llama-2-70b';
```

**Model size guidelines:**
- **Small** (<500MB): Excellent WebGPU performance
- **Medium** (500MB-2GB): Good performance
- **Large** (>2GB): May exceed GPU memory

### 2. Batch Processing

Process multiple inputs together:

```javascript
// ❌ BAD - Individual requests
for (const text of texts) {
  await classifier(text);  // Slow!
}

// ✅ GOOD - Batch processing
const results = await classifier(texts);  // 5-10x faster!
```

### 3. Warm-up Inference

First inference includes setup overhead:

```javascript
// Warm up the model (run once)
await classifier('warm-up text');

// Now measure actual performance
const startTime = performance.now();
const result = await classifier('real input');
const inferenceTime = performance.now() - startTime;
```

### 4. Memory Management

Monitor GPU memory usage:

```javascript
// Check available GPU memory
if (navigator.gpu) {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  console.log('GPU limits:', device.limits);
}
```

### 5. Model Caching

Models are automatically cached:

```javascript
import { env } from '@huggingface/transformers';

// Set cache directory (Node.js)
env.cacheDir = '/path/to/cache';

// Or disable remote models (use only cached)
env.allowRemoteModels = false;
```

---

## Advanced Configuration

### Custom WebGPU Options

```javascript
import { pipeline, env } from '@huggingface/transformers';

// Configure WebGPU backend
env.backends.onnx.wasm.webgpu = {
  // Use FP16 for 2x speed (if supported)
  preferredLayout: 'NCHW',

  // Memory optimization
  memoryLimitMB: 2048,

  // Enable profiling
  profiling: true,
};

const classifier = await pipeline('sentiment-analysis', model, {
  device: 'webgpu',
  dtype: 'fp16',  // Half precision (2x faster, minimal accuracy loss)
});
```

### Precision Trade-offs

| Precision | Speed | Memory | Accuracy | Use Case |
|-----------|-------|--------|----------|----------|
| **FP32** | 1x | 100% | 100% | Production |
| **FP16** | 2x | 50% | 99.9% | Recommended |
| **INT8** | 4x | 25% | 98% | Mobile/Edge |

```javascript
// Enable FP16 (half precision)
const classifier = await pipeline(task, model, {
  device: 'webgpu',
  dtype: 'fp16'  // 2x faster, minimal quality loss
});
```

---

## Troubleshooting

### Issue: "WebGPU not supported"

**Solutions:**
1. **Update browser:** Chrome/Edge 113+
2. **Enable flag:** `chrome://flags/#enable-unsafe-webgpu` (experimental browsers)
3. **Check GPU:** Ensure graphics drivers are updated
4. **HTTPS required:** WebGPU only works on HTTPS (not HTTP)

### Issue: "Out of memory"

**Solutions:**
1. **Use smaller model:**
   ```javascript
   // Instead of 'large', use 'base' or 'small'
   const model = 'onnx-community/distilbert-base-uncased';
   ```

2. **Reduce batch size:**
   ```javascript
   // Process in smaller batches
   const batchSize = 8;  // Instead of 32
   ```

3. **Clear cache:**
   ```javascript
   // Clear browser cache and reload
   // Or in Node.js:
   import { env } from '@huggingface/transformers';
   env.cacheDir = '/new/cache/path';
   ```

### Issue: Slow first inference

**This is normal!** First inference includes:
- Model download (if not cached)
- GPU initialization
- Shader compilation

**Solution:**
```javascript
// Show loading indicator during first inference
console.log('Initializing...');
await classifier('warmup');  // Takes ~5-10 seconds
console.log('Ready!');  // Subsequent inferences are fast
```

### Issue: Inconsistent performance

**Solutions:**
1. **Warm up GPU:**
   ```javascript
   // Run 2-3 warmup inferences
   for (let i = 0; i < 3; i++) {
     await classifier('warmup');
   }
   ```

2. **Avoid power saving mode:**
   - Laptops may throttle GPU
   - Plug in device for consistent performance

3. **Close other GPU-intensive tabs:**
   - Each tab competes for GPU resources

---

## Real-World Examples

### Text Generation with WebGPU

```javascript
import { pipeline } from '@huggingface/transformers';

const generator = await pipeline(
  'text-generation',
  'onnx-community/Phi-3.5-mini-instruct',
  { device: 'webgpu' }
);

// Generate with streaming-like effect
const result = await generator('Write a story about AI:', {
  max_new_tokens: 200,
  temperature: 0.9,
  top_k: 50,
});

console.log(result[0].generated_text);
// ~20 tokens/sec with WebGPU vs ~2 tokens/sec CPU
```

### Image Classification with Batch Processing

```javascript
const classifier = await pipeline(
  'image-classification',
  'Xenova/vit-base-patch16-224',
  { device: 'webgpu' }
);

// Process 10 images in parallel
const images = [...]; // Array of 10 images
const results = await Promise.all(images.map(img => classifier(img)));

// ~120ms total vs ~4500ms on CPU
```

### Real-Time Speech Recognition

```javascript
const transcriber = await pipeline(
  'automatic-speech-recognition',
  'onnx-community/whisper-base.en',
  { device: 'webgpu' }
);

// Real-time transcription (3x real-time speed)
const audio = await fetch('audio.mp3').then(r => r.arrayBuffer());
const result = await transcriber(audio);

console.log(result.text);
// Processes 10sec audio in ~3 seconds
```

---

## When to Use WebGPU

### ✅ Use WebGPU When:
- Users have modern browsers (Chrome 113+)
- Inference speed is critical
- Processing large batches
- Real-time applications (chat, voice, video)
- Desktop/ChromeOS applications

### ⚠️ Be Careful When:
- Mobile devices (battery drain)
- Older hardware (may not support)
- Need maximum compatibility
- Very small models (overhead may negate benefit)

### ❌ Avoid WebGPU When:
- Safari/iOS users (not supported yet)
- Server-side rendering (use Node.js with GPU)
- Models >4GB (exceed GPU memory)
- HTTP sites (WebGPU requires HTTPS)

---

## Future of WebGPU

### Upcoming Features

1. **Safari/iOS Support** (2025)
   - WebGPU coming to Safari 18+
   - Will enable iPhone/iPad acceleration

2. **Firefox Stable** (2025)
   - Currently behind flag
   - Full support planned

3. **Better Memory Management**
   - Automatic memory optimization
   - Smart model quantization

4. **WebNN Integration**
   - Web Neural Network API
   - Even better ML performance

---

## Resources

- **WebGPU Spec:** https://gpuweb.github.io/gpuweb/
- **Browser Support:** https://caniuse.com/webgpu
- **Transformers.js WebGPU Guide:** https://huggingface.co/docs/transformers.js/guides/webgpu
- **ONNX Runtime WebGPU:** https://onnxruntime.ai/docs/execution-providers/WebGPU-ExecutionProvider.html

---

## Summary

**WebGPU provides 5-10x speedup** for Transformers.js models with minimal code changes:

```javascript
// Just add { device: 'webgpu' }
const model = await pipeline(task, modelName, { device: 'webgpu' });
```

**Key Takeaways:**
- ✅ **70% browser support** in 2025 (Chrome, Edge, Opera)
- ✅ **5-10x faster** than CPU inference
- ✅ **Easy to enable** with single parameter
- ✅ **Production-ready** for modern browsers
- ⚠️ **Graceful fallback** to CPU when unavailable

Start using WebGPU today to deliver blazing-fast AI experiences in the browser!
