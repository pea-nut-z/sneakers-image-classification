// enter selected img again (resets result img)
// click predict again when theres a img (retun nothing happens)
// space within url input / space in the start and end of url / space only
// cancel file input when there's a selected image
// clear alll data when selected new image
function toggleLoading() {
  $("#res-msg").empty();
  $("#welcome-gif-container").empty();
  if ($("#progress-msg").is(":empty")) {
    if (firstLoaded) {
      $("#progress-msg").html("Loading model...");
      firstLoaded = false;
    } else {
      $("#progress-msg").html("Loading...");
    }
  } else {
    $("#progress-msg").empty();
  }
  $("#progress-dots").toggleClass("lds-ellipsis");
}

function respond(res) {
  $("#res-msg").empty();
  $("#welcome-gif-container").empty();
  let msg;
  if (res === "upload-complete") msg = "Click predict!";
  if (res === "predict-complete") msg = "See predictions!";
  if (res === "no-prediction-returned") msg = "No similar items were found.";
  // click predict when there's a broken img
  if (res === "broken-url") msg = "Invalid or no access to image URL. Try again!";
  // newImg = false && brokenImg = true (click predict before enter /empty url / broken img)
  if (res === "no-selected-image") msg = "Upload an image first...";
  // newImg = false && brokenImg = false (click predict twice)
  if (res === "broken-file") msg = "Invalid image format.";
  if (res === "double-clicked-predict") msg = "You've clicked predict again!";
  if (res === "predicted-image-error") msg = "There was an error getting the images.";
  $("#res-msg").html(msg);
}

function clearAllData(include) {
  if (include === "selected-image") {
    $("#selected-image-container").empty();
  }
  $("#predicted-images-container").empty();
  $("#percentage-accuracy").empty();
  $(".key").addClass("hide");
  $("#name").empty();
  $("#style").empty();
  $("#release").empty();
}

// PREDICT FUNC
async function analyzeImg() {
  try {
    let image = $("#selected-image").get(0);
    // Pre-process the image
    let tensor = tf.browser
      .fromPixels(image, 3)
      .resizeNearestNeighbor([224, 224]) // change the image size here
      .expandDims()
      .toFloat()
      .reverse(-1);

    let predictions = await model.predict(tensor).data();
    let match = Array.from(predictions)
      .map(function (p, i) {
        // this is Array.map
        return {
          probability: p,
          className: TARGET_CLASSES[i], // we are selecting the value from the obj
        };
      })
      .sort(function (a, b) {
        return b.probability - a.probability;
      })
      .slice(0, 1);

    let item = match[0].className;
    const { tag, name, style, release, images } = item;
    let percentage = match[0].probability.toFixed(2) * 100;

    // catch error msg
    $(".key").removeClass("hide");
    $("#percentage-accuracy").html(`Percentage Accuracy: ${percentage}%`);
    $("#name").html(name);
    $("#style").html(style);
    $("#release").html(release);

    // const path = "https://pea-nut-z.github.io/sneakers-image-classification/";
    const path = "";
    // why not use window?
    // const query = window.location.pathname;
    images.forEach((image) => {
      $("#predicted-images-container").append(
        `<img id="predicted-image" src="${path}${image}" crossorigin='anonymous' alt='' >`
      );
    });

    $("#predicted-image").on("error", function () {
      clearAllData();
      toggleLoading();
      respond("predicted-image-error");
      return;
    });

    console.log("RAN");
    newImg = false;
    toggleLoading();
    respond("predict-complete");

    // Initially images stored in the filesystem directory will be returned when a prediction is made. However, Github does not have static directories set up out of the box. I changed my code to accommodate that.

    // $.ajax({
    //   url: `/public/data/${tag}`,
    //   success: function (data) {
    //     // parse data
    //     //loop over the array
    //     // use window.location to find out what url you are at
    //     $(data)
    //       .find("a")
    //       .attr("href", function (i, val) {
    //         if (val.match(/\.(jpe?g)$/)) {
    //           $("#predicted-images-container").append(
    //             `<img id="predicted-image" src="${val}" crossorigin='anonymous' alt='' >`
    //           );
    //         }
    //       });
    //     toggleLoading();
    //     respond("predict-complete");
    //   },
    //   error: function () {
    //     clearAllData();
    //     toggleLoading();
    //     respond("predict-error");
    //   },
    // });
  } catch {
    toggleLoading();
    respond("no-prediction-returned");
  }
}
async function setLayout() {
  toggleLoading();
  try {
    model = await tf.loadGraphModel("model/model.json");
  } catch {
    console.log("Model did not get loaded");
  }
  toggleLoading();
  $("#welcome-gif-container").append(
    '<img id="welcome-gif" src="public/images/welcome.gif" crossorigin="anonymous" alt="" >'
  );
}

