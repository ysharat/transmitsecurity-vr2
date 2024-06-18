//Header.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/user/userSlice';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.userState.user);

  const getSessionIdFromLocalStorage = () => {
    try {
      return localStorage.getItem('session_id') || null;
    } catch (error) {
      console.error('Error getting session ID from local storage:', error);
      return null;
    }
  };

  const sessionId = getSessionIdFromLocalStorage();

  const handleLogout = async () => {
    if (sessionId) {
      try {
        const params = new URLSearchParams();
        params.append('client_id', '246z720t5nnetdgp0xw9tbai6zf4cvtf');
        params.append('client_secret', 'a42b3911-fa3b-4f44-8a42-127966f96919');
        params.append('grant_type', 'client_credentials');
  
        const tokenResponse = await axios.post('https://api.transmitsecurity.io/cis/oidc/token', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const accessToken = tokenResponse.data.access_token;
        console.log("accessToken", accessToken);

        try {
          await axios.post('https://api.transmitsecurity.io/cis/v1/auth/session/logout', {
            session_id: sessionId,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (logoutError) {
          console.error('Error during logout API call:', logoutError);
        }

        navigate('/');
        dispatch(logoutUser());
        queryClient.removeQueries();
      } catch (tokenError) {
        console.error('Error obtaining access token:', tokenError);
      }
    } else {
      console.error('Session ID not found');
    }
  };

  return (
    <header className='bg-neutral py-2 text-neutral-content'>
      <div className='align-element flex justify-center sm:justify-end'>
        {user ? (
          <div className='flex gap-x-2 sm:gap-x-8 items-center'>
            <p className='text-xs sm:text-sm'>Hello, {user.username}</p>
            <button
              className='btn btn-xs btn-outline btn-primary'
              onClick={handleLogout}
            >
              logout
            </button>
          </div>
        ) : (
          <div className='flex gap-x-6 justify-center items-center'>
            <Link to='/login' className='link link-hover text-xs sm:text-sm'>
              Sign in
            </Link>
            <Link to='/register' className='link link-hover text-xs sm:text-sm'>
              Create Account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
