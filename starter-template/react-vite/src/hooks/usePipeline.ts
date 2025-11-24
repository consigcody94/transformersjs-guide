import { useState, useEffect, useCallback, useRef } from 'react';
import { pipeline, Pipeline } from '@huggingface/transformers';

type PipelineTask = 'sentiment-analysis' | 'text-generation' | 'image-classification' | 'automatic-speech-recognition';

interface UsePipelineOptions {
  model?: string;
  device?: 'auto' | 'webgpu' | 'wasm';
}

interface UsePipelineReturn<T = any> {
  ready: boolean;
  loading: boolean;
  error: string | null;
  output: T | null;
  run: (input: any) => Promise<void>;
  reset: () => void;
}

export function usePipeline<T = any>(
  task: PipelineTask,
  options: UsePipelineOptions = {}
): UsePipelineReturn<T> {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<T | null>(null);

  const pipelineRef = useRef<Pipeline | null>(null);

  // Initialize pipeline
  useEffect(() => {
    let cancelled = false;

    const initPipeline = async () => {
      try {
        setError(null);

        const pipe = await pipeline(task, options.model, {
          device: options.device || 'auto',
        });

        if (!cancelled) {
          pipelineRef.current = pipe;
          setReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load model');
          console.error('Pipeline initialization error:', err);
        }
      }
    };

    initPipeline();

    return () => {
      cancelled = true;
    };
  }, [task, options.model, options.device]);

  // Run inference
  const run = useCallback(async (input: any) => {
    if (!pipelineRef.current) {
      setError('Pipeline not ready');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await pipelineRef.current(input);
      setOutput(result as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inference failed');
      console.error('Inference error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setOutput(null);
    setError(null);
  }, []);

  return {
    ready,
    loading,
    error,
    output,
    run,
    reset,
  };
}
