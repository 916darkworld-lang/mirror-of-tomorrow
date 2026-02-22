// frontend/app/components/ai_controls.js

/**
 * AIControls
 *
 * A small coordinator that wires:
 *  - SendButton
 *  - NextButton
 *  - MixButton
 *  - ChamberButton
 *
 * into a unified control surface.
 *
 * This file does NOT contain business logic — only wiring.
 */

import SendButton from "./send_button";
import NextButton from "./next_button";
import MixButton from "./mix_button";
import ChamberButton from "./chamber_button";

class AIControls {
  constructor(config) {
    /**
     * config = {
     *   sendSelector: "#send",
     *   nextSelector: "#next",
     *   mixSelector: "#mix",
     *   chamberSelector: "#chamber",
     *   onSend: fn,
     *   onNext: fn,
     *   onMix: fn,
     *   onChamber: fn
     * }
     */

    this.send = new SendButton(config.sendSelector, config.onSend);
    this.next = new NextButton(config.nextSelector, config.onNext);
    this.mix = new MixButton(config.mixSelector, config.onMix);
    this.chamber = new ChamberButton(config.chamberSelector, config.onChamber);
  }

  enableAll() {
    this.send.enable();
    this.next.enable();
    this.mix.enable();
    this.chamber.enable();
  }

  disableAll() {
    this.send.disable();
    this.next.disable();
    this.mix.disable();
    this.chamber.disable();
  }
}

export default AIControls;
