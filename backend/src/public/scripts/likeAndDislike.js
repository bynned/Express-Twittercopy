/*************************************************************************************************************************
 *************************************************************************************************************************
****************************** For dynamically changing the like and dislike amounts on the posts with AJAX***************
**************************************************************************************************************************
*************************************************************************************************************************/

const likeButton = document.getElementById("like-button");
const dislikeCount = document.querySelector(".dislike-number");
const likeCount = document.querySelector(".like-number");
const dislikeButton = document.getElementById("dislike-button");
let liked = null;
let disliked = null;

likeButton.addEventListener("click", () => {
  const postId = likeButton.getAttribute("data-postid");

  // Send a GET request to check if the user has liked/disliked the post before
  const xhrGet = new XMLHttpRequest();
  xhrGet.open("GET", `/post/${postId}/like`, true);
  xhrGet.onreadystatechange = function () {
    if (xhrGet.readyState === XMLHttpRequest.DONE) {
      if (xhrGet.status === 200) {
        const response = JSON.parse(xhrGet.responseText);
        // hasLiked and hasDisliked are boolean values from the server
        const hasLiked = response.hasLiked;
        const hasDisliked = response.hasDisliked;

        if (hasLiked) {
          // if you already liked the post
          console.log("You already liked this post");
          return;
        } else if (hasDisliked) {
          // If you had earlier disliked the post and decided to like it,
          // it will take your dislike away.
          const dislikeCount = document.querySelector(".dislike-number");
          dislikeCount.textContent = parseInt(dislikeCount.textContent) - 1;
        }
        const xhrPost = new XMLHttpRequest();
        // Post to the server the like
        xhrPost.open("POST", `/post/${postId}/like`, true);
        xhrPost.setRequestHeader("Content-Type", "application/json");
        xhrPost.onreadystatechange = function () {
          if (xhrPost.readyState === XMLHttpRequest.DONE) {
            if (xhrPost.status === 201) {
              // Add +1 to the likes
              const likeCount = document.querySelector(".like-number");
              likeCount.textContent = parseInt(likeCount.textContent) + 1;
            } else {
              console.error("Error:", xhrPost.status);
            }
          }
        };
        xhrPost.send();
      } else {
        console.error("Error:", xhrGet.status);
      }
    }
  };
  xhrGet.send();
});

// This literally is a copy paste from the likebutton from above.
dislikeButton.addEventListener("click", () => {
    const postId = dislikeButton.getAttribute("data-postid");

    // Send a GET request to check if the user has liked/disliked the post before
    const xhrGet = new XMLHttpRequest();
    xhrGet.open("GET", `/post/${postId}/like`, true);
    xhrGet.onreadystatechange = function () {
      if (xhrGet.readyState === XMLHttpRequest.DONE) {
        if (xhrGet.status === 200) {
          const response = JSON.parse(xhrGet.responseText);
          const hasLiked = response.hasLiked;
          const hasDisliked = response.hasDisliked;

          if (hasDisliked) {
            console.log("You already disliked this post");
            return;
          } else if (hasLiked) {
            const likeCount = document.querySelector(".like-number");
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
          }
          const xhrPost = new XMLHttpRequest();
          xhrPost.open("POST", `/post/${postId}/dislike`, true);
          xhrPost.setRequestHeader("Content-Type", "application/json");
          xhrPost.onreadystatechange = function () {
            if (xhrPost.readyState === XMLHttpRequest.DONE) {
              if (xhrPost.status === 201) {
                const dislikeCount = document.querySelector(".dislike-number");
                dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
              } else {
                console.error("Error:", xhrPost.status);
              }
            }
          };
          xhrPost.send();
        } else {
          console.error("Error:", xhrGet.status);
        }
      }
    };
    xhrGet.send();
  });

/*************************************************************************************************************************
 *************************************************************************************************************************
 ***************************DYNAMICALLY CHANGING THE AMOUNT OF LIKES ON COMMENTS USING AJAX*******************************
 ************************************************************************************************************************/


