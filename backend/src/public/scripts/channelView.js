window.addEventListener("load", function () {
    var div = document.getElementById("Appid");
    div.classList.add("appear");
  });

document.addEventListener('DOMContentLoaded', function() {
    var createChannelButton = document.getElementById('createChannelButton');
    var createChannelFormContainer = document.getElementById('createChannelFormContainer');
    var createChannelForm = document.getElementById('createChannelForm');

    createChannelButton.addEventListener('click', function() {
        createChannelFormContainer.style.display = 'block';
    });

    createChannelForm.addEventListener('submit', function(event) {
        event.preventDefault();
    })
})