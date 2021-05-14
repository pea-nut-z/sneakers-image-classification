import puppeteer from "puppeteer";

let browser, page;
const githubPath = "https://pea-nut-z.github.io/sneakers-image-classification";
// To run test in development
// const app = "file:/Users/paulinez/image-classification/web/index.html";
// To run test in production
const app = `${githubPath}/index.html`;
const testImage1 = `${githubPath}/public/data/beluga/Beluga2.0-1.jpeg`;
const testImage2 = `${githubPath}/public/data/blue-tint/Blue-Tint-1.jpeg`;
const brokenImage = "https://pea-nut-z.github.io.jpeg";

(async () => {
  const pti = require("puppeteer-to-istanbul");
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Enable both JavaScript and CSS coverage
  await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);
  // Navigate to page
  await page.goto(app);
  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);
  pti.write([...jsCoverage, ...cssCoverage], {
    includeHostname: true,
    storagePath: "./.nyc_output",
  });
  await browser.close();
})();

describe("Initial layout", () => {
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
      `<img id="welcome-gif" src="${githubPath}/public/images/welcome.gif" crossorigin="anonymous" alt="">`
    );
  });
});

describe("Enter and predict buttons do toggle", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 20,
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

  it("enables predict button when a selected image is uploaded successfully", async () => {
    jest.setTimeout(30000);
    await page.focus("#url-input");
    await page.keyboard.press("End");
    await page.keyboard.press("Backspace");
    await page.click("#url-input");
    await page.type("#url-input", testImage1);
    await page.click("#enter-btn");
    let isDisabled = await page.$eval("#predict-btn", (button) => {
      return button.disabled;
    });
    expect(isDisabled).toBe(false);
  });
});

describe("A successful image url upload with prediction returned", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 20,
    });
    page = await browser.newPage();
    await page.goto(app);
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("renders a hand emoji on enter button when uploading is trigged", async () => {
    await page.click("#url-input");
    await page.type("#url-input", testImage1);
    await page.click("#enter-btn");
    let enterBtn = await page.$eval("#enter-btn", (button) => {
      return button.innerHTML;
    });
    expect(enterBtn).toContain("👌");
  });

  it("renders selected image successfully from url input", async () => {
    let container = await page.$eval("#selected-image-container", (container) => {
      return container.innerHTML;
    });
    expect(container).toContain(
      `<img id="selected-image" src="${githubPath}/public/data/beluga/Beluga2.0-1.jpeg" crossorigin="anonymous" alt="">`
    );
  });

  it("renders a message: 'Click Predict!'", async () => {
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("Click predict!");
  });

  it("renders a hand emoji on predict button when predicting is trigged - fails sometimes", async () => {
    // FAILS SOMETIMES
    // try jest.setTimeout with a shorter timer to catch the text before it changes but with no success
    await page.click("#predict-btn");
    let predictBtn = await page.$eval("#predict-btn", (button) => {
      return button.innerHTML;
    });
    expect(predictBtn).toContain("👌");
  });

  it("renders four predicted images", async () => {
    let count = await page.$$eval("#predicted-image", (element) => element.length);
    expect(count).toBe(4);
  });

  it("renders the accurate prediction", async () => {
    const percentage = await page.$eval("#percentage-accuracy", (ele) => {
      return ele.innerHTML;
    });
    const name = await page.$eval("#name", (ele) => {
      return ele.innerHTML;
    });
    const style = await page.$eval("#style", (ele) => {
      return ele.innerHTML;
    });
    const release = await page.$eval("#release", (ele) => {
      return ele.innerHTML;
    });
    const imgSrc = await page.$eval("#predicted-image", (img) => {
      return img.getAttribute("src");
    });
    expect(percentage).toBe("Percentage Accuracy: 98%");
    expect(name).toBe("Adidas Yeezy Boost 350 V2 Beluga 2.0");
    expect(style).toBe("AH2203");
    expect(release).toBe("11/25/2017");
    expect(imgSrc).toMatch("beluga");
  });

  it("renders a message: See prediction!", async () => {
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("See prediction!");
  });
});

