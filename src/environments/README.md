# Environment Configuration

## Setup Instructions

1. Copy `environment.example.ts` to `environment.ts` and `environment.development.ts`
2. Replace `YOUR_GOOGLE_CLOUD_API_KEY_HERE` with your actual Google Cloud Vision API key
3. **IMPORTANT**: Never commit the actual `environment.ts` or `environment.development.ts` files with real API keys

## Security Note

The environment files containing actual API keys are gitignored to prevent accidental exposure of sensitive credentials.

For production deployments, use environment variables or a secure backend proxy to protect API keys.
