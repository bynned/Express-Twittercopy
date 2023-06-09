window.addEventListener("load", function () {
  var div = document.getElementById("Appid");
  div.classList.add("appear");
});

document.addEventListener("DOMContentLoaded", function () {
  var searchPostButton = document.getElementById("searchPostButton");
  var searchPostContainer = document.getElementById("searchPostContainer");

  searchPostButton.addEventListener("click", function () {
    if (searchPostContainer.style.display === "block") {
      searchPostContainer.style.display = "none";
    } else {
      searchPostContainer.style.display = "block";
    }
  });
});
