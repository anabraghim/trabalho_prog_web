import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/User";

interface AuthState {
  token: string | null;
  user: User | null;
}

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

const initialState: AuthState = {
  token: token || null,
  user: user ? JSON.parse(user) as User : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;

      // 🧼 Limpa o localStorage também
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;