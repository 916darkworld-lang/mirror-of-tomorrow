const thinkBtn = document.getElementById('think-btn');
const nodes = document.querySelectorAll('.ai-node');
const resultBox = document.getElementById('result-box');

thinkBtn.onclick = async () => {
    const prompt = document.getElementById('prompt-input').value;
    if (!prompt) return;

    nodes.forEach(node => node.classList.add('active'));
    resultBox.innerText = "Synchronizing models and checking memory...";

    try {
        const response = await fetch('/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        const data = await response.json();

        resultBox.innerHTML = `<strong>IAI DECISION:</strong><br>${data.output}`;
        console.log("Memory Context Applied:", data.contextApplied);
    } catch (err) {
        resultBox.innerText = "ERROR: Brain connection lost.";
    } finally {
        setTimeout(() => nodes.forEach(n => n.classList.remove('active')), 1000);
    }
};
