"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useCallback } from "react";
import { isListeningAtom, voiceAvailableAtom } from "@/stores/voiceStore";
import { SpeechRecognitionManager } from "@/lib/voice/speechRecognition";

export function useVoice(onTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useAtom(isListeningAtom);
  const setVoiceAvailable = useSetAtom(voiceAvailableAtom);
  const srRef = useRef(new SpeechRecognitionManager());
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);

  useEffect(() => {
    setVoiceAvailable(SpeechRecognitionManager.isSupported());
  }, [setVoiceAvailable]);

  const startListening = useCallback(() => {
    srRef.current.start(
      (transcript, isFinal) => {
        if (isFinal && transcript.trim()) {
          onTranscriptRef.current(transcript.trim());
        }
      },
      () => setIsListening(false)
    );
    setIsListening(true);
  }, [setIsListening]);

  const stopListening = useCallback(() => {
    srRef.current.stop();
    setIsListening(false);
  }, [setIsListening]);

  function toggle() {
    if (isListening) stopListening();
    else startListening();
  }

  return { isListening, toggle, startListening, stopListening };
}
