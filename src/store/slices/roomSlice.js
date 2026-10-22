import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';

// Async Thunk for Creating a Room
export const createRoom = createAsyncThunk(
    'room/create',
    async (roomData, { rejectWithValue }) => {
        try {
            // Using the reusable API service
            const response = await apiService.post('/api/Room/create', roomData);
            return response;
        } catch (error) {
            // Return error message or full error object
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async Thunk for Fetching Room List
export const fetchRoomList = createAsyncThunk(
    'room/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.get('/api/Room/list');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async Thunk for Joining a Room
export const joinRoom = createAsyncThunk(
    'room/join',
    async ({ roomId, userId, connectionId }, { rejectWithValue }) => {
        try {
            const response = await apiService.post(`/api/Room/${roomId}/join`, {
                userId,
                connectionId // Pass Connection ID to server
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async Thunk for Leaving a Room
export const leaveRoom = createAsyncThunk(
    'room/leave',
    async ({ roomId, userId, connectionId }, { rejectWithValue }) => {
        try {
            const response = await apiService.post(`/api/Room/${roomId}/leave`, {
                userId: userId,
                connectionId: connectionId
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        rooms: [],
        currentRoom: null,
        loading: false,
        error: null,
        success: false,
        messages: {}, // Store messages by roomId: { [roomId]: [msg1, msg2] }
        minimizedRoom: null, // Stores the room data when minimized
        recentRooms: [], // Store recently visited rooms
    },
    reducers: {
        clearRoomState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        },

        addMessage: (state, action) => {
            const { roomId, message } = action.payload;
            if (!state.messages[roomId]) {
                state.messages[roomId] = [];
            }
            // Add message to the list
            state.messages[roomId].push(message);
        },
        setMessages: (state, action) => {
            const { roomId, messages } = action.payload;
            state.messages[roomId] = messages;
        },
        minimizeRoom: (state, action) => {
            state.minimizedRoom = action.payload;
        },
        closeMinimizedRoom: (state) => {
            state.minimizedRoom = null;
        },
        addToRecentRooms: (state, action) => {
            const room = action.payload;
            if (!room || !room.id) return;

            // Remove if already exists (to move it to top)
            const filtered = state.recentRooms.filter(r => r.id !== room.id);

            // Add to the beginning and keep only top 20
            state.recentRooms = [room, ...filtered].slice(0, 20);
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Room Cases
            .addCase(createRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.currentRoom = action.payload;
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // Fetch Room List Cases
            .addCase(fetchRoomList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomList.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload;
            })
            .addCase(fetchRoomList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Join Room Cases
            .addCase(joinRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(joinRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRoom = action.payload;
            })
            .addCase(joinRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Leave Room Cases
            .addCase(leaveRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(leaveRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRoom = null; // Clear current room after leaving
            })
            .addCase(leaveRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearRoomState, addMessage, setMessages, minimizeRoom, closeMinimizedRoom, addToRecentRooms } = roomSlice.actions;
export default roomSlice.reducer;
