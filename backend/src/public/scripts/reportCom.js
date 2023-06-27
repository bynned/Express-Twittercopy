// This script sends a post request to report a comment
// It sends the current req.session.username to the postSchema
const comReportButtons = document.getElementsByClassName("comreport-post");

Array.from(comReportButtons).forEach((button) => {
  button.addEventListener("click", () => {
    const commentId = button.getAttribute("data-commentid");
    const postId = button.getAttribute("data-postid");
    const comReportModal = document.getElementById(`comreportModal-${commentId}`);
    const comflagBtn = comReportModal.querySelector("#comflagBtn");
    const comcancelBtn = comReportModal.querySelector("#comcancelBtn");

    comReportModal.style.display = "block";

    comcancelBtn.addEventListener("click", () => {
      comReportModal.style.display = "none";
    });

    comflagBtn.addEventListener("click", () => {
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
  });
});

window.addEventListener("click", (event) => {
  if (event.target.className === "modal") {
    event.target.style.display = "none";
  }
});
