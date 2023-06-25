const reportButton = document.getElementById("report-post");
reportButton.addEventListener("click", () => {
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
    })
    .catch((error) => {
      console.error(error);
      error.text().then((text) => {
        console.error(text);
      });
    });
});
