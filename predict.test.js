// enter selected img again (resets result img)
// click predict again when theres a img (retun nothing happens)
// space within url input / space in the start and end of url / space only
// cancel file input when there's a selected image
// clear alll data when selected new image
import puppeteer from "puppeteer";

const timeout = 10000;
let browser, page;
const app = "file:/Users/paulinez/image-classification/web/index.html";

describe(
  "Initial layout",
  () => {
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
      });
      page = await browser.newPage();
      await page.goto(app);
    });

    afterAll(async () => {
      await browser.close();
    });

    it("renders enter and predict buttons as disabled", async () => {
      let enterBtnIsDisabled = await page.$eval("#enter-btn", (button) => {
        return button.disabled;
      });
      let predictBtnIsDisabled = await page.$eval("#enter-btn", (button) => {
        return button.disabled;
      });
      expect(enterBtnIsDisabled).toBe(true);
      expect(predictBtnIsDisabled).toBe(true);
    });

    it("hides labels for an image's details - name, style and date", async () => {
      const labelsClassName = await page.$eval(".key", (label) => {
        return label.className;
      });
      expect(labelsClassName).toContain("hide");
    });

    it("renders a welcome-gif", async () => {
      const container = await page.$eval("#welcome-gif-container", (container) => {
        return container.innerHTML;
      });
      expect(container).toContain(
        '<img id="welcome-gif" src="public/images/welcome.gif" crossorigin="anonymous" alt="">'
      );
    });
  },
  timeout
);

describe(
  "A successful image url upload",
  () => {
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        slowMo: 40,
      });
      page = await browser.newPage();
      await page.goto(app);
    });

    afterAll(async () => {
      await browser.close();
    });

    it("enables enter button when there is an input", async () => {
      await page.click("#url-input");
      await page.type("#url-input", " ");
      let isDisabled = await page.$eval("#enter-btn", (button) => {
        return button.disabled;
      });
      expect(isDisabled).toBe(false);
    });

    it("renders a hand emoji on enter button when uploading is trigged", async () => {
      await page.focus("#url-input");
      await page.keyboard.press("End");
      await page.keyboard.press("Backspace");
      await page.click("#url-input");
      await page.type(
        "#url-input",
        "https://pea-nut-z.github.io/sneakers-image-classification/public/data/beluga/Beluga2.0-1.jpeg"
      );
      await page.click("#enter-btn");
      let enterBtn = await page.$eval("#enter-btn", (button) => {
        return button.innerHTML;
      });
      expect(enterBtn).toContain("👌");
    });

    it("enables predict button when a selected image is uploaded successfully", async () => {
      let isDisabled = await page.$eval("#predict-btn", (button) => {
        return button.disabled;
      });
      expect(isDisabled).toBe(false);
    });

    it("renders selected image successfully from url input", async () => {
      let image = await page.waitForSelector("#selected-image", (image) => {
        return image;
      });
      expect(image).toBeTruthy();
    });

    it("renders a message: 'Click Predict!'", async () => {
      let msg = await page.$eval("#res-msg", (container) => {
        return container.innerHTML;
      });
      expect(msg).toBe("Click predict!");
    });
  },
  timeout
);

// describe(
//   "A successful prediction",
//   () => {
//     beforeAll(async () => {
//       browser = await puppeteer.launch({
//         headless: false,
//         // slowMo: 30,
//       });
//       page = await browser.newPage();
//       await page.goto(app);
//     });

//     afterAll(async () => {
//       await browser.close();
//     });

//     it("renders a hand emoji on predict button when predicting is trigged", async () => {
//       await page.click("#predict-btn");
//       let predictBtn = await page.$eval("#predict-btn", (button) => {
//         return button.innerHTML;
//       });
//       expect(predictBtn).toContain("👌");
//     });

// MODEL NOT LOADING???
// it("renders four predicted images successfully", async () => {
//   let image = await page.waitForSelector("#predicted-image", (image) => {
//     return image;
//   });
//   expect(image).toBeTruthy();
// });
//   },
//   timeout
// );
