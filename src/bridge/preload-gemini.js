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
    const textarea = await waitForElement('textarea, div[contenteditable="true"]');

    if (textarea.tagName.toLowerCase() === 'textarea') {
      textarea.value = prompt;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      textarea.innerText = prompt;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const sendButton =
      document.querySelector('button[aria-label="Send message"]') ||
      document.querySelector('button[data-send-button]') ||
      document.querySelector('button[type="submit"]');

    if (sendButton) {
      sendButton.click();
    }
  } catch (err) {
    console.error('Gemini prompt injection failed:', err);
  }
}

function observeResponses() {
  const target = document.body;

  const observer = new MutationObserver(() => {
    const messages = document.querySelectorAll('.markdown, .response, .prose, .message-content');
    if (!messages.length) return;

    const last = messages[messages.length - 1];
    const text = last.innerText.trim();

    if (text && text.length > 0) {
      ipcRenderer.sendToHost('ai-response', text);
    }
  });

  observer.observe(target, { childList: true, subtree: true });
}

contextBridge.exposeInMainWorld('geminiBridge', {
  injectPrompt: (prompt) => injectPrompt(prompt)
});

window.addEventListener('DOMContentLoaded', () => {
  observeResponses();

  ipcRenderer.on('inject-prompt', (event, prompt) => {
    injectPrompt(prompt);
  });
});
