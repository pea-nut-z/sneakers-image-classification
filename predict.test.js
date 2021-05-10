const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
window.$ = require("jquery");

jest.dontMock("fs");
describe("Initial layout", () => {
  const predict = require("./predict");
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it("renders enter and predict buttons as disabled", async () => {
    expect($("#enter-btn").prop("disabled")).toBe(true);
    expect($("#predict-btn").prop("disabled")).toBe(true);
  });

  it("hides labels for an image's details if an image has not been rendered - name, style and date", () => {
    expect($(".key").hasClass("hide")).toBe(true);
  });
  it("hides the input for user to upload file from local storage", () => {
    expect($("#file-selector").hasClass("hide")).toBe(true);
  });
});
