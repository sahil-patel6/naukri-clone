import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

enum UserRole {
  CANDIDATE = "CANDIDATE",
  RECRUITER = "RECRUITER"
}

export interface CurrentUser {
  id?: string;
  name?: string;
  email?: string;
  isVerified?: boolean;
  role?: UserRole
}

const initialState: CurrentUser = {}

export const currentUser = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    addCurrentUser: (state: CurrentUser, action: PayloadAction<CurrentUser>) => {
      // state = action.payload;
      return action.payload
    },
    verifiedUser: (state: CurrentUser) => {
      state.isVerified = true
    },
    signOutUser: (state: CurrentUser) => {
      return initialState;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addCurrentUser, signOutUser, verifiedUser } = currentUser.actions

export default currentUser.reducer