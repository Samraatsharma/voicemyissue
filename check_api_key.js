
const fs = require('fs');
const path = require('path');
const https = require('https');

// Manually read .env.local
function getApiKey() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            const match = content.match(/GEMINI_API_KEY=(.*)/);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
    } catch (e) {
        // ignore
    }
    return process.env.GEMINI_API_KEY;
}

const key = getApiKey();

if (!key) {
    console.error("NO_KEY_FOUND");
    process.exit(1);
}

const maskedKey = key.substring(0, 4) + "..." + key.substring(key.length - 4);
console.log(`Checking Key: ${maskedKey}`);

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`HTTP Status: ${res.statusCode}`);

        try {
            const json = JSON.parse(data);

            if (res.statusCode === 200) {
                console.log("SUCCESS! API Key is valid.");
                console.log("Available Models:");
                const models = json.models || [];
                const modelNames = models.map(m => m.name.replace('models/', ''));
                console.log(modelNames.join(', '));

                if (modelNames.length === 0) {
                    console.log("WARNING: Key is valid but has NO models assigned.");
                }
            } else {
                console.error("API FAILURE RESPONSE:");
                console.error(JSON.stringify(json, null, 2));
                console.log("\nINTERPRETATION:");
                if (res.statusCode === 400 && json.error?.status === 'INVALID_ARGUMENT') {
                    console.log("- The API Key format is incorrect.");
                } else if (res.statusCode === 403) {
                    console.log("- The API Key is blocked, suspended, or has no quota.");
                } else if (res.statusCode === 404) {
                    console.log("- The API endpoint was not found (rare) or account is not set up contextually.");
                }
            }
        } catch (e) {
            console.error("Raw Body (Not JSON):", data);
        }
    });

}).on("error", (err) => {
    console.error("Network Error:", err.message);
});
