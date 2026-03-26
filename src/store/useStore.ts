import { create } from 'zustand';
import { AuthState, UserPlan } from '../types';

interface StoreState extends AuthState {
  login: (email: string, plan: UserPlan) => void;
  logout: () => void;
  setPlan: (plan: UserPlan) => void;
}

export const useStore = create<StoreState>((set) => ({
  user: { email: 'demo@tradeintel.np', plan: 'free' },
  isAuthenticated: true,
  login: (email, plan) => set({ user: { email, plan }, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setPlan: (plan) => set((state) => ({
    user: state.user ? { ...state.user, plan } : null
  })),
}));
