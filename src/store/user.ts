import { User } from "next-auth";
import { create } from "zustand";

type UserStore = {
  setUser: (user: User) => void;
  updateUser: (data: Pick<User, "bio" | "image" | "name" | "username">) => void;
  user?: User;
};

export const useUserStore = create<UserStore>((set) => ({
  setUser: (user) => set({ user }),
  updateUser: (data) =>
    set((state) => {
      if (!state.user) return { user: undefined };
      return {
        user: { ...state.user, ...data },
      };
    }),
}));
