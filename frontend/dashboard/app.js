/* ---------------------------------------------------------
   Mirror of Tomorrow - Frontend Intelligence Layer
   This script powers the holographic dashboard UI.
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
   TEMPORARY SIMULATION OF BACKEND OUTPUT
   (This will be replaced by real orchestrator integration)
--------------------------------------------------------- */
function simulateBackend(text) {
    return {
        summary: `Based on your input, your emotional trajectory shows signs of growth and stabilization. 
                  Your current mindset indicates forward momentum and constructive self-alignment.`,
        trajectory: "up",
        emotion: "focused",
        risk: "low",
        reward: "medium",
        stability: "stable",
        insights: [
            "Your emotional signals show increased clarity.",
            "Your behavioral patterns indicate consistent improvement.",
            "Your stress markers remain manageable.",
            "Your future-state projection trends positive."
        ]
    };
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
analyzeBtn.addEventListener("click", () => {
    const text = inputBox.value.trim();

    if (!text) {
        futureSummary.innerHTML = "Please enter something to analyze.";
        return;
    }

    // Simulate backend for now
    const result = simulateBackend(text);

    // Render hologram output
    renderFutureState(result);
});
