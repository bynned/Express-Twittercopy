//Make the modal pop up to ask the user if they are sure they want to delete the channel
var modal = document.getElementById("deleteChannelModal");
var deleteButton = document.querySelector(".delete-channel-button");
var cancelButton = document.getElementById("cancelBtn");

deleteButton.addEventListener("click", function(event) {
    event.preventDefault();

    modal.style.display = "block";
});

cancelButton.addEventListener("click", function() {
    modal.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

var deleteChannelBtn = document.getElementById("deleteChannelBtn");

deleteChannelBtn.addEventListener("click", function() {
    document.querySelector(".delete-channel-form").submit();
});


window.addEventListener("load", function () {
    var div = document.getElementById("Appid");
    div.classList.add("appear");
  });