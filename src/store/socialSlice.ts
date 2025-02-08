import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book, User, SharedShelf } from '../types';

interface SocialState {
  following: string[];
  notifications: {
    [userId: string]: boolean;
  };
  sharedShelves: SharedShelf[];
  reviews: {
    [bookId: string]: {
      id: string;
      userId: string;
      content: string;
      rating: number;
      date: string;
      likes: number;
      liked: boolean;
      visibility: 'public' | 'friends' | 'private';
      replies: {
        id: string;
        userId: string;
        content: string;
        date: string;
      }[];
    }[];
  };
}

const initialState: SocialState = {
  following: [],
  notifications: {},
  sharedShelves: [],
  reviews: {}
};

export const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    followUser: (state, action: PayloadAction<string>) => {
      state.following.push(action.payload);
      state.notifications[action.payload] = true;
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      state.following = state.following.filter(id => id !== action.payload);
      delete state.notifications[action.payload];
    },
    toggleNotifications: (state, action: PayloadAction<string>) => {
      state.notifications[action.payload] = !state.notifications[action.payload];
    },
    addReview: (state, action: PayloadAction<{
      bookId: string;
      review: {
        id: string;
        userId: string;
        content: string;
        rating: number;
        visibility: 'public' | 'friends' | 'private';
      };
    }>) => {
      const { bookId, review } = action.payload;
      if (!state.reviews[bookId]) {
        state.reviews[bookId] = [];
      }
      state.reviews[bookId].push({
        ...review,
        date: new Date().toISOString(),
        likes: 0,
        liked: false,
        replies: []
      });
    },
    likeReview: (state, action: PayloadAction<{
      bookId: string;
      reviewId: string;
    }>) => {
      const { bookId, reviewId } = action.payload;
      const review = state.reviews[bookId]?.find(r => r.id === reviewId);
      if (review) {
        review.liked = !review.liked;
        review.likes += review.liked ? 1 : -1;
      }
    },
    addReplyToReview: (state, action: PayloadAction<{
      bookId: string;
      reviewId: string;
      reply: {
        id: string;
        userId: string;
        content: string;
      };
    }>) => {
      const { bookId, reviewId, reply } = action.payload;
      const review = state.reviews[bookId]?.find(r => r.id === reviewId);
      if (review) {
        review.replies.push({
          ...reply,
          date: new Date().toISOString()
        });
      }
    },
    shareShelf: (state, action: PayloadAction<{
      shelfId: string;
      visibility: 'friends' | 'public';
    }>) => {
      const { shelfId, visibility } = action.payload;
      const shelf = state.sharedShelves.find(s => s.id === shelfId);
      if (shelf) {
        shelf.visibility = visibility;
      }
    }
  }
});

export const {
  followUser,
  unfollowUser,
  toggleNotifications,
  addReview,
  likeReview,
  addReplyToReview,
  shareShelf
} = socialSlice.actions;

export default socialSlice.reducer;