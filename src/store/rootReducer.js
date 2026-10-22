
import { combineReducers } from '@reduxjs/toolkit';
import chat from './slices/chatSlice';
import live from './slices/liveSlice';
import auth from './slices/authSlice';
import room from './slices/roomSlice';

export default combineReducers({ chat, live, auth, room });
