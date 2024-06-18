import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  About,
  Changepassword,
  Error,
  Forgotpassword,
  HomeLayout,
  Landing,
  Login,
  MFA,
  Profile,
  Register,
} from './pages';

import { ErrorElement } from './components';

// loaders
//import { loader as landingLoader } from './pages/Landing';

// actions
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as forgotpassword } from './pages/ForgotPassword';

import { store } from './store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        // loader: landingLoader(queryClient),
      },
      
      
      {
        path: 'about',
        element: <About />,
      },
      
      {
        path: 'changepassword',
        element: <Changepassword />,
      },
      {
        path: 'profile',
        element: <Profile />,
      
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
  {
    path: '/forgotpassword',
    element: <Forgotpassword />,
    errorElement: <Error />,
    action: forgotpassword(store),
  },
  {
    path: '/mfa',
    element: <MFA />,
    errorElement: <Error />,
   
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default App;
