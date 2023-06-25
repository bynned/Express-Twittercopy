// This script is for flagging a post
// User can flag posts by pressing the button on the right side of the like button
// Sends a post request to server and adds the current session username to a 'Flagged' array
// in the postSchema.
const reportButton = document.getElementById("report-post");
const modal = document.getElementById("reportModal");
const flagBtn = document.getElementById("flagBtn");
const cancelBtn = document.getElementById("cancelBtn");

reportButton.addEventListener("click", () => {
  modal.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

flagBtn.addEventListener("click", () => {
  const postId = reportButton.getAttribute("data-postid");

  fetch(`/post/${postId}/report-post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
      modal.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
      error.text().then((text) => {
        console.error(text);
      });
      modal.style.display = "none";
    });
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
