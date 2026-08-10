import { injectStore, setAuthInterceptHandlers } from '../services/axiosInstance';
import { clearAuth, setTokens } from '../features/auth/authSlice';
import { store } from './store';

injectStore(store);
setAuthInterceptHandlers({
  onTokensRefreshed: (tokens) => store.dispatch(setTokens(tokens)),
  onAuthClear: () => store.dispatch(clearAuth()),
});

export { store } from './store';
export type { RootState, AppDispatch, AppStore } from './store';
