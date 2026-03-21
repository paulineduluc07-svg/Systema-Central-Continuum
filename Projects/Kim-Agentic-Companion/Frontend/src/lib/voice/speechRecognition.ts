/* eslint-disable @typescript-eslint/no-explicit-any */
export type TranscriptCallback = (transcript: string, isFinal: boolean) => void;

function getSR(): any | null {
  if (typeof window === "undefined") return null;
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null;
}

export class SpeechRecognitionManager {
  private recognition: any = null;
  private active = false;

  static isSupported(): boolean {
    return getSR() !== null;
  }

  start(onTranscript: TranscriptCallback, onEnd: () => void): void {
    const SR = getSR();
    if (!SR) return;
    this.recognition = new SR();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      onTranscript(result[0].transcript, result.isFinal);
    };
    this.recognition.onend = () => {
      this.active = false;
      onEnd();
    };
    this.recognition.onerror = () => {
      this.active = false;
      onEnd();
    };
    this.recognition.start();
    this.active = true;
  }

  stop(): void {
    if (this.recognition && this.active) {
      this.recognition.stop();
    }
  }
}
