import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import blogReducer from '../features/blog/blogSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';
import newsletterReducer from '../features/newsletter/newsletterSlice';
import schedulingReducer from '../features/scheduling/schedulingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    portfolio: portfolioReducer,
    newsletter: newsletterReducer,
    scheduling: schedulingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
