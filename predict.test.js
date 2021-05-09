const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
window.$ = require("jquery");
// window.tf = require("@tensorflow/tfjs-node");
// require("@tensorflow/tfjs-node");
// require("fast-text-encoding");
// import * as tf from "@tensorflow/tfjs-node";

jest.dontMock("fs");
describe("Initial layout", () => {
  const predict = require("./predict");
  // predict.setLayout();
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
  });

  afterAll(() => {
    jest.resetModules();
  });

  it("renders enter and predict buttons as disabled", async () => {
    // setLayout();
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

describe("Enter and predict buttons", () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
    // const predict = require("./predict");
  });

  afterAll(() => {
    jest.resetModules();
  });
  it("returns error message", () => {
    const $ = require("jquery");
    require("./predict");
    $("#url-input").val(" ");
    $("#enter-btn").on("click");
    expect($("#res-msg").text()).toEqual("Invalid or no access to image URL. Try again!");
  });
});
