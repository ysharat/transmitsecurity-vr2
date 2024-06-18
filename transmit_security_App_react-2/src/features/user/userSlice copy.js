import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const themes = {
  winter: 'winter',
  dracula: 'dracula',
};

const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user')) || null;
};

const getSessionIdFromLocalStorage = () => {
  return localStorage.getItem('session_id') || null;
};

const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem('theme') || themes.winter;
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
};

const initialState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
  loading: false,
  error: null,
};

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      // Dispatch logout pending action
      thunkAPI.dispatch(logoutPending());

      // Get session_id from local storage
      const sessionId = getSessionIdFromLocalStorage();

      if (!sessionId) {
        throw new Error('Session ID not found in local storage');
      }

      // Obtain access token using client credentials grant
      const tokenResponse = await axios.post('https://api.transmitsecurity.io/cis/oidc/token', {
        client_id: 'your_client_id',
        client_secret: 'your_client_secret',
        grant_type: 'client_credentials',
      });

      const accessToken = tokenResponse.data.access_token;

      // Make logout API call with obtained access token and session_id
      await axios.post('https://api.transmitsecurity.io/cis/v1/auth/session/logout', {
        session_id: sessionId,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Clear local storage after successful logout
      localStorage.removeItem('user');
      localStorage.removeItem('session_token');
      localStorage.removeItem('session_id');

      // Dispatch logout success action
      return { success: true };
    } catch (error) {
      // Dispatch logout failure action
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const user = { ...action.payload.user, token: action.payload.jwt };
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    logoutPending: (state) => {
      state.loading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    toggleTheme: (state) => {
      const { dracula, winter } = themes;
      state.theme = state.theme === dracula ? winter : dracula;
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('theme', state.theme);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      // Handle logout success
      state.loading = false;
      state.user = null;
      state.error = null;
      toast.success('Logged out successfully');
    });
    builder.addCase(logoutUser.pending, (state) => {
      // Handle logout pending
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      // Handle logout failure
      state.loading = false;
      state.error = action.payload;
      toast.error('Failed to logout');
    });
  },
});

export const { loginUser, toggleTheme } = userSlice.actions;

export default userSlice.reducer;
