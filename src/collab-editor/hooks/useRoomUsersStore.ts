import { create } from "zustand";
import { AwarenessUser } from "./useYjsAwareness";

type RoomUsersStore = {
  users: AwarenessUser[];
  setUsers: (users: AwarenessUser[]) => void;
};

export const useRoomUsersStore = create<RoomUsersStore>((set) => ({
  users: [],
  setUsers: (users) => {
    set({ users });
  },
}));
