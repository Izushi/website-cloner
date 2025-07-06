#!/usr/bin/env node

import { WebsiteCloner } from './cloner';
import { VercelDeployer } from './deployer';
import { CloneAndDeployResult } from './types';

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🌐 Website Cloner - Minimal Implementation

Usage:
  npm run clone-and-deploy <URL>

Example:
  npm run clone-and-deploy https://example.com

This will:
1. Clone the website using Playwright
2. Deploy it automatically to Vercel
3. Provide you with a live URL
`);
    process.exit(0);
  }

  const url = args[0];
  
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.error('❌ Error: URL must start with http:// or https://');
    process.exit(1);
  }

  console.log(`🎯 Target: ${url}`);
  console.log('📋 Process: Clone → Deploy → Live URL\n');

  try {
    // Step 1: Clone the website
    const cloner = new WebsiteCloner();
    const cloneResult = await cloner.clone({ url });

    if (!cloneResult.success) {
      console.error('❌ Clone failed, aborting deployment');
      process.exit(1);
    }

    // Step 2: Deploy to Vercel
    const deployer = new VercelDeployer();
    const deployResult = await deployer.deploy(cloneResult.localPath);

    // Step 3: Show results
    const result: CloneAndDeployResult = {
      ...cloneResult,
      deployment: deployResult
    };

    console.log('\n🎉 Process completed!');
    console.log(`📊 Clone: ${result.totalFiles} files, ${(result.totalSize / 1024).toFixed(2)} KB`);
    
    if (result.deployment?.success) {
      console.log(`🌍 Live URL: ${result.deployment.url}`);
      console.log('\n✨ Your website is now live and accessible worldwide!');
    } else {
      console.log(`❌ Deployment failed: ${result.deployment?.error}`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(console.error);