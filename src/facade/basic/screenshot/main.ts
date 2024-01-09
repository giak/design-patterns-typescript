import path from 'path';
import { URL } from 'url';

import { PuppeteerFacade } from './puppeteer.facade';

const puppeteerFacade = new PuppeteerFacade();

function getFormattedDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function takeScreenshot(url: string): Promise<void> {
  const dateString = getFormattedDate();
  const dnsName = new URL(url).hostname;
  const screenshotPath = path.join(__dirname, `${dateString}_${dnsName}.png`);
  await puppeteerFacade.takeScreenshot(url, screenshotPath);
}

async function getContent(url: string): Promise<void> {
  const content = await puppeteerFacade.getContent(url);
  console.log(content);
}

async function main(url: string) {
  try {
    new URL(url); // This will throw an error if the URL is invalid
    await puppeteerFacade.setup();
    await takeScreenshot(url);
    await getContent(url);
    await puppeteerFacade.teardown();
  } catch (error) {
    console.error('Error:', error);
    await puppeteerFacade.teardown();
  }
}

main('https://theme-hope.vuejs.press/');
