import { useState, useRef, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  Camera,
  Mail,
  User,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  MessageSquare,
  Users,
  UserPlus,
  Calendar,
  UserCircle,
  Upload,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile, uploadProfileImage } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    username: authUser?.profile?.username || "",
    email: authUser?.profile?.email || "",
    firstName: authUser?.profile?.firstName || "",
    lastName: authUser?.profile?.lastName || "",
    phoneNumber: authUser?.profile?.phoneNumber || "",
    gender: authUser?.profile?.gender || "",
    dateOfBirth: authUser?.profile?.dateOfBirth || "",
    imageUrl: authUser?.profile?.imageUrl || "",
  });

  // Function to compress image
  const compressImage = useCallback((dataUrl, maxSizeInMB = 1) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate the width and height, maintaining aspect ratio
        const maxDimension = 800; // Maximum width or height
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Adjust quality based on desired file size
        let quality = 0.7; // Start with 70% quality
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

        // Try to get a compressed image under the max size
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        // If image is still too large, decrease quality incrementally
        while (compressedDataUrl.length > maxSizeInBytes && quality > 0.1) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(compressedDataUrl);
      };
    });
  }, []);

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Store the file for later upload
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        // Compress the image before previewing
        toast.loading("Processing image...");
        const compressedImage = await compressImage(event.target.result, 0.8);
        setPreviewImage(compressedImage);
        toast.dismiss();
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Failed to process image");
        setPreviewImage(event.target.result); // Fallback to original
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!previewImage) return;

    try {
      setIsUploading(true);

      // The backend expects the base64 image string directly
      const imageData = {
        image: previewImage,
      };

      // Use the dedicated upload function with JSON data
      const uploadResult = await uploadProfileImage(imageData);

      // Get the imageUrl from the result
      const imageUrl =
        uploadResult.imageUrl || uploadResult.url || uploadResult;

      console.log("Upload successful:", imageUrl);

      // Update the form data with the new image URL, but don't update profile yet
      setFormData((prev) => ({ ...prev, imageUrl }));

      // Reset states
      setPreviewImage(null);
      setSelectedFile(null);

      toast.success(
        "Image uploaded successfully! Click 'Save Changes' to update your profile."
      );
    } catch (error) {
      console.error("Upload error:", error);

      if (error.response?.status === 413) {
        toast.error(
          "Image is too large. Please select a smaller image or reduce quality."
        );
      } else {
        toast.error(
          "Failed to upload image: " +
            (error.response?.data?.message || error.message || "Unknown error")
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send updated profile data including imageUrl if it was changed
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate user's registration duration
  const calculateMembership = (dateString) => {
    if (!dateString) return "New member";
    const registrationDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - registrationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-violet-500/20 via-base-100 to-fuchsia-500/20 rounded-xl border border-violet-200/50 p-6 shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="size-24 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="size-24 object-cover"
                    />
                  ) : formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Profile"
                      className="size-24 object-cover"
                    />
                  ) : (
                    <UserCircle className="size-12 text-white" />
                  )}
                </div>
                {previewImage ? (
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <button
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="btn btn-circle btn-sm bg-emerald-500 hover:bg-emerald-600 border-none"
                    >
                      {isUploading ? (
                        <div className="loading loading-spinner loading-xs text-white"></div>
                      ) : (
                        <Check className="size-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setPreviewImage(null);
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="btn btn-circle btn-sm bg-rose-500 hover:bg-rose-600 border-none"
                    >
                      <X className="size-4 text-white" />
                    </button>
                  </div>
                ) : isEditing ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Upload className="size-6 text-white" />
                  </button>
                ) : null}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isUploading || !isEditing}
                />
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                  {authUser?.profile?.firstName} {authUser?.profile?.lastName}
                </h1>
                <p className="text-base-content/70">
                  @{authUser?.profile?.username}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm text-base-content/60">
                  <Calendar className="size-3" />
                  <span>
                    Member for{" "}
                    {calculateMembership(authUser?.profile?.dateRegistered)}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  // Reset preview image when entering edit mode
                  setPreviewImage(null);
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }
              }}
              className="btn btn-ghost btn-sm gap-2 hover:bg-violet-500/10 transition-colors"
            >
              {isEditing ? (
                <>
                  <X className="size-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="size-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-base-100 rounded-xl border border-violet-200/50 p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-violet-500">
                    <User className="size-4" />
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Last Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-fuchsia-500">
                    <User className="size-4" />
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Username Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-emerald-500">
                    <User className="size-4" />
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-rose-500">
                    <Mail className="size-4" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Phone Number Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-amber-500">
                    <Phone className="size-4" />
                    Phone Number
                  </span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered w-full focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Gender Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-sky-500">
                    <User className="size-4" />
                    Gender
                  </span>
                </label>
                <select
                  className="select select-bordered w-full focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  disabled={!isEditing}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Date of Birth Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-indigo-500">
                    <Calendar className="size-4" />
                    Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={
                    formData.dateOfBirth
                      ? new Date(formData.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  disabled={!isEditing}
                />
              </div>

              {/* Registration Date Field (read-only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2 text-purple-500">
                    <Calendar className="size-4" />
                    Member Since
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-base-200/50 cursor-not-allowed"
                  value={formatDate(authUser?.profile?.dateRegistered)}
                  disabled={true}
                />
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-none hover:scale-105 transition-all gap-2"
                >
                  <Save className="size-4" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-violet-500/20 to-violet-500/5 rounded-xl border border-violet-200/50 p-6 shadow-lg hover:shadow-violet-500/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="size-5 text-violet-500" />
              <h3 className="text-lg font-semibold text-violet-500">
                Messages
              </h3>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {authUser?.chatLogIds?.length || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 rounded-xl border border-fuchsia-200/50 p-6 shadow-lg hover:shadow-fuchsia-500/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <Users className="size-5 text-fuchsia-500" />
              <h3 className="text-lg font-semibold text-fuchsia-500">Groups</h3>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-fuchsia-500 to-rose-500 bg-clip-text text-transparent">
              0
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl border border-emerald-200/50 p-6 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="size-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-emerald-500">
                Friends
              </h3>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
              {authUser?.friendIds?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
