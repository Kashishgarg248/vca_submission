import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

interface ListEntry {
  profile: UserProfileSummary;
  platform: Platform;
  addedAt: number;
}

interface AppState {
  platform: Platform;
  searchQuery: string;
  savedList: ListEntry[];
  isListOpen: boolean;
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  addToList: (profile: UserProfileSummary, platform: Platform) => void;
  removeFromList: (userId: string) => void;
  isInList: (userId: string) => boolean;
  toggleList: () => void;
  setListOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      platform: "instagram",
      searchQuery: "",
      savedList: [],
      isListOpen: false,

      setPlatform: (platform) =>
        set({ platform, searchQuery: "" }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      addToList: (profile, platform) => {
        const { savedList } = get();
        const alreadyIn = savedList.some((e) => e.profile.user_id === profile.user_id);
        if (alreadyIn) return;
        set({
          savedList: [
            ...savedList,
            { profile, platform, addedAt: Date.now() },
          ],
        });
      },

      removeFromList: (userId) => {
        set((state) => ({
          savedList: state.savedList.filter((e) => e.profile.user_id !== userId),
        }));
      },

      isInList: (userId) =>
        get().savedList.some((e) => e.profile.user_id === userId),

      toggleList: () => set((state) => ({ isListOpen: !state.isListOpen })),
      setListOpen: (open) => set({ isListOpen: open }),
    }),
    {
      name: "influencer-list",
      partialize: (state) => ({ savedList: state.savedList }),
    }
  )
);
