window.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  const sendBtn = document.getElementById('send-btn');

  const minimizeAllBtn = document.getElementById('minimize-all');
  const maximizeAllBtn = document.getElementById('maximize-all');
  const restoreAllBtn = document.getElementById('restore-all');
  const hideAllBtn = document.getElementById('hide-all');
  const showAllBtn = document.getElementById('show-all');

  const responsesBox = document.getElementById('responses');
  const consensusBox = document.getElementById('consensus-box');
  const finalAnswerBox = document.getElementById('final-answer');

  function appendResponse(modelName, content) {
    const entry = document.createElement('div');
    entry.style.marginBottom = '12px';
    entry.innerHTML = `<strong>${modelName.toUpperCase()}</strong><br>${content}`;
    responsesBox.appendChild(entry);
    responsesBox.scrollTop = responsesBox.scrollHeight;
  }

  sendBtn.addEventListener('click', () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    responsesBox.innerHTML = '';
    consensusBox.innerHTML = '';
    finalAnswerBox.innerHTML = '';

    controlBridge.sendPrompt(prompt);
  });

  minimizeAllBtn.addEventListener('click', () => {
    controlBridge.minimizeAll();
  });

  maximizeAllBtn.addEventListener('click', () => {
    controlBridge.maximizeAll();
  });

  restoreAllBtn.addEventListener('click', () => {
    controlBridge.restoreAll();
  });

  hideAllBtn.addEventListener('click', () => {
    controlBridge.hideAll();
  });

  showAllBtn.addEventListener('click', () => {
    controlBridge.showAll();
  });

  controlBridge.onPartialResponse((payload) => {
    appendResponse(payload.modelName, payload.content);
  });

  controlBridge.onConsensusResult((payload) => {
    consensusBox.innerText = payload.finalAnswer;
    finalAnswerBox.innerText = payload.finalAnswer;
  });
});
