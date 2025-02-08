import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  followUser,
  unfollowUser,
  toggleNotifications,
  addReview,
  likeReview,
  addReplyToReview,
  shareShelf
} from '../store/socialSlice';

export function useSocial() {
  const dispatch = useDispatch();
  const {
    following,
    notifications,
    sharedShelves,
    reviews
  } = useSelector((state: RootState) => state.social);

  const handleFollowUser = (userId: string) => {
    dispatch(followUser(userId));
  };

  const handleUnfollowUser = (userId: string) => {
    dispatch(unfollowUser(userId));
  };

  const handleToggleNotifications = (userId: string) => {
    dispatch(toggleNotifications(userId));
  };

  const handleAddReview = (bookId: string, review: {
    content: string;
    rating: number;
    visibility: 'public' | 'friends' | 'private';
  }) => {
    dispatch(addReview({
      bookId,
      review: {
        id: Date.now().toString(),
        userId: 'currentUser', // Remplacer par l'ID de l'utilisateur actuel
        ...review
      }
    }));
  };

  const handleLikeReview = (bookId: string, reviewId: string) => {
    dispatch(likeReview({ bookId, reviewId }));
  };

  const handleReplyToReview = (bookId: string, reviewId: string, content: string) => {
    dispatch(addReplyToReview({
      bookId,
      reviewId,
      reply: {
        id: Date.now().toString(),
        userId: 'currentUser', // Remplacer par l'ID de l'utilisateur actuel
        content
      }
    }));
  };

  const handleShareShelf = (shelfId: string, visibility: 'friends' | 'public') => {
    dispatch(shareShelf({ shelfId, visibility }));
  };

  return {
    following,
    notifications,
    sharedShelves,
    reviews,
    handleFollowUser,
    handleUnfollowUser,
    handleToggleNotifications,
    handleAddReview,
    handleLikeReview,
    handleReplyToReview,
    handleShareShelf
  };
}