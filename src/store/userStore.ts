import { User } from "next-auth";
import { create } from "zustand";

type UserStore = {
  setUser: (user: User) => void;
  user?: User;
};

export const useUserStore = create<UserStore>((set) => ({
  setUser: (user) => set({ user }),
}));
