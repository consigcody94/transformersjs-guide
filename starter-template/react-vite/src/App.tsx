import { useState } from 'react';
import { usePipeline } from './hooks/usePipeline';
import './App.css';

function App() {
  const [text, setText] = useState('I love Transformers.js with React!');
  const {
    output,
    loading,
    error,
    ready,
    run
  } = usePipeline('sentiment-analysis');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    await run(text);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🤗 Transformers.js + React</h1>
        <p className="subtitle">
          TypeScript + Vite + Custom Hooks
        </p>

        <div className="card">
          <h2>Sentiment Analysis</h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze..."
            rows={4}
            disabled={loading}
          />

          <button
            onClick={handleAnalyze}
            disabled={!ready || loading || !text.trim()}
          >
            {loading ? '⏳ Analyzing...' : ready ? '🔍 Analyze' : '⏳ Loading model...'}
          </button>

          {error && (
            <div className="error">
              ❌ {error}
            </div>
          )}

          {output && (
            <div className={`result ${output[0].label.toLowerCase()}`}>
              <div className="result-label">
                {output[0].label}
              </div>
              <div className="result-score">
                Confidence: {(output[0].score * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        <div className="info">
          <h3>Features Demonstrated</h3>
          <ul>
            <li>✅ TypeScript with strict mode</li>
            <li>✅ Custom React hooks for AI</li>
            <li>✅ Loading states & error handling</li>
            <li>✅ Optimized with Vite</li>
            <li>✅ Production-ready structure</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
