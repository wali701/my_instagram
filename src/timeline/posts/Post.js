import React, { useState } from "react";
import "./Post.css";
import { Avatar } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { generateClient } from '@aws-amplify/api';
import { deletePost, updatePost, createComment } from '../../graphql/mutations';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { getUser } from '../../graphql/queries';

function Post({ user, profilePictureUrl, postImage, text, likes, likedBy, comments: initialComments, timestamp, userId, postId, postUserId, onDelete, onUpdate }) {
    const [commentText, setCommentText] = useState('');
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [localComments, setLocalComments] = useState(Array.isArray(initialComments) ? initialComments : []);
    const client = generateClient();

    const handleDelete = async () => {
        try {
            const response = await client.graphql({
                query: deletePost,
                variables: { input: { id: postId } }
            });
            if (response.errors) throw new Error(JSON.stringify(response.errors));
            if (onDelete) onDelete(postId);
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post: ' + error.message);
        }
    };

    const handleLike = async () => {
        try {
            const userAttributes = await fetchUserAttributes();
            const currentUserId = userAttributes.sub;
            const isLiked = likedBy && likedBy.includes(currentUserId);
            const updatedLikedBy = isLiked 
                ? likedBy.filter(id => id !== currentUserId) 
                : [...(likedBy || []), currentUserId];
            const updatedLikes = isLiked ? Math.max(likes - 1, 0) : likes + 1;

            const response = await client.graphql({
                query: updatePost,
                variables: { 
                    input: { 
                        id: postId, 
                        likes: updatedLikes, 
                        likedBy: updatedLikedBy 
                    } 
                }
            });
            if (response.errors) throw new Error(JSON.stringify(response.errors));
            if (onUpdate) onUpdate(postId, response.data.updatePost);
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentToggle = () => {
        setShowCommentInput(prev => !prev);
        setCommentText('');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const userAttributes = await fetchUserAttributes();
            const currentUserId = userAttributes.sub;

            const response = await client.graphql({
                query: createComment,
                variables: {
                    input: {
                        text: commentText,
                        userId: currentUserId,
                        postId: postId,
                        timestamp: new Date().toISOString()
                    }
                }
            });

            if (response.errors) throw new Error(JSON.stringify(response.errors));
            const newComment = response.data.createComment;

            const userResponse = await client.graphql({
                query: getUser,
                variables: { id: currentUserId }
            });
            const commenter = userResponse.data.getUser || { username: 'Unknown' };
            newComment.username = commenter.username;

            setLocalComments(prev => [...prev, newComment]);
            setCommentText('');
            setShowCommentInput(false);

            if (onUpdate) onUpdate(postId, { likes, likedBy, comments: [...localComments, newComment] });
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Failed to add comment: ' + error.message);
        }
    };

    const isLiked = likedBy && likedBy.includes(userId);

    return (
        <div className="post">
            <div className="post__header">
                <div className="post__headerAuthor">
                    {profilePictureUrl ? (
                        <Avatar src={profilePictureUrl} alt={user} />
                    ) : (
                        <Avatar>{user?.charAt(0).toUpperCase() || 'U'}</Avatar>
                    )}
                    <span className="post__username">{user || 'Unknown'}</span>
                    <span className="post__timestamp">{timestamp}</span>
                </div>
                <div className="post__actions">
                    <MoreHorizIcon />
                    {userId === postUserId && (
                        <DeleteIcon className="deleteIcon" onClick={handleDelete} />
                    )}
                </div>
            </div>
            <div className="post__image">
                <img src={postImage} alt="post" onError={() => console.log('Post image failed to load:', postImage)} />
            </div>
            <div className="post__footer">
                <div className="post__footerIcons">
                    <div className="post__iconsMain">
                        {isLiked ? (
                            <FavoriteIcon className="postIcon liked" onClick={handleLike} />
                        ) : (
                            <FavoriteBorderIcon className="postIcon" onClick={handleLike} />
                        )}
                        <ChatBubbleOutlineIcon 
                            className="postIcon" 
                            onClick={handleCommentToggle} 
                        />
                        <TelegramIcon className="postIcon" />
                    </div>
                    <div className="post__iconSave">
                        <BookmarkBorderIcon className="postIcon" />
                    </div>
                </div>
                <div className="post__likes">
                    Liked by {likes} people.
                </div>
                <div className="post__caption">
                    <span className="post__text">{text || ''}</span>
                </div>
                <div className="post__comments">
                    {localComments.length > 0 ? (
                        localComments.map(comment => (
                            <div key={comment.id} className="post__comment">
                                <span className="comment__user">{comment.username || 'Unknown'}</span>
                                <span className="comment__text">{comment.text}</span>
                            </div>
                        ))
                    ) : (
                        <span className="no-comments">No comments yet.</span>
                    )}
                </div>
                {showCommentInput && (
                    <form onSubmit={handleCommentSubmit} className="post__commentForm">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="post__commentInput"
                            autoFocus
                        />
                        <button type="submit" className="post__commentButton">Post</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Post;