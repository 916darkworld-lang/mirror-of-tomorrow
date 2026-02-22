// frontend/app/controllers/audio_controller.js

/**
 * AudioController
 *
 * Centralized controller for lightweight UI audio cues.
 * This keeps audio logic out of components and prevents duplication.
 *
 * Responsibilities:
 *  - playing short UI sounds (send, next, mix, chamber, error)
 *  - enabling/disabling audio globally
 *  - future expansion for user‑customizable sound packs
 */

class AudioController {
  constructor(config = {}) {
    /**
     * config = {
     *   enabled: true,
     *   sounds: {
     *     send: "assets/audio/send.mp3",
     *     next: "assets/audio/next.mp3",
     *     mix: "assets/audio/mix.mp3",
     *     chamber: "assets/audio/chamber.mp3",
     *     error: "assets/audio/error.mp3"
     *   }
     * }
     */

    this.enabled = config.enabled !== false;
    this.sounds = config.sounds || {};

    this.buffers = {};
    this.context = null;

    if (this.enabled) {
      this._initContext();
      this._preload();
    }
  }

  _initContext() {
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
    } catch (err) {
      console.error("AudioController: Web Audio API not supported", err);
      this.enabled = false;
    }
  }

  async _preload() {
    if (!this.context) return;

    for (const key in this.sounds) {
      const url = this.sounds[key];
      try {
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.buffers[key] = audioBuffer;
      } catch (err) {
        console.error("AudioController: failed to load sound:", key, err);
      }
    }
  }

  enable() {
    if (!this.context) this._initContext();
    this.enabled = true;
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

  playSend() {
    this.play("send");
  }

  playNext() {
    this.play("next");
  }

  playMix() {
    this.play("mix");
  }

  playChamber() {
    this.play("chamber");
  }

  playError() {
    this.play("error");
  }
}

export default AudioController;
