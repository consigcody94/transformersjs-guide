import { pipeline } from '@huggingface/transformers';

let classifier = null;

// Initialize when page loads
async function init() {
  const button = document.getElementById('analyze');
  button.textContent = 'Loading model...';
  button.disabled = true;

  try {
    // Load sentiment analysis model
    classifier = await pipeline('sentiment-analysis');

    button.textContent = 'Analyze Sentiment';
    button.disabled = false;

    console.log('✅ Model loaded successfully');
  } catch (error) {
    console.error('Failed to load model:', error);
    button.textContent = 'Failed to load model';
  }
}

// Analyze text sentiment
async function analyze() {
  const text = document.getElementById('text').value.trim();
  const resultDiv = document.getElementById('result');

  if (!text) {
    resultDiv.innerHTML = '<p class="error">Please enter some text!</p>';
    return;
  }

  try {
    const result = await classifier(text);
    const { label, score } = result[0];

    resultDiv.innerHTML = `
      <div class="result-card ${label.toLowerCase()}">
        <strong>${label}</strong>
        <p>Confidence: ${(score * 100).toFixed(1)}%</p>
      </div>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
  }
}

// Setup event listeners
document.getElementById('analyze').addEventListener('click', analyze);

// Initialize on load
init();
