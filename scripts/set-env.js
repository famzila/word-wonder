const fs = require('fs');
const path = require('path');

// Load .env file for local development
// We don't need 'dotenv' in production because Vercel injects variables directly
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config();
    } catch (e) {
        // dotenv might not be installed or needed if variables are set another way
        // silently ignore
    }
}

const targetPath = path.join(__dirname, '../src/environments/environment.ts');

const envFileContent = `
export const environment = {
  googleCloudApiKey: '${process.env.GOOGLE_CLOUD_API_KEY || ""}',
  pexelAPI: '${process.env.PEXELS_API_KEY || ""}',
  geminiModel: '${process.env.GEMINI_MODEL || "gemini-1.5-flash"}',
  imageProvider: '${process.env.IMAGE_PROVIDER || "pexels"}',
  geminiImageModel: '${process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image"}',
  imageApiUrl: 'https://api.pexels.com/v1/search'
};
`;

// Check if critical keys are missing in production
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    if (!process.env.GOOGLE_CLOUD_API_KEY) {
        console.warn('WARNING: GOOGLE_CLOUD_API_KEY is not defined in the environment variables.');
    }
    if (!process.env.PEXELS_API_KEY) {
        console.warn('WARNING: PEXELS_API_KEY is not defined in the environment variables.');
    }
}

// Ensure the directory exists
const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFile(targetPath, envFileContent, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Environment variables wrote to ${targetPath}`);
});
