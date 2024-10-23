# yelp-camp

Fullstack campgrounds application with database and authentication.
Using EJS/Typescript, Sass, Node/Express and MongoDB/mongoose

Based on online course project, with extensions:

## Code improvements

- Typescript (see `seed.ts` and dtos folder)
- Comments (see `seed.ts` and routes folder)

## Animations and transitions

https://github.com/user-attachments/assets/71d2b3f7-5bb0-49c0-b9f1-c015daaa7bab

https://github.com/user-attachments/assets/8108cf0d-c322-4d52-bad4-f79dfd81d97b

## New color theme, icons and layout

<img width="640" alt="Campgrounds" src="https://github.com/user-attachments/assets/1f518a17-1ee6-4265-b7fe-8de395cf1181">

<img width="640" alt="Campground-comments" src="https://github.com/user-attachments/assets/92532f53-1031-4ed7-82e7-54113faaf970">

## Google maps api

<img width="640" alt="Campground-edit" src="https://github.com/user-attachments/assets/a8ec3d7d-0c5b-48cb-8ce4-ad0b8f1c843d">

<img width="640" alt="Campground-map" src="https://github.com/user-attachments/assets/dd9b516d-52e0-4012-a575-f4686c4ce1c8">

### Setup

Env vars:

- `DATABASE_URL` (from MongoDB Atlas)
- `GEOCODER_API_KEY` (from Google Maps)
- `GOOGLE_MAPS_API_KEY` (from Google Maps)
- `PORT` (4 digits)
- `PASSPORT_SECRET` (string)

Optional:

- Uncomment `seedDB()` in `app.ts` to empty exisiting database and fill in some dummy data
- Comment out again after running start script, to avoid accidently emptying the database again

Start up locally: `npm run start:dev`
