// Make the modal pop up when the user wants to delete a flagged comment
const deleteCommentButtons = document.querySelectorAll('.delete-comment-button');

deleteCommentButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        const commentID = button.getAttribute('data-commentid');

        const deleteCommentModal = document.getElementById(`deleteCommentModal-${commentID}`);

        deleteCommentModal.style.display = 'block';

        const deleteButton = deleteCommentModal.querySelector('#deleteCommentBtn');

        deleteButton.addEventListener('click', () => {
            const deleteCommentForm = button.parentNode;
            deleteCommentForm.submit();
        });

        const cancelButton = deleteCommentModal.querySelector('#cancelBtn');

        cancelButton.addEventListener('click', () => {
            deleteCommentModal.style.display = 'none';
        });
    });
});



window.addEventListener("load", function () {
    var div = document.getElementById("Appid");
    div.classList.add("appear");
  });