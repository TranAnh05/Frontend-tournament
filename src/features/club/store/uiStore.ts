import { create } from "zustand";

interface Toast {
  message: string;
  type: "success" | "error" | "info";
}

interface UiState {
  toast: Toast | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  toast: null,

  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  clearToast: () => set({ toast: null }),
}));