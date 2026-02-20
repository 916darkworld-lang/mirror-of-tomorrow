// server.js
const express = require('express');
const path = require('path');
const IAIEngine = require('./backend/IAIEngine');
const MemoryManager = require('./backend/MemoryManager');

const app = express();
const port = 3000;

app.use(express.json());

// ⭐ Serve frontend UI
app.use(express.static('public'));

const userDataPath = path.join(__dirname, 'data');
const memory = new MemoryManager(userDataPath);
const iai = new IAIEngine({ userDataPath, mode: 'hybrid' });

// MAIN: Prompt -> IAI Brain -> Result
app.post('/process', async (req, res) => {
    try {
        const { prompt, mode, meta } = req.body || {};

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'prompt is required' });
        }

        const result = await iai.think({ prompt, mode, meta });

        res.json({
            status: 'success',
            output: result.output,
            reasoning: result.reasoning
        });
    } catch (err) {
        console.error('Error in /process:', err);
        res.status(500).json({ error: 'Internal error', details: err.message });
    }
});

// AUDIT: What the brain "knows"
app.get('/ia-brain/identity', (req, res) => {
    try {
        res.json(memory.getTraits());
    } catch (err) {
        console.error('Error in /ia-brain/identity:', err);
        res.status(500).json({ error: 'Internal error', details: err.message });
    }
});

// LEARN: Inject new traits/insights
app.post('/ia-brain/learn', async (req, res) => {
    try {
        const newInsight = req.body || {};
        await memory.updateIdentity(newInsight);
        res.json({ status: 'updated', applied: newInsight });
    } catch (err) {
        console.error('Error in /ia-brain/learn:', err);
        res.status(500).json({ error: 'Internal error', details: err.message });
    }
});

app.listen(port, () => {
    console.log(`IAI Mouth active at http://localhost:${port}`);
});
