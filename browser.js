const puppeteer = require("puppeteer");

const startBrowser = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-setuid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (e) {
    console.log("Không tạo được browser: " + e);
  }
  return browser;
};

module.exports = startBrowser;
