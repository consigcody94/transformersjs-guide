# Installation Guide

## Overview

Transformers.js can be installed and used in **three different environments**:
1. **Browser (via CDN)** - No build step required
2. **Browser (via NPM + bundler)** - With Vite, Webpack, etc.
3. **Node.js** - Server-side JavaScript

---

## Browser Installation (CDN)

### Quick Start (No Build Required)

The fastest way to get started - no installation needed:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Transformers.js Demo</title>
</head>
<body>
  <h1>AI in the Browser</h1>
  <div id="output"></div>

  <script type="module">
    // Import from CDN
    import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';

    async function runModel() {
      const classifier = await pipeline('sentiment-analysis');
      const result = await classifier('I love Transformers.js!');

      document.getElementById('output').textContent = JSON.stringify(result, null, 2);
    }

    runModel();
  </script>
</body>
</html>
```

### CDN Options

**jsDelivr (Recommended)**
```javascript
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';
```

**UNPKG**
```javascript
import { pipeline } from 'https://unpkg.com/@huggingface/transformers@3.7.6';
```

**Skypack**
```javascript
import { pipeline } from 'https://cdn.skypack.dev/@huggingface/transformers@3.7.6';
```

### Pros & Cons

✅ **Pros:**
- Zero setup - works immediately
- No build tools required
- Great for prototyping
- Easy to share demos

❌ **Cons:**
- Larger initial download
- No tree-shaking
- Requires internet connection
- Version pinning recommended

---

## Browser Installation (NPM + Bundler)

### For Production Applications

**Step 1: Install Package**

```bash
# NPM
npm install @huggingface/transformers

# Yarn
yarn add @huggingface/transformers

# PNPM
pnpm add @huggingface/transformers
```

**Step 2: Import in Your Code**

```javascript
import { pipeline } from '@huggingface/transformers';

const classifier = await pipeline('sentiment-analysis');
const result = await classifier('This is production code!');
console.log(result);
```

### Supported Bundlers

#### Vite (Recommended)

```bash
npm create vite@latest my-ai-app -- --template vanilla
cd my-ai-app
npm install @huggingface/transformers
npm run dev
```

**vite.config.js:**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@huggingface/transformers']
  }
});
```

#### Webpack

```bash
npm install @huggingface/transformers
```

**webpack.config.js:**
```javascript
module.exports = {
  // ... other config
  resolve: {
    fallback: {
      "fs": false,
      "path": false
    }
  }
};
```

#### Parcel

```bash
npm install @huggingface/transformers
parcel index.html
```

No configuration needed!

#### Rollup

```bash
npm install @huggingface/transformers
```

**rollup.config.js:**
```javascript
import resolve from '@rollup/plugin-node-resolve';

export default {
  plugins: [resolve({ browser: true })]
};
```

### Pros & Cons

✅ **Pros:**
- Tree-shaking (smaller bundles)
- TypeScript support
- Local development
- Version control
- Build optimizations

❌ **Cons:**
- Requires build setup
- More complex configuration
- Build step needed

---

## Node.js Installation

### Server-Side AI

**Step 1: Ensure Node.js Version**

```bash
node --version  # Must be >= 18.0.0
```

**Step 2: Install Package**

```bash
npm install @huggingface/transformers
```

**Step 3: Use in Your Code**

```javascript
import { pipeline } from '@huggingface/transformers';

// Create pipeline (models cached to ~/.cache/huggingface)
const classifier = await pipeline('sentiment-analysis');

// Run inference
const result = await classifier('Server-side AI is powerful!');
console.log(result);
```

### CommonJS vs ES Modules

**ES Modules (Recommended)**

**package.json:**
```json
{
  "type": "module"
}
```

**Import:**
```javascript
import { pipeline } from '@huggingface/transformers';
```

**CommonJS (Legacy)**

```javascript
const { pipeline } = require('@huggingface/transformers');
```

⚠️ **Note:** Transformers.js v3+ is ESM-first. Use Node 18+ with `"type": "module"`.

### Node.js-Specific Features

