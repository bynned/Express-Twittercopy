![logo png](https://github.com/bynned/HushHub/assets/99414068/f5242a06-bfe1-466d-9811-4a48b5231592)

HushHub is a game-changing platform that transforms the learning experience for students and teachers. It allows teachers to create dedicated channels for their courses, while enabling students to join anonymously and seek answers from both their peers and the teacher, who remains incognito.

With HushHub, students no longer have to feel alone or judged when asking questions. They can freely express their inquiries and embrace knowledge with confidence, knowing that their anonymity is protected.

This platform creates a safe space where curiosity flourishes and fosters better questioning practices. It breaks down barriers and encourages active participation, empowering students to explore and learn without fear.

HushHub is a step forward in promoting a positive learning environment, where both students and teachers can engage in meaningful dialogue and uncover new depths of understanding.

## How to install:
>Git clone
```
git clone git@github.com:bynned/HushHub.git
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
>create "images" folder in /routes where the uploaded images will be stored.
<br />

>After that, (assuming you have mongodb installed) you can:
```
npm run devStart
```

## Getting started

The features of HushHub include
  - Creating channels where you can anonymously post
  - Joining other channels via channelkey
  - Own personal profile, where you can see your posts and created channels
  - The ability to moderate your created channel
  - Liking or disliking posts
  - Comment on posts
  - Like or dislike comments
  - Post pictures
  - Flag posts or comments for the channel admin to check
  - The channel admin can now delete a flagged comment or a post from the moderation page





