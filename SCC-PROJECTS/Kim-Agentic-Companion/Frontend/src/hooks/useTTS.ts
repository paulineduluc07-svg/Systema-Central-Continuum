"use client";

import { useSetAtom } from "jotai";
import { isSpeakingAtom } from "@/stores/voiceStore";
import { kimApi } from "@/lib/api/client";
import { playAudioBase64 } from "@/lib/voice/audioPlayback";

export function useTTS() {
  const setIsSpeaking = useSetAtom(isSpeakingAtom);

  async function speak(text: string): Promise<void> {
    if (!text.trim()) return;
    setIsSpeaking(true);
    try {
      const res = await kimApi.synthesizeVoice({ text });
      if (res.audioBase64) {
        await playAudioBase64(res.audioBase64, res.mimeType ?? "audio/mpeg");
      }
    } catch {
      // TTS failure is non-fatal — chat still works
    } finally {
      setIsSpeaking(false);
    }
  }

  return { speak };
}