describe("File upload from local storage", () => {
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

  it("uploads an image successfully", async () => {
    const [fileChooser] = await Promise.all([page.waitForFileChooser(), page.click("#upload-btn")]);
    await fileChooser.accept(["/Users/paulinez/Downloads/more/WAVE-RUNNER/WAVE-RUNNER-6.jpeg"]);
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

  it("uploads a non-image file  - renders a error message and remove broken img tag", async () => {
    const [fileChooser] = await Promise.all([page.waitForFileChooser(), page.click("#upload-btn")]);
    await fileChooser.accept(["/Users/paulinez/Downloads/GoogleService-Info.plist"]);
    let imgContainer = await page.$eval("#selected-image-container", (container) => {
      return container.innerHTML;
    });
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(imgContainer).toBe("");
    expect(msg).toBe("Invalid image format.");
  });
});

describe("upload an image when data from previous image is still present", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 20,
    });
    page = await browser.newPage();
    await page.goto(app);
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("displays the new image and removes previous image's data", async () => {
    await page.click("#url-input");
    await page.type("#url-input", testImage1);
    await page.click("#enter-btn");
    await page.click("#predict-btn");
    // ENTER SECOND IMAGE
    await page.$eval("#url-input", (el) => el.setSelectionRange(0, el.value.length));
    await page.keyboard.press("Backspace");
    await page.type("#url-input", testImage2);
    await page.click("#enter-btn");

    let container = await page.$eval("#selected-image-container", (container) => {
      return container.innerHTML;
    });

    const percentage = await page.$eval("#percentage-accuracy", (ele) => {
      return ele.innerHTML;
    });
    const name = await page.$eval("#name", (ele) => {
      return ele.innerHTML;
    });
    const style = await page.$eval("#style", (ele) => {
      return ele.innerHTML;
    });
    const release = await page.$eval("#release", (ele) => {
      return ele.innerHTML;
    });

    expect(container).toContain(
      `<img id="selected-image" src="${testImage2}" crossorigin="anonymous" alt="">`
    );
    expect(percentage).toBe("");
    expect(name).toBe("");
    expect(style).toBe("");
    expect(release).toBe("");
  });
});

describe("A unsuccessful image url upload ", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 30,
    });
    page = await browser.newPage();
    await page.goto(app);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("renders a error message and removes broken selected image on broken image upload", async () => {
    // TEST THIS RIGHT AFTER A SUCCESSFUL PREDICTION TO CHECK IF IT REMOVES PREVIOUS ITEM INFO AND DISABLE PREDICT BUTTON AGAIN
    await page.click("#url-input");
    await page.type("#url-input", brokenImage);
    await page.click("#enter-btn");

    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    let imgContainer = await page.$eval("#selected-image-container", (container) => {
      return container.innerHTML;
    });
    expect(imgContainer).toBe("");
    expect(msg).toBe("Invalid or no access to image URL. Try again!");
  });
});

describe("Enter and predict buttons' error messages", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 30,
    });
    page = await browser.newPage();
    await page.goto(app);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("renders a error message on clicking enter with spaces as url input ", async () => {
    await page.click("#url-input");
    await page.type("#url-input", " ");
    await page.click("#enter-btn");
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("Invalid or no access to image URL. Try again!");
  });

  it("renders a error message on clicking enter with no input ", async () => {
    await page.focus("#url-input");
    await page.keyboard.press("End");
    await page.keyboard.press("Backspace");
    await page.click("#enter-btn");
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("Invalid or no access to image URL. Try again!");
  });

  it("renders a error message on clicking predict the same selec image", async () => {
    await page.click("#url-input");
    await page.type("#url-input", testImage1);
    await page.click("#enter-btn");
    await page.click("#predict-btn");
    await page.click("#predict-btn");

    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("You've clicked predict again!");
  });
});
