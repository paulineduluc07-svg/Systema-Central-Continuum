import { useState, useCallback, useRef, useEffect } from "react";

export type SpeechState = "idle" | "listening" | "processing" | "error";

interface UseSpeechToTextOptions {
  language?: string;
  continuous?: boolean;
  onResult?: (transcript: string) => void;
  onStateChange?: (state: SpeechState) => void;
}

interface UseSpeechToTextReturn {
  isListening: boolean;
  transcript: string;
  state: SpeechState;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechToText({
  language = "fr-FR",
  continuous = false,
  onResult,
  onStateChange,
}: UseSpeechToTextOptions = {}): UseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [state, setState] = useState<SpeechState>("idle");
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  const onStateChangeRef = useRef(onStateChange);

  // Keep refs up to date
  useEffect(() => {
    onResultRef.current = onResult;
    onStateChangeRef.current = onStateChange;
  }, [onResult, onStateChange]);

  // Check browser support
  const isSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  const updateState = useCallback((newState: SpeechState) => {
    setState(newState);
    onStateChangeRef.current?.(newState);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("La reconnaissance vocale n'est pas supportée par ton navigateur. Utilise Chrome.");
      updateState("error");
      return;
    }

    setError(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onstart = () => {
      setIsListening(true);
      updateState("listening");
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentTranscript = (finalTranscript + interimTranscript).trim();
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      const final = finalTranscript.trim();
      if (final) {
        setTranscript(final);
        onResultRef.current?.(final);
      }
      updateState("idle");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      if (event.error === "no-speech") {
        setError("Aucune parole détectée. Réessaie.");
      } else if (event.error === "audio-capture") {
        setError("Micro non détecté. Vérifie les permissions.");
      } else if (event.error === "not-allowed") {
        setError("Accès au micro refusé. Autorise-le dans les paramètres du navigateur.");
      } else {
        setError(`Erreur : ${event.error}`);
      }

      updateState("error");
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (e) {
      setError("Impossible de démarrer la reconnaissance vocale.");
      updateState("error");
    }
  }, [isSupported, language, continuous, updateState]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    state,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}
