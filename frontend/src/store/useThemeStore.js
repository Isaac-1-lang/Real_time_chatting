import { create } from "zustand";

export const useThemeStore = create((set) => {
  const savedTheme = localStorage.getItem("chat-theme") || "luxury";

  // Apply theme on initialization
  document.documentElement.setAttribute("data-theme", savedTheme);

  return {
    theme: savedTheme,
    setTheme: (theme) => {
      localStorage.setItem("chat-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
      set({ theme });
    },
  };
});
