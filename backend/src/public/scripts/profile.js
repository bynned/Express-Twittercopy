//Make the modal pop up to ask the user if they are sure they want to delete the channel
const deleteChannelButtons = document.querySelectorAll('.delete-channel-button');

deleteChannelButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const channelID = button.getAttribute('data-channelid');

    const deleteChannelModal = document.getElementById(`deleteChannelModal-${channelID}`);

    deleteChannelModal.style.display = 'block';

    const deleteButton = deleteChannelModal.querySelector('#deleteChannelBtn');

    deleteButton.addEventListener('click', () => {
      const deleteChannelForm = button.parentNode;
      deleteChannelForm.submit();
    });

    const cancelButton = deleteChannelModal.querySelector('#cancelBtn');

    cancelButton.addEventListener('click', () => {
      deleteChannelModal.style.display = 'none';
    });
  });
});


/*
  deleteChannelBtn.addEventListener("click", function() {
    var deleteChannelForm = modal.querySelector(".delete-channel-form");
    deleteChannelForm.submit();
  });
});
*/
// Make the page appear on load
window.addEventListener("load", function () {
    var div = document.getElementById("Appid");
    div.classList.add("appear");
  });