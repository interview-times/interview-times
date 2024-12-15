export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // クライアントサイドでのみ初期化
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }
  }

  async loadAudio(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error("Failed to load audio:", error);
      throw error;
    }
  }

  play(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audioContext || !this.audioBuffer || this.isPlaying) {
        reject(new Error("Cannot play audio"));
        return;
      }

      try {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.connect(this.audioContext.destination);

        this.source.onended = () => {
          this.isPlaying = false;
          this.source = null;
          resolve(); // 音声再生が終了したらPromiseを解決
        };

        this.source.start(0);
        this.isPlaying = true;
      } catch (error) {
        reject(error);
      }
    });
  }

  stop(): void {
    if (this.source && this.isPlaying) {
      this.source.stop();
      this.isPlaying = false;
      this.source = null;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  dispose(): void {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
