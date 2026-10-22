
import { createSlice } from '@reduxjs/toolkit';

const slice=createSlice({
  name:'live',
  initialState:{ users:[], gifts:[] },
  reducers:{
    addUser:(s,a)=>{ s.users.push(a.payload); },
    addGift:(s,a)=>{ s.gifts.push(a.payload); }
  }
});

export const {addUser,addGift}=slice.actions;
export default slice.reducer;
