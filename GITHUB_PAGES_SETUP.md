# 🚀 GitHub Pages Setup Guide

This guide will help you set up GitHub Pages for your delivery app repository.

## 📋 Prerequisites

Before you begin, make sure that:

1. All the necessary files are in place in the `delivery/frontend/dist` directory:
   - `index.html` (with redirect script)
   - `404.html` (for client-side routing)
   - `assets/` directory with CSS and JS files
2. The GitHub Actions workflow is configured in `.github/workflows/deploy-frontend.yml`

## ⚙️ Steps to Enable GitHub Pages

### 1. Navigate to Repository Settings

- Go to your repository: https://github.com/ashiii2121/delivery-app
- Click on the **Settings** tab

### 2. Access Pages Configuration

- In the left sidebar, scroll down and click on **Pages** under the "Code and automation" section

### 3. Configure GitHub Pages

- Under "Build and deployment":
  - **Source**: Select **GitHub Actions**
- Click **Save**

### 4. Monitor Deployment

- The GitHub Actions workflow will automatically deploy your site
- You can monitor the progress in the [Actions tab](https://github.com/ashiii2121/delivery-app/actions)
- Look for the workflow named "Deploy Frontend to GitHub Pages"

### 5. Access Your Site

- Once deployment is complete, your site will be available at:
  **https://ashiii2121.github.io/delivery-app/**
- It may take a few minutes for the site to be available after the workflow completes

## 🔧 Troubleshooting

### If the site still shows "404 There isn't a GitHub Pages site here":

1. **Check GitHub Actions**:

   - Go to the [Actions tab](https://github.com/ashiii2121/delivery-app/actions)
   - Verify that the "Deploy Frontend to GitHub Pages" workflow completed successfully
   - If it failed, check the logs for error messages

2. **Verify Pages Configuration**:

   - Double-check that GitHub Pages is set to deploy from GitHub Actions:
     - Go to [Pages settings](https://github.com/ashiii2121/delivery-app/settings/pages)
     - Ensure "Source" is set to "GitHub Actions"

3. **Trigger a New Deployment**:
   - If needed, you can trigger a new deployment by making a small change and pushing to the main branch
   - Or create an empty commit:
     ```bash
     git commit --allow-empty -m "Trigger GitHub Pages deployment"
     git push
     ```

### If the site shows "404 File not found" after navigation:

1. **Verify 404.html file**:

   - Ensure the `404.html` file exists in the `delivery/frontend/dist` directory
   - Check that it contains the redirect script from [spa-github-pages](https://github.com/rafgraph/spa-github-pages)

2. **Check the redirect script in index.html**:

   - Verify that the built `index.html` file contains the redirect script
   - The script should be added by the post-build process

3. **Confirm base path configuration**:
   - Check that `vite.config.js` has the correct base path: `/delivery-app/`
   - This should match your repository name

## 📁 File Structure

Your deployed site expects the following files in the root of the `delivery/frontend/dist` directory:

```
dist/
├── 404.html
├── index.html
├── vite.svg
└── assets/
    ├── index.[hash].css
    └── index.[hash].js
```

## 🔄 How Client-Side Routing Works

1. When a user navigates to a route like `/restaurants`, GitHub Pages can't find that file
2. GitHub Pages serves the `404.html` file instead
3. The `404.html` file contains JavaScript that redirects the user back to `index.html` with the correct route information
4. The `index.html` file includes a script that processes this redirect information
5. Your React application loads and handles the route correctly with React Router

## 🔄 Recent Deployment Status

A new deployment was triggered with the commit message "Re-trigger GitHub Pages deployment".
Please check the [Actions tab](https://github.com/ashiii2121/delivery-app/actions) to monitor the deployment progress.

## Additional Troubleshooting Steps

If you're still experiencing 404 errors after the deployment has completed, please follow these additional steps:

### 1. Verify GitHub Pages Settings

1. Go to your repository settings: https://github.com/ashiii2121/delivery-app/settings
2. Scroll down to the "Pages" section in the left sidebar
3. Under "Source", make sure it's set to "GitHub Actions"
4. If it's not set to "GitHub Actions", change it and save

### 2. Check Deployment Status

1. Go to the "Actions" tab: https://github.com/ashiii2121/delivery-app/actions
2. Check if the latest workflow completed successfully
3. If it failed, check the logs for error messages

### 3. Verify Branch Protection (if applicable)

1. In repository settings, check "Branches" section
2. Make sure there are no branch protection rules preventing deployment

### 4. Check Custom Domain Settings

1. In the Pages settings, check if there's a custom domain configured
2. If there is, verify it's correct or remove it temporarily for testing

### 5. Force Rebuild

If none of the above works, try triggering a rebuild:

```bash
cd delivery/frontend
npm run build
```

Then commit and push a small change to trigger a new deployment.

## Common Issues and Solutions

### Issue: "There isn't a GitHub Pages site here"

This typically means GitHub Pages isn't enabled for the repository or isn't configured to use GitHub Actions.

### Issue: "404 File not found"

This usually happens when:

1. The build process failed
2. The base path in vite.config.js doesn't match your repository name
3. The routing configuration isn't working properly

## 🆘 Need Help?

If you're still having issues:

1. Check the [GitHub Actions workflow logs](https://github.com/ashiii2121/delivery-app/actions)
2. Verify all files are correctly built in the `delivery/frontend/dist` directory
3. Make sure the repository name matches the base path in `vite.config.js` (`/delivery-app/`)
4. Ensure GitHub Pages is set to deploy from GitHub Actions in the [Pages settings](https://github.com/ashiii2121/delivery-app/settings/pages)

## Need More Help?

If you're still experiencing issues after following all these steps, please provide:

1. A screenshot of your GitHub Pages settings
2. The URL you're trying to access
3. Any error messages from the browser console
4. The deployment logs from the Actions tab
