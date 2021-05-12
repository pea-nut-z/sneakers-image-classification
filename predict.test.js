import puppeteer from "puppeteer";

let browser, page;
const app = "file:/Users/paulinez/image-classification/web/index.html";
const testImage =
  "https://pea-nut-z.github.io/sneakers-image-classification/public/data/beluga/Beluga2.0-1.jpeg";
const brokenImage = "https://pea-nut-z.github.io.jpeg";

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
      '<img id="welcome-gif" src="public/images/welcome.gif" crossorigin="anonymous" alt="">'
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
    await page.type("#url-input", testImage);
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
      headless: false,
      slowMo: 20,
    });
    page = await browser.newPage();
    await page.goto(app);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("renders a hand emoji on enter button when uploading is trigged", async () => {
    jest.setTimeout(30000);
    await page.click("#url-input");
    await page.type("#url-input", testImage);
    await page.click("#enter-btn");
    let enterBtn = await page.$eval("#enter-btn", (button) => {
      return button.innerHTML;
    });
    expect(enterBtn).toContain("👌");
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

  it("renders a hand emoji on predict button when predicting is trigged", async () => {
    await page.click("#predict-btn");
    let predictBtn = await page.$eval("#predict-btn", (button) => {
      return button.innerHTML;
    });
    expect(predictBtn).toContain("👌");
  });

  // TENSORFLOW NOT LOADING THE MODEL? NO PREDICTED IMGS WERE FOUND.
  // CHECK FOR "SEE PREDICTIONS"
  // WILL FIGURE THIS OUT
  // it("renders four predicted images successfully", async () => {
  //   let numberOfImages = await page.waitForSelector("#predicted-image", (element) => element.length);
  //   expect(numberOfImages).toBe(4);
  // });
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

describe("Enter and predict error messages", () => {
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

  //   it("renders a error message on clicking predict twice on the same selected image", async () => {
  //  // NEEDS TO RENDER PREDICTED IMAGES FIRST
  //   });
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
