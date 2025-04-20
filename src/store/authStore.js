import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { ProfileRepository } from "../lib/repositories/profileRepository";

export const useAuthStore = create((set, get) => ({
  isLoading: false,
  isInitialized: false,
  session: null,
  profile: null,

  register: async (email, password, name, company) => {
    set({ isLoading: true });
    try {
      const { data: signUpResponse, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) throw signUpError;
      set({ session: signUpResponse.session });

      const { data: profile, error: profileInsertError } =
        await ProfileRepository.createUserProfile(
          signUpResponse.session.user.id,
          email,
          name,
          company
        );

      if (profileInsertError) throw profileInsertError;

      set({ profile });
      return profile;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data: signInResponse, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });

      if (signInError) throw signInError;
      set({ session: signInResponse.session });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, profile: null });
    } finally {
      set({ isLoading: false });
    }
  },

  listenForAuthStateChange: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, isInitialized: true });
      if (session?.user?.id) get().setProfile(session.user.id);
      else set({ profile: null });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      set({ session });
      if (session?.user?.id) get().setProfile(session.user.id);
      else set({ profile: null });
    });

    return () => subscription.unsubscribe();
  },

  setProfile: async (sessionUserId) => {
    try {
      const {
        data: [profile],
        error,
      } = await ProfileRepository.getUserProfile(sessionUserId);
      if (error || !profile) {
        console.error(error);
        await get().logout();
        set({ profile: null });
        return;
      }
      set({ profile });
    } catch (error) {
      console.error(error);
      set({ profile: null });
    }
  },
}));
