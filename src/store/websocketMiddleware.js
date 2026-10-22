
import { socket } from '../api/websocket';
import { receiveMessage } from './slices/chatSlice';

export default store => {
  socket.on('chat_message', msg => store.dispatch(receiveMessage(msg)));
  return next => action => {
    if(action.type==='chat/sendMessage'){ socket.emit('chat_message',action.payload); }
    return next(action);
  };
};
