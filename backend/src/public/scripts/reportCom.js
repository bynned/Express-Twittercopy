// This script sends a post request to report a comment
// It sends the current req.session.username to the postSchema

const comReportButton = document.getElementById("comreport-post");
const comReportModal = document.getElementById("comreportModal");
const comflagBtn = document.getElementById("comflagBtn");
const comcancelBtn = document.getElementById("comcancelBtn");

comReportButton.addEventListener("click", () => {
  comReportModal.style.display = "block";
});

comcancelBtn.addEventListener("click", () => {
  comReportModal.style.display = "none";
});

comflagBtn.addEventListener("click", () => {
  const commentId = comReportButton.getAttribute("data-commentid");
  const postId = comReportButton.getAttribute("data-postid");

  fetch(`/post/${postId}/${commentId}/report-comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postId, commentId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status} ${response.statusText})`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
      comReportModal.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
      error.text().then((text) => {
        console.error(text);
      });
      comReportModal.style.display = "none";
    });
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });