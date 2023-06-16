![logo png](https://github.com/bynned/HushHub/assets/99414068/f5242a06-bfe1-466d-9811-4a48b5231592)

Through HushHub, teachers can create dedicated channels for their courses, while students have the freedom to join these channels and seek answers anonymously from their peers and the teacher, who remains incognito as well. This platform acts as a stepping stone towards better questioning practices, promoting an environment where curiosity flourishes without fear.

No longer shall students feel alone or isolated, HushHub enables them to express their inquiries without the weight of judgment. It provides a new realm of possibility, where individuals suffering from the fear of asking questions can find solace and embrace knowledge with confidence.

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
>After that, (assuming you have mongodb installed) you can:
```
npm run devStart
```

## Getting started

The features of HushHub include
  - Creating channels where you can anonymously post
  - Joining other channels via channelkey
  - Own personal profile, where you can see your posts and created channels
  - Liking or disliking posts
  - Comment on posts
  - Like or dislike comments





