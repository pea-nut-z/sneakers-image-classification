let firstLoaded = true;
let brokenImg = true;
let newImg = false;
let model;

// LOADING MESSAGE
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
// ERROR AND NOTIFICATION MESSAGES
function respond(res) {
  $("#res-msg").empty();
  $("#welcome-gif-container").empty();
  let msg;
  if (res === "upload-complete") msg = "Click predict!";
  if (res === "predict-complete") msg = "See prediction!";
  if (res === "broken-url") msg = "Invalid or no access to image URL. Try again!";
  if (res === "broken-file") msg = "Invalid image format.";
  if (res === "model-error") msg = "Model is not loaded.";
  if (res === "prediction-error") msg = "Something went wrong during prediction.";
  // other unknown edge cases for clicking predict button
  if (res === "error") msg = "There is an error.";
  $("#res-msg").html(msg);
}
// CLEAR ITEM INFORMATION
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
// PREDICT FUNCTION
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
        return {
          probability: p,
          className: TARGET_CLASSES[i],
        };
      })
      .sort(function (a, b) {
        return b.probability - a.probability;
      })
      .slice(0, 1);

    let item = match[0].className;
    const { tag, name, style, release, images } = item;
    let percentage = match[0].probability.toFixed(2) * 100;

    $(".key").removeClass("hide");
    $("#percentage-accuracy").html(`Percentage Accuracy: ${percentage}%`);
    $("#name").html(name);
    $("#style").html(style);
    $("#release").html(release);

    const path = "https://pea-nut-z.github.io/sneakers-image-classification";

    images.forEach((image) => {
      $("#predicted-images-container").append(
        `<img id="predicted-image" src="${path}${image}" crossorigin='anonymous' alt='' >`
      );
    });

    toggleLoading();
    $("#predicted-image").on("load", function () {
      newImg = false;
      respond("predict-complete");
    });

    // Initially images stored in the filesystem directory will be
    // returned when a prediction is made.However, Github does not
    // have static directories set up out of the box.I changed my
    // code to accommodate that.

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
    respond("prediction-error");
  }
}
// ON FIRST LOADED
async function setLayout(test) {
  let path = ".";
  toggleLoading();
  try {
    if (test === "model") {
      // SETTING THE PATH DIFFERENTLY FOR TESTING PURPOSES
      // COULD USE .ENV AND SOME CONFIGS ON CLIENT SIDE BUT THIS WAY IS MUCH SIMPLER FOR A SMALL TEST
      path = "https://pea-nut-z.github.io/sneakers-image-classification";
      model = await tf.loadGraphModel(`${path}/model/model.json`);
    } else if (test === "error") {
      throw error;
    } else {
      model = await tf.loadGraphModel("model/model.json");
    }
    toggleLoading();
    $("#welcome-gif-container").append(
      `<img id="welcome-gif" src="${path}/public/images/welcome.gif" crossorigin="anonymous" alt="" >`
    );
    $("#url-input").prop("disabled", false);
    $("#file-selector").prop("disabled", false);
  } catch {
    toggleLoading();
    respond("model-error");
    $("#url-input").prop("disabled", true);
    $("#file-selector").prop("disabled", true);
  }
}
// ON LOCAL FILE UPLOAD
async function uploadFile() {
  $("#upload-btn").on("click", function () {
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
        $("#predict-btn").prop("disabled", true);
        clearAllData("selected-image");
        respond("broken-file");
      });
    });
  });
}
// LISTEN TO INPUT TO TOGGLE ENTER BUTTON
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
// LISTEN TO IMAGE UPLOAD TO TOGGLE PREDICT BUTTON
function togglePredictButton() {
  $("#selected-image-container").on("DOMSubtreeModified", function () {
    let empty = $("#selected-image-container").is(":empty");
    if (!empty) {
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
      $("#url-input").val("");
      respond("upload-complete");
      brokenImg = false;
      newImg = true;
    });
    $("#selected-image").on("error", function () {
      $("#predict-btn").prop("disabled", true);
      clearAllData("selected-image");
      respond("broken-url");
    });
  });
}

function onPredict() {
  // PASSING "test" ARGUMENT FOR TESTING PURPOSES
  // COULD USE .ENV AND SOME CONFIGS ON CLIENT SIDE BUT THIS WAY IS MUCH SIMPLER FOR A SMALL TEST
  $("#predict-btn").click(function () {
    if (!brokenImg && newImg) {
      $("#predict-btn").prop("disabled", true);
      $("#predict-btn").html("👌");
      toggleLoading();
      setTimeout(() => {
        $("#predict-btn").html("Predict");
      }, 500);

      setTimeout(() => {
        analyzeImg();
      }, 50);
    } else {
      respond("error");
    }
  });
}

setLayout();
uploadFile();
toggleEnterButton();
togglePredictButton();
onEnter();
onPredict();
