const likeButton = document.getElementById("like-button");
const dislikeCount = document.querySelector(".dislike-number");
const likeCount = document.querySelector(".like-number");
const dislikeButton = document.getElementById("dislike-button");
let liked = null;
let disliked = null;

likeButton.addEventListener("click", () => {
  const postId = likeButton.getAttribute("data-postid");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `/post/${postId}/like`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 201) {
        const likeCount = document.querySelector(".like-number");
        likeCount.textContent = parseInt(likeCount.textContent) + 1;
        liked = true; // Now it's true that we have liked
        // This is for dynamically taking away the dislike if you decide to like
        if (disliked) {
          const dislikeCount = document.querySelector(".dislike-number");
          dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
        }
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };
  xhr.send();
});


dislikeButton.addEventListener("click", () => {
  const postId = dislikeButton.getAttribute("data-postid");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `/post/${postId}/dislike`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 201) {
        const dislikeCount = document.querySelector(".dislike-number");
        dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
        disliked = true; // Now it's true that we have disliked
        // This is for dynamically taking away the like if you decide to dislike
        if (liked) {
          const likeCount = document.querySelector(".like-number");
          likeCount.textContent = parseInt(likeCount.textContent) - 1;
        }
      } else {
        console.error("Error:", xhr.status);
      }
    }
  };
  xhr.send();
})