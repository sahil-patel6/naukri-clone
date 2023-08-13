import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export enum UserRole {
  CANDIDATE = "CANDIDATE",
  RECRUITER = "RECRUITER"
}

export interface CurrentUser {
  isFetched: boolean;
  id?: string;
  name?: string;
  email?: string;
  isVerified?: boolean;
  role?: UserRole
}

const initialState: CurrentUser = {
  isFetched: false
}

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