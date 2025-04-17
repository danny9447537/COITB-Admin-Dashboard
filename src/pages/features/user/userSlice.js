import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/firebase";

export const signInUser = createAsyncThunk(
    "user/signInUser",
    async ({ Email, Password }, thunkAPI) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, Email, Password);
            return {
                email: userCredential.user.email,
                uid: userCredential.user.uid
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        loading: false,
        error: null
    },
    reducers: {
        logoutUser: (state) => {
            state.currentUser = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInUser.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(signInUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export your logoutUser reducer and main reducer
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
