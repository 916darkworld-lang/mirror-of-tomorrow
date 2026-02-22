// frontend/app/api/api_mock.js

/**
 * APIMock
 *
 * A mock API layer used for offline development or testing.
 * Returns deterministic fake responses without hitting a server.
 */

class APIMock {
  constructor() {
    this.delay = 400; // ms
  }

  async sendPrompt(prompt) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          `Mock response for prompt:\n\n"${prompt}"\n\n(This is offline test mode.)`
        );
      }, this.delay);
    });
  }
}

export default APIMock;