const comlikeButton = document.getElementById("comlike-button");
const comdislikeCount = document.querySelector(".comdislike-number");
const comlikeCount = document.querySelector(".comlike-number");
const comdislikeButton = document.getElementById("comdislike-button");

comlikeButton.addEventListener("click", () => {
  const commentId = comlikeButton.getAttribute("data-commentid");
  const postId = likeButton.getAttribute("data-postid");

  // Send a GET request to check if the user has liked/disliked the comment before
  const xhrGet = new XMLHttpRequest();
  xhrGet.open("GET", `/post/${postId}/${commentId}/like`, true);
  xhrGet.onreadystatechange = function () {
    if (xhrGet.readyState === XMLHttpRequest.DONE) {
      if (xhrGet.status === 200) {
        const response = JSON.parse(xhrGet.responseText);
        // comhasLiked and comhasDisliked are boolean values from the server
        const comhasLiked = response.comhasLiked;
        const comhasDisliked = response.comhasDisliked;

        if (comhasLiked) {
          // if you already liked the comment
          console.log("You already liked this comment");
          return;
        } else if (comhasDisliked) {
          // If you had earlier disliked the comment and decided to like it,
          // it will take your dislike away.
          const comdislikeCount = document.querySelector(".comdislike-number");
          comdislikeCount.textContent = parseInt(comdislikeCount.textContent) - 1;
        }
        const xhrPost = new XMLHttpRequest();
        // Post to the server the like
        xhrPost.open("POST", `/post/${postId}/${commentId}/like`, true);
        xhrPost.setRequestHeader("Content-Type", "application/json");
        xhrPost.onreadystatechange = function () {
          if (xhrPost.readyState === XMLHttpRequest.DONE) {
            if (xhrPost.status === 201) {
              // Add +1 to the likes
              const comlikeCount = document.querySelector(".comlike-number");
              comlikeCount.textContent = parseInt(comlikeCount.textContent) + 1;
            } else {
              console.error("Error:", xhrPost.status);
            }
          }
        };
        xhrPost.send();
      } else {
        console.error("Error:", xhrGet.status);
      }
    }
  };
  xhrGet.send();
});

// This literally is a copy paste from above.
comdislikeButton.addEventListener("click", () => {
    const commentId = comdislikeButton.getAttribute("data-commentid");
    const postId = dislikeButton.getAttribute("data-postid");

    // Send a GET request to check if the user has liked/disliked the comment before
    const xhrGet = new XMLHttpRequest();
    xhrGet.open("GET", `/post/${postId}/${commentId}/like`, true);
    xhrGet.onreadystatechange = function () {
      if (xhrGet.readyState === XMLHttpRequest.DONE) {
        if (xhrGet.status === 200) {
          const response = JSON.parse(xhrGet.responseText);
          const comhasLiked = response.comhasLiked;
          const comhasDisliked = response.comhasDisliked;

          if (comhasDisliked) {
            console.log("You already disliked this post");
            return;
          } else if (comhasLiked) {
            const comlikeCount = document.querySelector(".comlike-number");
            comlikeCount.textContent = parseInt(comlikeCount.textContent) - 1;
          }
          const xhrPost = new XMLHttpRequest();
          xhrPost.open("POST", `/post/${postId}/${commentId}/dislike`, true);
          xhrPost.setRequestHeader("Content-Type", "application/json");
          xhrPost.onreadystatechange = function () {
            if (xhrPost.readyState === XMLHttpRequest.DONE) {
              if (xhrPost.status === 201) {
                const comdislikeCount = document.querySelector(".comdislike-number");
                comdislikeCount.textContent = parseInt(comdislikeCount.textContent) + 1;
              } else {
                console.error("Error:", xhrPost.status);
              }
            }
          };
          xhrPost.send();
        } else {
          console.error("Error:", xhrGet.status);
        }
      }
    };
    xhrGet.send();
  });