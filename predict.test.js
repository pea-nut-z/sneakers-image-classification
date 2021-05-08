const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf8");
window.$ = require("./node_modules/jquery/dist/jquery.js");
// window.tf = require("@tensorflow/tfjs-node");
// require("@tensorflow/tfjs-node");
// require("fast-text-encoding");
import * as tf from "@tensorflow/tfjs-node";

jest.dontMock("fs");
// const tf = jest.fn();
describe("Respond Messages", () => {
  beforeAll(() => {
    document.documentElement.innerHTML = html.toString();
    require("./predict");
  });

  afterAll(() => {
    jest.resetModules();
  });

  it.only("clicks enter on invalid url input", async function () {
    // const $ = require("jquery");
    // const test = predict.setLayout();
    // await test;
    // console.log(document.documentElement.innerHTML);

    // $("#url-input").value = "./public/data/arzaerth/Arzaerth-1.jpeg";
    // $("#enter-btn").trigger("click");
    // expect($("#enter-btn").text()).toEqual("👌");

    // expect($("#res-msg").text()).toEqual("Invalid or no access to image URL. Try again!");
    await console.log(document.documentElement.innerHTML);
  });

  it("clicks enter on empty spaces within url as input", function () {
    $("#url-input").value = " ";
    $("#enter-btn").trigger("click");
    expect($("#res-msg").text()).toEqual("Invalid or no access to image URL. Try again!");
  });

  it("clicks enter on valid url input", function () {
    // const image = require("./public/data/arzaerth/Arzaerth-1.jpeg");
    // console.log({ image });
    // $("#url-input").value =
    // "data:image/jpeg;base64,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";
    $("#url-input").value = "./public/data/arzaerth/Arzaerth-1.jpeg";
    $("#enter-btn").trigger("click");
    expect($("#res-msg").text()).toEqual("");

    // expect($("#predict-btn")).toHaveAttribute("disabled");
    // expect($("#wel")).toBeTruthy();
  });

  // it("clicks predict on empty spaces within url as input", function () {
  //   $("#url-input").value = " ";
  //   $("#enter-btn").trigger("click");
  //   expect($("#res-msg").text()).toEqual("Invalid or no access to image URL. Try again!");
  // });
});
