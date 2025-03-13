import { loadUsers, saveUsers } from '../utils/localStorage';

const defaultUsers = [
  {
    id: "friend1",
    username: "Mary",
    bio: "photo lover",
    profilePicture: "https://static.vecteezy.com/system/resources/thumbnails/010/243/858/small/close-up-shot-of-happy-young-european-woman-has-pleasant-smile-keeps-hands-together-near-chin-wears-casual-white-clothes-isolated-over-grey-background-being-in-high-spirit-enjoys-spare-time-photo.JPG?w=80&h=80",
    likes: 10,
    likedBy: [],
    followers: [],
    following: [],
  },
  {
    id: "friend2",
    username: "Musa",
    bio: "Travel enthusiast",
    profilePicture: "https://lestimes.com/wp-content/uploads/2017/02/Short-People-Change-Big-Worleds-founder-Realeboha-Moeketsi-2-1.jpg?w=80&h=80",
    likes: 5,
    likedBy: [],
    followers: [],
    following: [],
  },
  {
    id: "friend3",
    username: "Fahn",
    bio: "Foodie",
    profilePicture: "https://www.nationalarchivesstore.org/cdn/shop/products/SKU-01058670-T-Shirt-We-The-People-_2_1024x1024.jpg?v=1603769168&w=80&h=80",
    likes: 8,
    likedBy: [],
    followers: [],
    following: [],
  },
  {
    id: "friend4",
    username: "Liam",
    bio: "Tech geek",
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg?w=80&h=80",
    likes: 12,
    likedBy: [],
    followers: [],
    following: [],
  },
  {
    id: "friend5",
    username: "Olivia",
    bio: "Fashionista",
    profilePicture: "https://randomuser.me/api/portraits/women/2.jpg?w=80&h=80",
    likes: 18,
    likedBy: [],
    followers: [],
    following: [],
  },
];

const friendSuggests = loadUsers() || defaultUsers;
saveUsers(friendSuggests);

export default friendSuggests;