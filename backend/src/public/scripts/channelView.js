window.addEventListener("load", function () {
  var div = document.getElementById("Appid");
  div.classList.add("appear");
});

document.addEventListener("DOMContentLoaded", function () {
  var createChannelButton = document.getElementById("createChannelButton");
  var createChannelFormContainer = document.getElementById(
    "createChannelFormContainer"
  );
  var enterChannelKeyButton = document.getElementById("enterChannelKeyButton");
  var enterChannelKeyContainer = document.getElementById(
    "enterChannelKeyContainer"
  );

  createChannelButton.addEventListener("click", function () {
    createChannelFormContainer.style.display = "block";
    enterChannelKeyContainer.style.display = "none";
  });

  enterChannelKeyButton.addEventListener("click", function () {
    enterChannelKeyContainer.style.display = "block";
    createChannelFormContainer.style.display = "none";
  });
});
