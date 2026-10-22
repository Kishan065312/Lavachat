
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import websocketMiddleware from './websocketMiddleware';
export default configureStore({ reducer: rootReducer, middleware:(g)=>g().concat(websocketMiddleware) });
