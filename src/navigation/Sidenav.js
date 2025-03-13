import React from 'react';
import './Sidenav.css';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signOut } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { fetchUserAttributes } from '@aws-amplify/auth';

function Sidenav() {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.reload();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleCreatePost = () => navigate('/create-post');

    const handleProfile = async () => {
        try {
            const attributes = await fetchUserAttributes();
            const userId = attributes.sub;
            console.log('Navigating to profile with userId:', userId);
            navigate(`/profile/${userId}`);
        } catch (error) {
            console.error('Error fetching user ID for profile:', error);
            navigate('/profile');
        }
    };

    return (
        <div className="sidenav">
            <img 
                className="sidenav__logo" 
                src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png" 
                alt="Instagram Logo" 
            />
            <div className="sidenav__buttons">
                <button className="sidenav__button" onClick={() => navigate('/')}>
                    <HomeIcon />
                    <span>Home</span>
                </button>
                <button className="sidenav__button">
                    <SearchIcon />
                    <span>Search</span>
                </button>
                <button className="sidenav__button">
                    <ExploreIcon />
                    <span>Explore</span>
                </button>
                <button className="sidenav__button">
                    <SlideshowIcon />
                    <span>Reels</span>
                </button>
                <button className="sidenav__button">
                    <ChatIcon />
                    <span>Messages</span>
                </button>
                <button className="sidenav__button">
                    <FavoriteBorderIcon />
                    <span>Notifications</span>
                </button>
                <button className="sidenav__button" onClick={handleCreatePost}>
                    <AddCircleOutlineIcon />
                    <span>Create</span>
                </button>
                <button className="sidenav__button" onClick={handleProfile}>
                    <AccountCircleIcon />
                    <span>Profile</span>
                </button>
                <div className="sidenav__more">
                    <button className="sidenav__button">
                        <MenuIcon />
                        <span>More</span>
                    </button>
                </div>
                <button className="sidenav__button" onClick={handleSignOut}>
                    <ExitToAppIcon />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}

export default Sidenav;