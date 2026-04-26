const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for the root or any unmatched routes to support SPA behavior
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `\n🚀 SafeReport Local Server Running!`);
    console.log(`\x1b[32m%s\x1b[0m`, `🔗 Local: http://localhost:${PORT}`);
    console.log(`\x1b[90m%s\x1b[0m`, `📁 Serving from: ${__dirname}\n`);
});
