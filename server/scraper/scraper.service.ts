import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';

puppeteer.use(StealthPlugin());

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  private getRandomDelay(min = 1000, max = 3000) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async findLeadSources(query: string) {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(userAgent);
      await page.setViewport({ width: 1280, height: 800 });

      this.logger.log(`Searching Google for lead sources: ${query}`);
      const searchQuery = `${query} importers exporters directory contact email website`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

      // Anti-blocking: random delay
      await new Promise(resolve => setTimeout(resolve, this.getRandomDelay()));

      const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors
          .map(a => a.href)
          .filter(href => href.startsWith('http') && !href.includes('google.com'))
          .slice(0, 5);
      });

      return links;
    } finally {
      await browser.close();
    }
  }

  async extractTextFromUrl(url: string) {
    const userAgent = new UserAgent({ deviceCategory: 'desktop' }).toString();
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(userAgent);
      await page.setViewport({ width: 1280, height: 800 });

      this.logger.log(`Scraping page: ${url}`);
      // Anti-blocking: random delay
      await new Promise(resolve => setTimeout(resolve, this.getRandomDelay(2000, 5000)));
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      
      const text = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script, style, nav, footer, header');
        scripts.forEach(s => s.remove());
        return document.body.innerText;
      });
      
      return `\n\n--- Source: ${url} ---\n${text.substring(0, 4000)}`;
    } finally {
      await browser.close();
    }
  }
}