async function uploadFile() {
  $("#file-selector").on("change", function (event) {
    let selected = this.files.length;
    if (selected) {
      toggleLoading();
      clearAllData("selected-image");
      const path = URL.createObjectURL(event.target.files[0]);
      $("#selected-image-container").append(
        `<img id="selected-image" src="${path}" crossorigin="anonymous" alt="">`
      );
    } else {
      return;
    }
    toggleLoading();
    $("#selected-image").on("load", function () {
      respond("upload-complete");
      brokenImg = false;
      newImg = true;
    });
    $("#selected-image").on("error", function () {
      respond("broken-file");
    });
  });
}

function toggleEnterButton() {
  $("#url-input").on("input", function () {
    let input = $("#url-input").val();
    if (input) {
      $("#enter-btn").prop("disabled", false);
    } else {
      $("#enter-btn").prop("disabled", true);
    }
  });
}

function togglePredictButton() {
  $("#selected-image-container").on("DOMSubtreeModified", function () {
    let image = $("#selected-image-container").is(":empty");
    if (!image) {
      $("#predict-btn").prop("disabled", false);
    }
  });
}

function onEnter() {
  $("#enter-btn").on("click", function () {
    let path = $("#url-input").val();
    if (path.includes(" ") || !path) {
      respond("broken-url");
      return;
    }

    $("#enter-btn").html("👌");
    toggleLoading();
    clearAllData("selected-image");

    setTimeout(() => {
      $("#enter-btn").html("Enter");
    }, 1000);

    $("#selected-image-container").append(
      `<img id="selected-image" src="${path}" crossorigin="anonymous" alt="">`
    );
    toggleLoading();
    $("#selected-image").on("load", function () {
      respond("upload-complete");
      brokenImg = false;
      newImg = true;
    });
    $("#selected-image").on("error", function () {
      clearAllData("selected-image");
      respond("broken-url");
    });
  });
}

function onPredict() {
  $("#predict-btn").click(function () {
    if (!brokenImg && newImg) {
      $("#predict-btn").html("👌");
      toggleLoading();
      setTimeout(() => {
        $("#predict-btn").html("Predict");
      }, 500);

      setTimeout(() => {
        analyzeImg();
      }, 50);
    } else if (!newImg && !brokenImg) {
      respond("double-clicked-predict");
    } else {
      respond("no-selected-image");
    }
  });
}

let firstLoaded = true;
let brokenImg = true;
let newImg = false;
let model;

// ON FIRST LOADED
setLayout();

// ON LOCAL FILE UPLOAD
uploadFile();

// LISTEN TO INPUT TO TOGGLE ENTER BUTTON
toggleEnterButton();

// LISTEN TO IMAGE UPLOAD TO TOGGLE PREDICT BUTTON
togglePredictButton();

// ON ENTER
onEnter();

// ON PREDICT
onPredict();

// module.exports.setLayout = setLayout;
// module.exports.uploadFile = uploadFile;
// module.exports.toggleEnterButton = toggleEnterButton;
// module.exports.togglePredictButton = togglePredictButton;
// module.exports.respond = respond;
// module.exports.clearAllData = clearAllData;

module.exports = {
  setLayout,
  uploadFile,
  toggleEnterButton,
  togglePredictButton,
  onEnter,
  onPredict,
  toggleLoading,
  respond,
  clearAllData,
  analyzeImg,
};
