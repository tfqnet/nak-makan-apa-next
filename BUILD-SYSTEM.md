# Build Number System

This project uses a build number system to track deployments:

**Format**: `Version 2.2.0 Build XXX`

## How it works

- **Version 2.2.0**: Main version number (manually updated for major releases)
- **Build XXX**: Auto-incremented 3-digit number for each deployment

## Usage

### Manual Build Increment
```bash
# Increment build number only
npm run increment-build
```

### Full Deployment
```bash
# Increment build + commit + push (recommended)
npm run deploy-prod
```

Or use the script directly:
```bash
./deploy.sh
```

### Manual Process
```bash
# 1. Increment build
node increment-build.js

# 2. Commit and push
git add .
git commit -m "Deploy: Your message (Build XXX)"
git push
```

## Build Number Location

The build number is stored in `src/App.jsx`:
```javascript
const BUILD_NUMBER = '001'; // Increment with each deployment
```

It appears in:
- About page: "Version 2.2.0 Build 001"
- Email feedback subject and body
- Error reports and tracking

## Examples

- First deployment: `Version 2.2.0 Build 001`
- Second deployment: `Version 2.2.0 Build 002`
- After 10 deployments: `Version 2.2.0 Build 010`

This helps track which exact build users are using when they report issues or provide feedback.
