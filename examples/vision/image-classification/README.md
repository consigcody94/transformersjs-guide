# Image Classification Example

Advanced image classification demo with multiple model support, drag-and-drop, and real-time performance metrics.

## Features

- 🖼️ **Multiple Models** - Switch between ViT, MobileNet, ResNet, DeiT
- 📤 **Drag & Drop** - Upload images via drag-and-drop or click
- 📊 **Top-K Results** - Show top 5 predictions with confidence scores
- ⚡ **Performance Metrics** - Real-time inference time tracking
- 🎨 **Beautiful UI** - Modern, responsive design with animations
- 🖱️ **Example Images** - Quick-test with pre-loaded images

## Quick Start

Just open `index.html` in your browser - no build required!

Or serve locally:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

## Supported Models

### 1. ViT (Vision Transformer) - Default
- **Model:** `Xenova/vit-base-patch16-224`
- **Size:** ~350MB
- **Speed:** Medium (~300-500ms)
- **Accuracy:** High
- **Best for:** General-purpose classification

### 2. MobileNetV4
- **Model:** `Xenova/mobilenetv4_conv_small.e2400_r224_in1k`
- **Size:** ~15MB
- **Speed:** Fast (~100-200ms)
- **Accuracy:** Good
- **Best for:** Mobile devices, embedded systems

### 3. ResNet-50
- **Model:** `Xenova/resnet-50`
- **Size:** ~100MB
- **Speed:** Medium-Fast (~200-400ms)
- **Accuracy:** High
- **Best for:** Production applications

### 4. DeiT (Data-efficient Image Transformer)
- **Model:** `Xenova/deit-tiny-patch16-224`
- **Size:** ~22MB
- **Speed:** Fast (~150-300ms)
- **Accuracy:** Good
- **Best for:** Resource-constrained environments

## How It Works

### 1. Model Loading

```javascript
import { pipeline } from '@huggingface/transformers';

// Load image classification pipeline
const classifier = await pipeline(
  'image-classification',
  'Xenova/vit-base-patch16-224'
);
```

### 2. Classification

```javascript
// Classify image (URL, File, or base64)
const results = await classifier(imageUrl, { topk: 5 });

console.log(results);
// [
//   { label: 'tiger', score: 0.9872 },
//   { label: 'tiger cat', score: 0.0098 },
//   { label: 'jaguar', score: 0.0012 },
//   ...
// ]
```

### 3. Input Formats

```javascript
// From URL
await classifier('https://example.com/image.jpg');

// From File object
await classifier(fileInputElement.files[0]);

// From base64 data URL
await classifier('data:image/jpeg;base64,...');

// From HTMLImageElement
await classifier(document.getElementById('myImage'));
```

## Performance Optimization

### Enable WebGPU

```javascript
const classifier = await pipeline(
  'image-classification',
  'Xenova/vit-base-patch16-224',
  { device: 'webgpu' }  // 5-10x faster!
);
```

**Requirements:**
- Chrome/Edge 113+
- Compatible GPU
- HTTPS connection

### Model Selection Guide

| Use Case | Recommended Model | Why |
|----------|-------------------|-----|
| Mobile app | MobileNetV4 | Small size, fast inference |
| Web app | ViT Base | Best balance |
| High accuracy | ResNet-50 | Proven accuracy |
| Embedded | DeiT Tiny | Lightweight |

### Performance Tips

1. **Preload Model**
   ```javascript
   // Load during app initialization
   window.addEventListener('DOMContentLoaded', async () => {
     classifier = await pipeline('image-classification');
   });
   ```

2. **Reuse Pipeline**
   ```javascript
   // ❌ BAD - Creates new pipeline each time
   async function classify(img) {
     const cls = await pipeline('image-classification');
     return await cls(img);
   }

   // ✅ GOOD - Reuse single pipeline
   const cls = await pipeline('image-classification');
   async function classify(img) {
     return await cls(img);
   }
   ```

