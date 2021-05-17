import puppeteer from "puppeteer";
import * as pti from "puppeteer-to-istanbul";

const githubPath = "https://pea-nut-z.github.io/sneakers-image-classification";
const app = `${githubPath}/index.html`;
const testImage1 = `${githubPath}/public/data/beluga/Beluga2.0-1.jpeg`;
const testImage2 = `${githubPath}/public/data/blue-tint/Blue-Tint-1.jpeg`;
const brokenImage = "https://pea-nut-z.github.io.jpeg";
let browser, page;

describe("Prediction Model is not loaded", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 20,
    });
    page = await browser.newPage();
    await page.coverage.startJSCoverage();
    await page.goto(app);
    jest.setTimeout(30000);
    // SET MODEL TO NOT BE LOADED
    await page.evaluate(() => setLayout("error"));
  });

  it("renders an error message, and disables upload button and input box", async () => {
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    let inputIsDisabled = await page.$eval("#url-input", (input) => {
      return input.disabled;
    });
    let fileSelectorIsDisabled = await page.$eval("#file-selector", (button) => {
      return button.disabled;
    });
    expect(msg).toBe("Model is not loaded.");
    expect(inputIsDisabled).toBe(true);
    expect(fileSelectorIsDisabled).toBe(true);
  });
});

describe("Initial layout", () => {
  beforeAll(async () => {
    // SET MODEL TO BE LOADED
    await page.evaluate(() => setLayout("model"));
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
    await page.waitForSelector("#welcome-gif", { visible: true });
    const container = await page.$eval("#welcome-gif-container", (container) => {
      return container.innerHTML;
    });
    expect(container).toContain(
      `<img id="welcome-gif" src="${githubPath}/public/images/welcome.gif" crossorigin="anonymous" alt="">`
    );
  });
});

describe("Enter and predict buttons do toggle", () => {
  it("enables enter button when there is an input", async () => {
    await page.type("#url-input", " ");
    let enterBtnisDisabled = await page.$eval("#enter-btn", (button) => {
      return button.disabled;
    });
    expect(enterBtnisDisabled).toBe(false);
  });

  it("enables predict button when a selected image is uploaded successfully", async () => {
    await page.keyboard.press("Backspace");
    await page.type("#url-input", testImage1);
    await page.click("#enter-btn");
    let isDisabled = await page.$eval("#predict-btn", (button) => {
      return button.disabled;
    });
    expect(isDisabled).toBe(false);
  });
});

describe("A successful image url upload with prediction returned", () => {
  it("renders a hand emoji on enter button when uploading is trigged", async () => {
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

  it("renders a message: 'See prediction!' after clicking predict and a prediction is returned", async () => {
    await page.click("#predict-btn");
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("See prediction!");
  });

  it("renders four predicted images", async () => {
    let count = await page.$$eval("#predicted-image", (element) => element.length);
    expect(count).toBe(4);
  });

  it("renders an accurate prediction", async () => {
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
    expect(percentage).toBeTruthy();
    expect(name).toBe("Adidas Yeezy Boost 350 V2 Beluga 2.0");
    expect(style).toBe("AH2203");
    expect(release).toBe("11/25/2017");
    expect(imgSrc).toMatch("beluga");
  });
});

describe("File upload from local storage", () => {
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

  it("(needs a path to a file in current computer to pass) uploads a non-image file - renders a error message and removes broken image tag", async () => {
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

describe("Upload an image when data from previous image is still present", () => {
  it("displays the new image and removes previous image's data", async () => {
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

describe("An unsuccessful image url upload ", () => {
  it("renders an error message and removes broken selected image when a broken image is uploaded", async () => {
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
  afterAll(async () => {
    const [jsCoverage] = await Promise.all([page.coverage.stopJSCoverage()]);
    pti.write([...jsCoverage]);
    await browser.close();
  });

  it("renders an error message on clicking enter with spaces as url input ", async () => {
    await page.$eval("#url-input", (el) => el.setSelectionRange(0, el.value.length));
    await page.keyboard.press("Backspace");
    await page.type("#url-input", " ");
    await page.click("#enter-btn");
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("Invalid or no access to image URL. Try again!");
  });

  it("renders an error message on clicking enter with no input ", async () => {
    await page.focus("#url-input");
    await page.keyboard.press("Backspace");
    await page.click("#enter-btn");
    let msg = await page.$eval("#res-msg", (container) => {
      return container.innerHTML;
    });
    expect(msg).toBe("Invalid or no access to image URL. Try again!");
  });
});
