
import { createSlice } from '@reduxjs/toolkit';

const slice=createSlice({
  name:'chat',
  initialState:{messages:[]},
  reducers:{
    sendMessage:(s,a)=>{},
    receiveMessage:(s,a)=>{ s.messages.push(a.payload); }
  }
});

export const {sendMessage,receiveMessage} = slice.actions;
export default slice.reducer;