✅ **File System Access** - Load local models
✅ **Better Performance** - No browser sandboxing
✅ **Environment Variables** - `HF_TOKEN`, cache control
✅ **Process Isolation** - Run heavy models safely

---

## Version Pinning

### Why Pin Versions?

Transformers.js is actively developed. Pin versions to avoid breaking changes:

**Exact Version (Most Stable)**
```json
{
  "dependencies": {
    "@huggingface/transformers": "3.7.6"
  }
}
```

**Minor Updates (Recommended)**
```json
{
  "dependencies": {
    "@huggingface/transformers": "^3.7.0"
  }
}
```

**Patch Updates Only**
```json
{
  "dependencies": {
    "@huggingface/transformers": "~3.7.6"
  }
}
```

---

## TypeScript Support

Transformers.js includes TypeScript definitions out-of-the-box!

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true
  }
}
```

**Usage:**
```typescript
import { pipeline, Pipeline } from '@huggingface/transformers';

const classifier: Pipeline = await pipeline('sentiment-analysis');
const result = await classifier('TypeScript support!');
```

---

## Verifying Installation

### Quick Test Script

**test.js:**
```javascript
import { pipeline, env } from '@huggingface/transformers';

console.log('Testing Transformers.js installation...');

// Disable local model loading for quick test
env.allowLocalModels = false;

try {
  const classifier = await pipeline('sentiment-analysis');
  const result = await classifier('Installation successful!');
  console.log('✅ Success:', result);
} catch (error) {
  console.error('❌ Error:', error.message);
}
```

**Run:**
```bash
node test.js
```

**Expected Output:**
```
Testing Transformers.js installation...
✅ Success: [ { label: 'POSITIVE', score: 0.9998 } ]
```

---

## Environment Variables

Configure Transformers.js behavior:

```bash
# Node.js environment variables
export HF_HOME=~/.cache/huggingface     # Model cache directory
export HF_TOKEN=hf_xxxxx                # Hugging Face API token
export TRANSFORMERS_CACHE=/path/to/cache # Alternative cache location
```

**.env file:**
```env
HF_HOME=/custom/cache/path
HF_TOKEN=hf_your_token_here
```

**In Code:**
```javascript
import { env } from '@huggingface/transformers';

// Custom cache directory
env.cacheDir = '/path/to/models';

// Use local models only
env.allowRemoteModels = false;

// Use local models only (no downloads)
env.allowLocalModels = true;
env.allowRemoteModels = false;
```

---

## Troubleshooting

### Issue: "Module not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Top-level await not supported"

**Solution:** Ensure you're using:
- Node.js 18+ with `"type": "module"` in package.json
- OR wrap in async function:

```javascript
(async () => {
  const { pipeline } = await import('@huggingface/transformers');
  const classifier = await pipeline('sentiment-analysis');
})();
```

### Issue: WebGPU not available

**Solution:** Check browser support:
```javascript
if ('gpu' in navigator) {
  console.log('✅ WebGPU supported');
} else {
  console.log('❌ WebGPU not available - using CPU');
}
```

Supported browsers: Chrome 113+, Edge 113+, Opera 99+

### Issue: CORS errors in browser

**Solution:** Models are hosted on Hugging Face CDN (CORS-enabled). If using local models:

```javascript
// Vite: put models in public/ directory
env.localModelPath = '/models/';
```

### Issue: Out of memory errors

**Solution:** Use smaller/quantized models:
```javascript
// Instead of 'large' model, use 'small'
const generator = await pipeline('text-generation',
  'onnx-community/gpt2',  // 124M parameters
  // NOT 'onnx-community/gpt2-xl'  // 1.5B parameters
);
```

---

## Next Steps

Now that you have Transformers.js installed:

1. ✅ **[Quick Start Guide](quick-start.md)** - Build your first AI app
2. ✅ **[Core Concepts](core-concepts.md)** - Understand pipelines & models
3. ✅ **[Browser vs Node.js](browser-vs-nodejs.md)** - Platform differences

---

## Need Help?

- **Documentation:** https://huggingface.co/docs/transformers.js
- **GitHub Issues:** https://github.com/huggingface/transformers.js/issues
- **Community Forum:** https://discuss.huggingface.co
