import { create } from "zustand";
import axiosInstance from "../lib/axios";

const useSearchStore = create((set) => ({
  search: "",
  results: [],
  loading: false,
  showDropdown: false,
  error: null,

  setSearch: (search) => set({ search }),
  setShowDropdown: (show) => set({ showDropdown: show }),

  handleSearch: async (searchTerm) => {
    set({
      loading: true,
      error: null,
      results: [],
    });

    if (!searchTerm?.trim()) {
      set({
        loading: false,
        showDropdown: false,
      });
      return;
    }

    try {
      const response = await axiosInstance.get(`/user/search/${searchTerm}`);

      const userData = response.data;

      if (!userData) {
        set({
          loading: false,
          showDropdown: true,
          results: [],
        });
        return;
      }

      const transformedUser = {
        id: userData.id,
        firstName: userData.profile.firstName || "",
        lastName: userData.profile.lastName || "",
        username: userData.profile.username || "",
        email: userData.profile.email || "",
        imageUrl: userData.profile.imageUrl || null,
        gender: userData.profile.gender || "",
        dateOfBirth: userData.profile.dateOfBirth || null,
      };

      set({
        results: [transformedUser],
        showDropdown: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Search error:", error);
      set({
        results: [],
        showDropdown: true,
        loading: false,
        error: error.response?.data?.message || "Failed to search user",
      });
    }
  },

  clearSearch: () =>
    set({
      search: "",
      results: [],
      showDropdown: false,
      error: null,
    }),
}));

export default useSearchStore;
