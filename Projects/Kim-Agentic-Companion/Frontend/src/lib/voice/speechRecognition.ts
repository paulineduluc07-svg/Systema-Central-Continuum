type SpeechRecognitionCtor = typeof SpeechRecognition;
export type TranscriptCallback = (transcript: string, isFinal: boolean) => void;

function getSR(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window.SpeechRecognition ?? (window as any).webkitSpeechRecognition) ?? null;
}

export class SpeechRecognitionManager {
  private recognition: SpeechRecognition | null = null;
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
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
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