3. **Batch Processing**
   ```javascript
   // Classify multiple images efficiently
   const images = [img1, img2, img3];
   const results = await Promise.all(
     images.map(img => classifier(img))
   );
   ```

## Advanced Usage

### Custom Top-K

```javascript
// Get top 10 predictions
const results = await classifier(image, { topk: 10 });
```

### Get All Classes

```javascript
// Get probabilities for all 1000 ImageNet classes
const results = await classifier(image, { topk: null });
```

### Progress Callback

```javascript
const classifier = await pipeline('image-classification', model, {
  progress_callback: (progress) => {
    console.log(`Download: ${progress.progress}%`);
  }
});
```

## ImageNet Classes

All models are trained on ImageNet-1K (1000 classes):
- Animals: 398 classes
- Plants: 74 classes
- Objects: 268 classes
- Vehicles: 68 classes
- Food: 80 classes
- etc.

**Full class list:** https://github.com/pytorch/hub/blob/master/imagenet_classes.txt

## Use Cases

### 1. Photo Organization
Automatically tag and organize photo libraries:
```javascript
const results = await classifier(photo);
const tags = results.map(r => r.label);
// Store tags in database
```

### 2. Content Moderation
Detect inappropriate content:
```javascript
const results = await classifier(userUpload);
if (results[0].label.includes('unsafe_keyword')) {
  flagForReview(userUpload);
}
```

### 3. E-commerce
Auto-categorize product images:
```javascript
const category = await classifier(productImage);
assignCategory(product, category[0].label);
```

### 4. Medical Imaging
Screen medical images (with specialized models):
```javascript
const diagnosis = await classifier(xrayImage);
if (diagnosis[0].score > 0.8) {
  alertDoctor(diagnosis);
}
```

## Error Handling

```javascript
try {
  const results = await classifier(image);
} catch (error) {
  if (error.message.includes('fetch')) {
    console.error('Network error - check connection');
  } else if (error.message.includes('format')) {
    console.error('Invalid image format');
  } else if (error.message.includes('memory')) {
    console.error('Out of memory - try smaller model');
  }
}
```

## Browser Compatibility

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 90+ | ✅ Full support |
| Firefox | 89+ | ✅ Full support |
| Safari | 14.1+ | ✅ Full support |
| Edge | 90+ | ✅ Full support |
| Mobile Chrome | 90+ | ✅ Works (slower) |
| Mobile Safari | 14.1+ | ✅ Works (slower) |

## Limitations

- **Input size:** Images are resized to 224×224 (models' training size)
- **Classes:** Limited to ImageNet-1K categories
- **Fine-grained:** May struggle with very similar classes
- **Novel objects:** Won't recognize objects not in training data

## Custom Models

### Using Fine-Tuned Models

```javascript
// Use your own fine-tuned model from Hugging Face
const classifier = await pipeline(
  'image-classification',
  'your-username/your-model'
);
```

### Converting Models

1. Train in PyTorch/TensorFlow
2. Export to ONNX format
3. Optimize with ONNX Runtime
4. Upload to Hugging Face Hub
5. Use with Transformers.js

**Guide:** https://huggingface.co/docs/transformers.js/custom_usage

## Next Steps

- ✅ [Object Detection](../object-detection/) - Detect and locate multiple objects
- ✅ [Image Segmentation](../image-segmentation/) - Pixel-level classification
- ✅ [Depth Estimation](../depth-estimation/) - Monocular depth maps
- ✅ [Zero-Shot Classification](../../multimodal/zero-shot-classification/) - Classify without training

## Resources

- [Transformers.js Docs](https://huggingface.co/docs/transformers.js)
- [ImageNet Dataset](https://www.image-net.org/)
- [Vision Transformers Paper](https://arxiv.org/abs/2010.11929)
- [Model Hub](https://huggingface.co/models?pipeline_tag=image-classification&library=transformers.js)

## License

MIT - Feel free to use in your projects!
