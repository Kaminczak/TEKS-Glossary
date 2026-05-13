import { useState, useRef, useCallback } from "react";

/**
 * Hook for consuming SSE streams from POST endpoints.
 *
 * SSE protocol expected from backend:
 *   data: {"token": "chunk of text"}
 *   data: [DONE]
 *
 * Usage:
 *   const { data, isStreaming, error, start, stop, reset } = useSSE("/api/generate");
 *   await start({ recipe: "quiz", variables: { ... } });
 */
export function useSSE(url) {
  const [data, setData] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const start = useCallback(
    async (body) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setData("");
      setError(null);
      setIsStreaming(true);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.detail || `HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6);

            if (payload === "[DONE]") {
              setIsStreaming(false);
              return;
            }

            try {
              const parsed = JSON.parse(payload);
              if (parsed.token !== undefined) {
                setData((prev) => prev + parsed.token);
              }
              if (parsed.error) {
                setError(parsed.error);
                setIsStreaming(false);
                return;
              }
            } catch {
              // non-JSON line — skip
            }
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [url]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setData("");
    setError(null);
    setIsStreaming(false);
  }, []);

  return { data, isStreaming, error, start, stop, reset };
}
