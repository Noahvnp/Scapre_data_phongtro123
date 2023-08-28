const scrapeCategory = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let page = await browser.newPage();
      console.log(">> Mo tab moi...");
      await page.goto(url);
      console.log(">> Di den url " + url);
      await page.waitForSelector("#webpage");
      console.log(">> Website da loa xong...");

      const dataCategory = await page.$$eval(
        "#navbar-menu > ul > li",
        (elements) => {
          dataCategory = elements.map((el) => {
            return {
              category: el.querySelector("a").innerText,
              link: el.querySelector("a").href,
            };
          });

          return dataCategory;
        }
      );

      await page.close();
      console.log(">> Tab da dong.");

      resolve(dataCategory);
    } catch (error) {
      console.log("Loi o scraper: " + error);
      reject(error);
    }
  });

const scraper = (browser, url) =>
  new Promise(async (resolve, reject) => {
    try {
      let newPage = await browser.newPage();
      console.log(">> Đã mở tab mới...");
      await newPage.goto(url);
      console.log(">> Đã truy cập vào trang " + url);
      await newPage.waitForSelector("#main");
      console.log(">> Đã load xong thẻ main...");

      const scrapeData = {};

      // Lấy data header
      const headerData = await newPage.$eval("header", (el) => {
        return {
          title: el.querySelector("h1").innerText,
          desc: el.querySelector("p").innerText,
        };
      });
      scrapeData.header = headerData;

      // Lấy link details item
      const detailLinks = await newPage.$$eval(
        "#left-col > section > ul > li",
        (els) => {
          detailLinks = els.map(
            (el) => el.querySelector(".post-meta > h3 > a").href
          );
          return detailLinks;
        }
      );

      // Lay thong tin chi tiet 1 item
      const scraperDetails = async (link) =>
        new Promise(async (resolve, reject) => {
          try {
            let pageDetail = await browser.newPage();
            await pageDetail.goto(link);
            console.log(">> Truy cap vao link " + link);
            await pageDetail.waitForSelector("#main");

            const detailData = {};

            // Lay ra anh trong 1 item
            const images = await pageDetail.$$eval(
              "#left-col > article > div.post-images > div.images-swiper-container > div.swiper-wrapper > div.swiper-slide",
              (els) => {
                images = els.map((el) => el.querySelector("img")?.src);
                return images.filter((i) => !i === false);
              }
            );
            detailData.images = images;

            //Lay header detail
            const header = await pageDetail.$eval(".page-header", (el) => {
              return {
                title: el.querySelector(".page-h1 > a").innerText,
                star: el
                  .querySelector(".page-h1 > span")
                  ?.className?.replace(/^\D+/g, ""),
                class: {
                  content: el.querySelector("p").innerText,
                  classType: el.querySelector("p > a > strong").innerText,
                },
                address: el.querySelector("address").innerText,
                attributes: {
                  price: el.querySelector(".post-attributes > .price > span")
                    .innerText,
                  acreage: el.querySelector(
                    ".post-attributes > .acreage > span"
                  ).innerText,
                  published: el.querySelector(
                    ".post-attributes > .published > span"
                  ).innerText,
                  hashtag: el.querySelector(
                    ".post-attributes > .hashtag > span"
                  ).innerText,
                },
              };
            });
            detailData.header = header;

            // Lay thong tin mo ta
            const mainContentHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-main-content",
              (el) => el.querySelector("div.section-header > h2").innerText
            );
            const mainContentDesc = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-main-content > .section-content > p",
              (els) => els.map((el) => el.innerText)
            );

            detailData.mainContent = {
              header: mainContentHeader,
              description: mainContentDesc,
            };

            // Dac diem tin dang
            const overviewHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-overview",
              (el) => el.querySelector("div.section-header > h3").innerText
            );
            const overviewContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-overview > .section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => {
                  return {
                    name: el.querySelector("td:first-child").innerText,
                    content: el.querySelector("td:last-child").innerText,
                  };
                })
            );
            detailData.overview = {
              header: overviewHeader,
              content: overviewContent,
            };

            // Thong tin lien he
            const contactHeader = await pageDetail.$eval(
              "#left-col > article.the-post > section.post-contact",
              (el) => el.querySelector("div.section-header > h3").innerText
            );
            const contactContent = await pageDetail.$$eval(
              "#left-col > article.the-post > section.post-contact > .section-content > table.table > tbody > tr",
              (els) =>
                els.map((el) => {
                  return {
                    name: el.querySelector("td:first-child").innerText,
                    content: el.querySelector("td:last-child").innerText,
                  };
                })
            );
            detailData.contact = {
              header: contactHeader,
              content: contactContent,
            };

            await pageDetail.close();
            console.log(">> Da dong tab " + link);
            resolve(detailData);
          } catch (error) {
            console.log("Lay data details loi " + error);
            reject(error);
          }
        });

      const details = [];
      for (let link of detailLinks) {
        const detail = await scraperDetails(link);
        details.push(detail);
      }

      scrapeData.body = details;

      console.log(">>Trinh duyet da dong.");
      resolve(scrapeData);
    } catch (error) {
      reject(error);
    }
  });

module.exports = { scrapeCategory, scraper };
