import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '../features/user/userSlice';
import { useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.userState.user);

  const getSessionIdFromLocalStorage = () => {
    return localStorage.getItem('session_id') || null;
  };
  const sessionId = getSessionIdFromLocalStorage();


  if (sessionId) {
    const handleLogout = async () => {
      try {
        const tokenResponse = await axios.post('https://api.transmitsecurity.io/cis/oidc/token', {
          client_id: '246z720t5nnetdgp0xw9tbai6zf4cvtf',
          client_secret: 'a42b3911-fa3b-4f44-8a42-127966f96919',
          grant_type: 'client_credentials',
        });
    
        const accessToken = tokenResponse.data.access_token;
        console.log("accessToken");
        console.log(accessToken);
    
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
    };


    navigate('/');
    //dispatch(clearCart());
    dispatch(logoutUser());
    queryClient.removeQueries();
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
