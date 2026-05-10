import { create } from 'zustand';

export const useRoomStore = create((set, get) => ({
  room: null,
  profiles: [],
  selections: [],
  activeProfileIds: [],

  setSnapshot: ({ room, profiles, selections }) =>
    set({ room, profiles, selections }),

  setRoom: (room) => set({ room }),

  addProfile: (profile) =>
    set((s) => ({ profiles: [...s.profiles, profile] })),

  removeProfile: (profileId) =>
    set((s) => ({
      profiles: s.profiles.filter((p) => p.id !== profileId),
      selections: s.selections.filter((sel) => sel.profileId !== profileId),
    })),

  applyDateChange: ({ profileId, date, action }) =>
    set((s) => {
      if (action === 'add') {
        const exists = s.selections.some(
          (x) => x.profileId === profileId && x.date === date
        );
        return exists ? s : { selections: [...s.selections, { profileId, date }] };
      }
      return {
        selections: s.selections.filter(
          (x) => !(x.profileId === profileId && x.date === date)
        ),
      };
    }),

  setConfirmedDate: (confirmedDate) =>
    set((s) => ({ room: { ...s.room, confirmed_date: confirmedDate } })),

  setActiveProfileIds: (ids) => set({ activeProfileIds: ids }),

  reset: () => set({ room: null, profiles: [], selections: [], activeProfileIds: [] }),
}));
