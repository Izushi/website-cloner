import { exec } from 'child_process';
import { promisify } from 'util';
import { DeployResult } from './types';

const execAsync = promisify(exec);

export class VercelDeployer {
  async deploy(localPath: string): Promise<DeployResult> {
    console.log('🌐 Starting deployment to Vercel...');
    console.log('ℹ️  Note: First-time users may need to run "npx vercel login" manually');

    try {
      // Generate a unique project name
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      const projectName = `cloned-${timestamp}-${random}`;

      console.log(`📡 Deploying project: ${projectName}...`);

      // Deploy using vercel command
      const command = `npx vercel --prod --yes --name ${projectName} ${localPath}`;
      const { stdout, stderr } = await execAsync(command, {
        timeout: 180000 // 3 minutes timeout
      });

      if (stderr && stderr.includes('Error')) {
        throw new Error(stderr);
      }

      // Extract deployment URL from output
      const urlMatch = stdout.match(/https:\/\/[^\s]+\.vercel\.app/);
      if (!urlMatch) {
        throw new Error('Could not find deployment URL in Vercel output');
      }

      const url = urlMatch[0];
      const domain = url.replace('https://', '');

      console.log(`✅ Deployment successful!`);
      console.log(`🌍 Your website is live at: ${url}`);

      return {
        success: true,
        url,
        domain
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown deployment error';
      console.error('❌ Deployment failed:', errorMessage);

      return {
        success: false,
        url: '',
        domain: '',
        error: errorMessage
      };
    }
  }
}