import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {type AuthUser, type AuthResponse } from '../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  loginSuccess: (data: AuthResponse) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,

      loginSuccess: (data) => {
        set({
          user: {
            email: data.email,
            fullName: data.fullName,
            roles: data.roles,
          },
          token: data.accessToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set(initialState);
      },
    }),
    {
      name: 'tournament-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);