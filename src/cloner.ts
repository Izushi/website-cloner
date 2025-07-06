import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CloneOptions, CloneResult } from './types';

export class WebsiteCloner {
  async clone(options: CloneOptions): Promise<CloneResult> {
    const startTime = Date.now();
    console.log(`🚀 Starting clone of ${options.url}`);

    try {
      // Create output directory
      const outputDir = options.outputDirectory || './cloned-site';
      await fs.mkdir(outputDir, { recursive: true });

      // Launch browser
      const browser = await chromium.launch();
      const page = await browser.newPage();

      // Navigate to the website
      console.log('📄 Loading page...');
      await page.goto(options.url, { waitUntil: 'networkidle' });

      // Get the page content
      const content = await page.content();
      
      // Save the main HTML file
      const indexPath = path.join(outputDir, 'index.html');
      await fs.writeFile(indexPath, content);

      // Get all resources (CSS, JS, images)
      const resources = await page.evaluate(() => {
        const links: string[] = [];
        
        // Get CSS files
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
          const href = (link as HTMLLinkElement).href;
          if (href) links.push(href);
        });
        
        // Get JS files
        document.querySelectorAll('script[src]').forEach(script => {
          const src = (script as HTMLScriptElement).src;
          if (src) links.push(src);
        });
        
        // Get images
        document.querySelectorAll('img[src]').forEach(img => {
          const src = (img as HTMLImageElement).src;
          if (src) links.push(src);
        });
        
        return links;
      });

      console.log(`📦 Found ${resources.length} resources to download`);

      // Download resources
      let totalSize = (await fs.stat(indexPath)).size;
      let downloadedCount = 1; // index.html already saved

      for (const resourceUrl of resources) {
        try {
          const response = await page.context().request.get(resourceUrl);
          if (response.ok()) {
            const buffer = await response.body();
            
            // Create filename from URL
            const urlObj = new URL(resourceUrl);
            const filename = path.basename(urlObj.pathname) || 'resource';
            const resourcePath = path.join(outputDir, filename);
            
            await fs.writeFile(resourcePath, buffer);
            totalSize += buffer.length;
            downloadedCount++;
          }
        } catch (error) {
          console.warn(`⚠️  Failed to download ${resourceUrl}`);
        }
      }

      await browser.close();

      const duration = Date.now() - startTime;
      console.log(`✅ Clone completed in ${(duration / 1000).toFixed(2)}s`);
      console.log(`📊 Downloaded ${downloadedCount} files (${(totalSize / 1024).toFixed(2)} KB)`);

      return {
        success: true,
        localPath: outputDir,
        url: options.url,
        totalFiles: downloadedCount,
        totalSize
      };

    } catch (error) {
      console.error('❌ Clone failed:', error);
      return {
        success: false,
        localPath: '',
        url: options.url,
        totalFiles: 0,
        totalSize: 0
      };
    }
  }
}