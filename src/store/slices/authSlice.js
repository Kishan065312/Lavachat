import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, userId: null, profile: null, selectedCover: null },
  reducers: {
    loginSuccess: (s, a) => { s.user = a.payload.user; s.token = a.payload.token; },
    setUserId: (s, a) => { s.userId = a.payload; },
    setProfile: (s, a) => { s.profile = a.payload; },
    setSelectedCover: (s, a) => { s.selectedCover = a.payload; },
    logout: (s) => { s.user = null; s.token = null; s.userId = null; s.profile = null; s.selectedCover = null; }
  }
});

export const { loginSuccess, logout, setUserId, setProfile, setSelectedCover } = slice.actions;
export default slice.reducer;
