import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { LocaleProvider } from './context/LocaleContext';
import { SiteProvider } from './context/SiteContext';
import { AppRouter } from './Router/router';
import { store } from './store';
import { AuthBootstrap } from './features/auth/AuthBootstrap';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SiteProvider>
      <LocaleProvider>{children}</LocaleProvider>
    </SiteProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <Providers>
            <AuthBootstrap />
            <AppRouter />
          </Providers>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}
