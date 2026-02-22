// frontend/app/controllers/audio_controller.js

/**
 * AudioController
 *
 * Centralized controller for lightweight UI audio cues.
 * Modernized for stability:
 *  - Safe async loading
 *  - Guaranteed context resume on user gesture
 *  - Prevents double‑play race conditions
 */

class AudioController {
  constructor(config = {}) {
    this.enabled = config.enabled !== false;

    this.sounds = config.sounds || {
      send: "assets/audio/send.mp3",
      next: "assets/audio/next.mp3",
      mix: "assets/audio/mix.mp3",
      chamber: "assets/audio/chamber.mp3",
      error: "assets/audio/error.mp3"
    };

    this.context = null;
    this.buffers = {};
    this.loading = false;

    if (this.enabled) {
      this._initContext();
      this._preload();
    }
  }

  _initContext() {
    if (this.context) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();

      // Required on mobile: resume on first user gesture
      const resume = () => {
        if (this.context.state === "suspended") {
          this.context.resume();
        }
        window.removeEventListener("touchstart", resume);
        window.removeEventListener("click", resume);
      };

      window.addEventListener("touchstart", resume, { once: true });
      window.addEventListener("click", resume, { once: true });

    } catch (err) {
      console.error("AudioController: Web Audio API not supported", err);
      this.enabled = false;
    }
  }

  async _preload() {
    if (!this.context || this.loading) return;

    this.loading = true;

    const entries = Object.entries(this.sounds);

    for (const [key, url] of entries) {
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();

        const audioBuffer = await new Promise((resolve, reject) => {
          this.context.decodeAudioData(arrayBuffer, resolve, reject);
        });

        this.buffers[key] = audioBuffer;

      } catch (err) {
        console.error(`AudioController: failed to load sound "${key}"`, err);
      }
    }

    this.loading = false;
  }

  enable() {
    this.enabled = true;
    if (!this.context) this._initContext();
  }

  disable() {
    this.enabled = false;
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  play(name) {
    if (!this.enabled) return;
    if (!this.context) return;

    const buffer = this.buffers[name];
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    source.start(0);
  }

  playSend() { this.play("send"); }
  playNext() { this.play("next"); }
  playMix() { this.play("mix"); }
  playChamber() { this.play("chamber"); }
  playError() { this.play("error"); }
}

export default AudioController;
