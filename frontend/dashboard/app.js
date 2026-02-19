/* ---------------------------------------------------------
   Mirror of Tomorrow - Frontend Intelligence Layer
   Connects the dashboard UI to the backend API.
--------------------------------------------------------- */

// DOM elements
const inputBox = document.getElementById("userInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const futureSummary = document.getElementById("futureSummary");
const insightsList = document.getElementById("insightsList");

/* ---------------------------------------------------------
   HOLOGRAPHIC ANIMATION HELPERS
--------------------------------------------------------- */
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.transition = "opacity 0.6s ease";
    requestAnimationFrame(() => {
        element.style.opacity = 1;
    });
}

function clearInsights() {
    insightsList.innerHTML = "";
}

/* ---------------------------------------------------------
   CALL BACKEND API
--------------------------------------------------------- */
async function callBackend(text) {
    try {
        const response = await fetch("http://localhost:8000/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        return data;

    } catch (error) {
        return {
            summary: "Backend unreachable. Check server connection.",
            trajectory: "flat",
            emotion: "neutral",
            risk: "low",
            reward: "low",
            stability: "stable",
            insights: ["Unable to connect to backend API."]
        };
    }
}

/* ---------------------------------------------------------
   RENDER FUTURE-STATE HOLOGRAM
--------------------------------------------------------- */
function renderFutureState(data) {
    // Summary hologram
    futureSummary.innerHTML = `
        <strong>Trajectory:</strong> ${data.trajectory}<br>
        <strong>Emotion:</strong> ${data.emotion}<br>
        <strong>Risk:</strong> ${data.risk}<br>
        <strong>Reward:</strong> ${data.reward}<br>
        <strong>Stability:</strong> ${data.stability}<br><br>
        ${data.summary}
    `;
    fadeIn(futureSummary);

    // Insights
    clearInsights();
    data.insights.forEach((insight) => {
        const li = document.createElement("li");
        li.textContent = insight;
        insightsList.appendChild(li);
        fadeIn(li);
    });
}

/* ---------------------------------------------------------
   MAIN BUTTON HANDLER
--------------------------------------------------------- */
analyzeBtn.addEventListener("click", async () => {
    const text = inputBox.value.trim();

    if (!text) {
        futureSummary.innerHTML = "Please enter something to analyze.";
        return;
    }

    // Call backend API
    const result = await callBackend(text);

    // Render hologram output
    renderFutureState(result);
});
