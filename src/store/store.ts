import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminBlogReducer from '../features/admin/blog/blogSlice';
import publicBlogReducer from '../features/public/blog/blogSlice';
import adminPortfolioReducer from '../features/admin/portfolio/portfolioSlice';
import publicPortfolioReducer from '../features/public/portfolio/portfolioSlice';
import adminSettingsReducer from '../features/admin/settings/settingsSlice';
import publicSchedulingReducer from '../features/public/scheduling/schedulingSlice';
import newsletterReducer from '../features/admin/newsletter/newsletterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminBlog: adminBlogReducer,
    publicBlog: publicBlogReducer,
    adminPortfolio: adminPortfolioReducer,
    publicPortfolio: publicPortfolioReducer,
    adminSettings: adminSettingsReducer,
    publicScheduling: publicSchedulingReducer,
    newsletter: newsletterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
