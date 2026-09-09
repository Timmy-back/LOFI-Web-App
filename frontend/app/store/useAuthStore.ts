import { headers } from "next/headers";
import { create } from "zustand";

interface AuthState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  register: (email: string, password: string) => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  success: false,

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null, success: false });

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });


      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail ?? "Registration failed");
      }

      set({ isLoading: false, success: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      set({ isLoading: false, error: message });
    }
  },

  reset: () => set({ isLoading: false, error: null, success: false }),
}));
