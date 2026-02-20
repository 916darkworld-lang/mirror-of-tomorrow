const runBtn = document.getElementById('run-pipeline-btn');

const stageMusic = document.querySelector('#stage-music .stage-output');
const stageVideo = document.querySelector('#stage-video .stage-output');
const stageArt = document.querySelector('#stage-art .stage-output');
const finalBox = document.getElementById('studio-result');

runBtn.onclick = async () => {
    const prompt = document.getElementById('studio-prompt').value.trim();
    if (!prompt) return;

    stageMusic.textContent = "Generating music...";
    stageVideo.textContent = "Waiting...";
    stageArt.textContent = "Waiting...";
    finalBox.textContent = "Processing...";

    try {
        const response = await fetch('/creative/pipeline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        stageMusic.textContent = data.components.music.result;
        stageVideo.textContent = data.components.video.result;
        stageArt.textContent = data.components.art.result;

        finalBox.textContent = data.output;
    } catch (err) {
        finalBox.textContent = "ERROR: Pipeline failed.";
    }
};
