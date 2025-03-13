# Welcome to My Instagram
***

## Task
The goal is to create a fully functional Instagram-like platform where users can create their accounts, login, share posts, interact with others, manage their profiles, and explore content.

## Description
This project is a feature clone of Instagram, built using ReactJS for the frontend and AWS Amplify for backend services and database storage. The goal is to create a social media platform with functionality similar to Instagram while allowing creative freedom in design.
which involved: Frontend: ReactJS, Backend & Database: AWS Amplify, Authentication: Amazon Cognito User Pool, Storage: AWS S3 (for media uploads) 
Styling: Bootstrap for a UI that closely resembles Instagram
The major features are:
-Authentication: User signup & login, Password reset functionality, Username availability check during signup and Toggle account type.
Profile Management: Edit profile (username, bio, social links, tags), Change profile picture, Follow/unfollow users, View profile 
Posting & Interactions: Create posts with text, images (with filters), videos, audio, links, documents, and locations.
Like, comment (text, image, sticker), share, unshare, copy post link, Delete and edit posts, Posts displayed with time-ago format
Search users, hashtags, groups, media.
Suggested users to follow and Unfollow.
UI/UX Enhancements: Custom video & audio player

## Installation
clone the repository: git clone https://git.us.qwasar.io/my_instagram_180120_flsx6t/my_instagram.git
cd my-instagram-clone, run npx create-react-app . to initialize the react app for the front end, run npm install to install the required dependencies: npm install aws-amplify @aws-amplify/ui-react,npm install react-icons, initialize the amplify to the backend by running amplify configure
amplify init, then run amplify add api, amplify add auth and amplify add storage for user authentication, database and storage, then run amplify push to update the changes.


## Usage
The project Structure is:
src/
│
├─ components/  
│   ├─ Navigation/
│   	├─ SideBar/
│ 	├─ SearchBar/
│   └─ timeline/
│		├─ PostPage/
│		├─ ProfilePage/
│		├─ Timeline/
├─ Home.js
│   
│
├─ services/
│   ├─ auth.js
│   ├─ api.js
│   └─ storage.js
│
├─ assets/
│   ├─ images/
│   ├─ icons/
│   └─ avatars/
│
└─ App.js
└─ index.js
└─ App.css
CSS and Component guidelines:
Each component resides in its own file under src/components/
Corresponding CSS files must follow the naming convention: ComponentName.css
Styling is primarily done using Bootstrap for responsiveness and aesthetics
once everything is setup run npm start to start the development server, Once the server is running, you can access the app in your browser: http://localhost:3000
User Authentication: Sign up with a new account or log in if you already have one. Reset your password if needed.
Choose between a public or private profile, creating & Interacting with Posts, Share text, images (with filters), videos, audio, and links.
Like, comment (text, stickers, images), and share posts, Tag users and use hashtags.
Bookmark posts for later, Delete, edit, or unshare posts.
Profile Management: Edit profile details (username, bio, social links, etc.), Change profile avatar (choose from 200+ avatars or upload your own), Follow/unfollow users and view profile insights.
Search: Discover people, posts, hashtags, and groups.
View suggested users to follow.
Deployment:
The project is hosted on AWS and accessible via the provided URL in my_instagram_url.txt.

```
./my_instagram
```

### The Core Team
This project was developed by Salaha Abubakar

<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
