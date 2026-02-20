const { contextBridge, ipcRenderer } = require('electron');

function waitForElement(selector, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      if (Date.now() - start >= timeout) {
        return reject(new Error('Timeout waiting for selector: ' + selector));
      }

      requestAnimationFrame(check);
    };

    check();
  });
}

async function injectPrompt(prompt) {
  try {
    const inputBox =
      await waitForElement('div[contenteditable="true"]') ||
      await waitForElement('textarea');

    if (inputBox.tagName && inputBox.tagName.toLowerCase() === 'textarea') {
      inputBox.value = prompt;
      inputBox.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      inputBox.innerText = prompt;
      inputBox.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const sendButton =
      document.querySelector('button[aria-label="Send"]') ||
      document.querySelector('button[type="submit"]') ||
      document.querySelector('button[data-testid="send-button"]');

    if (sendButton) {
      sendButton.click();
    }
  } catch (err) {
    console.error('Claude prompt injection failed:', err);
  }
}

function observeResponses() {
  const target = document.body;

  const observer = new MutationObserver(() => {
    const messages = document.querySelectorAll(
      '.markdown, .prose, .message, .chat-message, .assistant-response'
    );

    if (!messages.length) return;

    const last = messages[messages.length - 1];
    const text = last.innerText.trim();

    if (text && text.length > 0) {
      ipcRenderer.sendToHost('ai-response', text);
    }
  });

  observer.observe(target, { childList: true, subtree: true });
}

contextBridge.exposeInMainWorld('claudeBridge', {
  injectPrompt: (prompt) => injectPrompt(prompt)
});

window.addEventListener('DOMContentLoaded', () => {
  observeResponses();

  ipcRenderer.on('inject-prompt', (event, prompt) => {
    injectPrompt(prompt);
  });
});
