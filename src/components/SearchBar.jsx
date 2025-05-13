import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";
import useSearchStore from "../store/useSearchStore";

const SearchBar = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  // Search store
  const {
    search,
    results,
    loading,
    showDropdown,
    error,
    setSearch,
    setShowDropdown,
    handleSearch,
    clearSearch,
  } = useSearchStore();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      handleSearch(search);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (search) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowDropdown(false), 150);
  };

  const handleUserSelect = (userId) => {
    clearSearch();
    navigate(`/userProfile/${userId}`);
  };

  return (
    <div className="relative w-64">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          className="input input-bordered w-full focus:input-primary transition-colors"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          type="submit"
          className="btn btn-primary btn-square"
          disabled={loading}
        >
          {loading ? (
            <div className="loading loading-spinner loading-sm"></div>
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-base-content/60">
              <div className="loading loading-spinner loading-sm"></div>
              <span className="ml-2">Searching...</span>
            </div>
          ) : error ? (
            <div className="p-3 text-center text-error">{error}</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-center text-base-content/60">
              No users found
            </div>
          ) : (
            results.map((user) => (
              <div
                key={user.id}
                className="px-4 py-2 cursor-pointer hover:bg-primary/10 flex items-center gap-3"
                onMouseDown={() => handleUserSelect(user.id)}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        e.target.parentElement.classList.add("bg-primary/10");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-base-content">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-base-content/60 truncate">
                    {user.username || user.email}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
