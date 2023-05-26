# Express twitter-copy!

The idea is to make a twitter like social media platform!

## How to install:
>Git clone
```
git clone git@github.com:bynned/Express-Twittercopy.git
```
>install dependencies in "backend" dir
```
npm install
```
>create a .env file in "backend" dir containing this information:
```
DATABASE_URL="Your database URL"
SESSION_SECRET=somekey
JWT_SECRET_KEY=somekey

```

After that, (assuming you have mongodb installed) you can:
```
npm run devStart
```

### Note: The docker doesn't work.... i had some issues getting it to work with my database, and i haven't had the energy to fix it.


## Features:
- [x] You can post some text content
- [x] User profile
- [x] You can open other peoples posts and comment on them
- [x] You can check other peoples profiles!

## TODO:
- [x] Like or dislike posts
- [x] Like or dislike comments
- [x] Make the comments and likes and dislikes show on the index page when scrolling posts
- [x] Make the page not refresh everytime i like a post or comment, because now always i end up in the top of the page because it refreshes
- [ ] Comment on comments
- [ ] The ability to like the comments comments
- [ ] Improve the HTTP status codes

## TBD:
- [ ] The possibility to post pictures
- [ ] The possibility to add friends

## Also:

The way the comments are being stored inside the posts is non-optimal...
> This is posts.js Schema
```
const postsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: dateNtime
    },
    comments: [
        {
          username: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          timestamp: {
            type: String,
            default: dateNtime
          },
        },
      ],
});
```

>What im thinking is that if this WAS a large application, it wouldn't be optimal to store the comments of a post inside the postSchema itself. I think MAYBE it would be more optimal to have a own commentsSchema that connects with the postsSchema's ID and the frontend would just GET the post's from the commentsSchema, but im not a professional, if you have any input on this, feel free to contact me.

