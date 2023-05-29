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

        var channelNameInput = document.querySelector('input[name="channelName"]');
        var channelName = channelNameInput.value.trim();

        if (channelName) {
            fetch('/channels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ channelName: channelName })
            })
            .then(function(response) {
                if (response.ok) {
                    console.log('Channel created');
                    channelNameInput.value = '';
                    createChannelFormContainer.style.display = 'none';
                } else {
                    console.error("Failed to create channel");
                }
            })
            .catch(function(error) {
                console.error('Error creating channel: ', error);
            });
        }
    });
});