const scrapers = require("./scraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
  const url = "https://phongtro123.com/";
  const indexs = [1, 2, 3, 4];
  try {
    let browser = await browserInstance;
    // Gọi hàm cào ở file scrape
    const categories = await scrapers.scrapeCategory(browser, url);
    const selectedCategories = categories.filter((category, index) =>
      indexs.some((i) => i === index)
    );
    // let result1 = await scrapers.scraper(browser, selectedCategories[0].link);
    // fs.writeFile("chothuephongtro.json", JSON.stringify(result1), (err) => {
    //   if (err) console.log("Ghi du lieu vao file json that bai! " + err);
    //   else console.log("Ghi du lieu vao file json thanh cong!");
    // });
    let result2 = await scrapers.scraper(browser, selectedCategories[1].link);
    fs.writeFile("nhachothue.json", JSON.stringify(result2), (err) => {
      if (err) console.log("Ghi du lieu vao file json that bai! " + err);
      else console.log("Ghi du lieu vao file json thanh cong!");
    });
    let result3 = await scrapers.scraper(browser, selectedCategories[2].link);
    fs.writeFile("chothuecanho.json", JSON.stringify(result3), (err) => {
      if (err) console.log("Ghi du lieu vao file json that bai! " + err);
      else console.log("Ghi du lieu vao file json thanh cong!");
    });
    let result4 = await scrapers.scraper(browser, selectedCategories[3].link);
    fs.writeFile("chothuematbang.json", JSON.stringify(result4), (err) => {
      if (err) console.log("Ghi du lieu vao file json that bai! " + err);
      else console.log("Ghi du lieu vao file json thanh cong!");
    });
    await browser.close();
  } catch (error) {
    console.log("Loi o scrape controller: " + error);
  }
};

module.exports = scrapeController;
