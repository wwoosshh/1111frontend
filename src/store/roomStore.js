import { create } from 'zustand';

const CURRENT_PROFILE_KEY = (roomId) => `noraboja:current-profile:${roomId}`;

const readCurrentProfile = (roomId) => {
  if (!roomId || typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_PROFILE_KEY(roomId)) || null;
};

const writeCurrentProfile = (roomId, profileId) => {
  if (!roomId || typeof window === 'undefined') return;
  if (profileId) localStorage.setItem(CURRENT_PROFILE_KEY(roomId), profileId);
  else localStorage.removeItem(CURRENT_PROFILE_KEY(roomId));
};

export const useRoomStore = create((set, get) => ({
  room: null,
  profiles: [],
  selections: [],
  activeProfileIds: [],
  currentProfileId: null,

  setSnapshot: ({ room, profiles, selections }) => {
    const restored = readCurrentProfile(room?.id);
    const stillExists = restored && profiles.some((p) => p.id === restored);
    set({
      room,
      profiles,
      selections,
      currentProfileId: stillExists ? restored : null,
    });
  },

  setRoom: (room) => set({ room }),

  setCurrentProfile: (profileId) => {
    const { room } = get();
    writeCurrentProfile(room?.id, profileId);
    set({ currentProfileId: profileId });
  },

  addProfile: (profile) =>
    set((s) => ({
      profiles: s.profiles.some((p) => p.id === profile.id) ? s.profiles : [...s.profiles, profile],
    })),

  removeProfile: (profileId) =>
    set((s) => ({
      profiles: s.profiles.filter((p) => p.id !== profileId),
      selections: s.selections.filter((sel) => sel.profileId !== profileId),
      currentProfileId: s.currentProfileId === profileId ? null : s.currentProfileId,
    })),

  applyDateChange: ({ profileId, date, action }) =>
    set((s) => {
      if (action === 'add') {
        const exists = s.selections.some((x) => x.profileId === profileId && x.date === date);
        return exists ? s : { selections: [...s.selections, { profileId, date }] };
      }
      return { selections: s.selections.filter((x) => !(x.profileId === profileId && x.date === date)) };
    }),

  setConfirmedDate: (confirmedDate) =>
    set((s) => ({ room: { ...s.room, confirmed_date: confirmedDate } })),

  setActiveProfileIds: (ids) => set({ activeProfileIds: ids }),

  reset: () => set({ room: null, profiles: [], selections: [], activeProfileIds: [], currentProfileId: null }),
}));
