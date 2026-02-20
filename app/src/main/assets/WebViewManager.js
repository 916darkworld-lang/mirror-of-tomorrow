(function () {
  function waitForElement(selector, timeout) {
    return new Promise(function (resolve, reject) {
      var start = Date.now();

      function check() {
        var el = document.querySelector(selector);
        if (el) return resolve(el);

        if (Date.now() - start >= timeout) {
          return reject("Timeout waiting for selector: " + selector);
        }

        requestAnimationFrame(check);
      }

      check();
    });
  }

  function observeResponses(modelName) {
    var observer = new MutationObserver(function () {
      var messages = document.querySelectorAll(
        ".markdown, .prose, .response, .answer, .chat-message, .assistant-response"
      );

      if (!messages.length) return;

      var last = messages[messages.length - 1];
      var text = last.innerText.trim();

      if (text && text.length > 0) {
        if (window.AndroidBridge && window.AndroidBridge.onAIResponse) {
          window.AndroidBridge.onAIResponse(text);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function injectPrompt(prompt) {
    var selectors = ["textarea", 'div[contenteditable="true"]'];

    function tryInject() {
      return waitForElement(selectors[0], 15000)
        .catch(function () {
          return waitForElement(selectors[1], 15000);
        })
        .then(function (input) {
          if (input.tagName && input.tagName.toLowerCase() === "textarea") {
            input.value = prompt;
            input.dispatchEvent(new Event("input", { bubbles: true }));
          } else {
            input.innerText = prompt;
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }

          var sendButton =
            document.querySelector('button[aria-label="Send"]') ||
            document.querySelector('button[type="submit"]') ||
            document.querySelector('button[data-testid="send-button"]') ||
            document.querySelector('button[aria-label="Submit"]');

          if (sendButton) {
            sendButton.click();
          }
        });
    }

    tryInject().catch(function (err) {
      if (window.AndroidBridge && window.AndroidBridge.onLog) {
        window.AndroidBridge.onLog("Prompt injection failed: " + err);
      }
    });
  }

  window.WebViewManager = {
    injectPrompt: injectPrompt,
    observeResponses: observeResponses
  };
})();
