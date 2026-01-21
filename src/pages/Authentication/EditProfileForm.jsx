import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  CardTitle,
  Spinner,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import toast from "react-hot-toast";

const EditProfileForm = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || "");

  // Upload file to server and get URL
  const uploadFile = async () => {
    if (!avatarFile) return avatarUrl;

    const auth = JSON.parse(localStorage.getItem("authUser"));
    const token = auth?.token;

    const formData = new FormData();
    formData.append("file", avatarFile);
    formData.append("folder", "users");

    try {
      const res = await axios.post(
        "https://shekhai-server.onrender.com/api/v1/uploads",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (res.data.success) {
        const fileUrl = res.data.fileUrl;
        
        // ✅ Update local state immediately for better UX
        setAvatarUrl(fileUrl);
        setAvatarPreview(fileUrl);
        
        // ✅ Update authUser in localStorage IMMEDIATELY
        updateLocalStorageAvatar(fileUrl);
        
        toast.success("Avatar uploaded successfully!");
        return fileUrl;
      } else {
        toast.error(res.data.message || "Failed to upload avatar");
        return avatarUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar image");
      return avatarUrl;
    }
  };

  // Helper to update avatar in localStorage
  const updateLocalStorageAvatar = (newAvatarUrl) => {
    try {
      const auth = JSON.parse(localStorage.getItem("authUser"));
      if (auth && auth.user) {
        // Update the user object in auth
        auth.user.avatarUrl = newAvatarUrl;
        
        // Save back to localStorage
        localStorage.setItem("authUser", JSON.stringify(auth));
        
        // Also update parent component's user state if needed
        if (setUser) {
          setUser(prev => ({ ...prev, avatarUrl: newAvatarUrl }));
        }
        
        console.log("LocalStorage avatar updated:", newAvatarUrl);
      }
    } catch (error) {
      console.error("Error updating localStorage avatar:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required!");
    if (!email.trim()) return toast.error("Email is required!");

    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("authUser"));
      const token = auth?.token;
      if (!token) throw new Error("You are not authenticated");

      // 1️⃣ Upload avatar if new file selected
      const uploadedUrl = await uploadFile();

      // 2️⃣ Prepare payload for profile update
      const payload = { 
        name, 
        email, 
        bio, 
        avatarUrl: uploadedUrl 
      };
      
      if (newPassword) {
        if (!currentPassword) {
          setLoading(false);
          return toast.error("Current password is required to change password");
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      // 3️⃣ Send update request
      const res = await axios.put(
        "https://shekhai-server.onrender.com/api/v1/users/me",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        const updatedUser = res.data.user;
        
        // ✅ Update authUser in localStorage COMPLETELY
        auth.user = updatedUser;
        localStorage.setItem("authUser", JSON.stringify(auth));
        
        // ✅ Update parent component state
        setUser(updatedUser);
        
        // ✅ Update local state
        setAvatarUrl(updatedUser.avatarUrl || "");
        setAvatarPreview(updatedUser.avatarUrl || "");
        
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        
        // Clear avatar file selection
        setAvatarFile(null);
        
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Avatar image too large (max 5MB)");
        return;
      }
      
      // Check file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only image files are allowed (JPEG, PNG, GIF, WebP)");
        return;
      }
      
      setAvatarFile(file);
      
      // Create preview immediately
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <CardTitle className="mb-4">Edit Profile</CardTitle>

        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-12 mb-3">
              <Label>Name</Label>
              <Input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                invalid={!name.trim()}
              />
              {!name.trim() && <FormFeedback>Name is required</FormFeedback>}
            </div>

            <div className="col-lg-12 mb-3">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                invalid={!email.trim()}
              />
              {!email.trim() && <FormFeedback>Email is required</FormFeedback>}
            </div>

            <div className="col-lg-10 mb-3">
              <Label>Avatar Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <div className="form-text">
                Max 5MB. Supported: JPG, PNG, GIF, WebP
              </div>
            </div>
            
            <div className="col-lg-2">
              {/* Avatar Preview Section */}
              <div className="d-flex justify-content-center">
                {avatarFile ? (
                  // Preview of newly selected file (not uploaded yet)
                  <div className="position-relative">
                    <img
                      src={avatarPreview}
                      alt="avatar preview"
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #0d6efd",
                      }}
                    />
                    <div className="position-absolute top-0 start-100 translate-middle">
                      <span className="badge bg-primary">New</span>
                    </div>
                  </div>
                ) : avatarUrl ? (
                  // Current avatar from server
                  <img
                    src={avatarUrl}
                    alt="current avatar"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #dee2e6",
                    }}
                  />
                ) : (
                  // Default placeholder if no avatar
                  <div className="d-flex align-items-center justify-content-center bg-secondary rounded-circle"
                    style={{
                      width: 80,
                      height: 80,
                    }}
                  >
                    <span className="text-white fw-bold fs-4">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-12 mb-3">
              <Label>Bio</Label>
              <Input
                type="textarea"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
              />
            </div>

            <div className="col-lg-6 mb-3">
              <Label>Current Password (leave blank to keep unchanged)</Label>
              <InputGroup>
                <Input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  placeholder="Enter current password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <InputGroupText
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeSlash /> : <Eye />}
                </InputGroupText>
              </InputGroup>
              <div className="form-text">
                Required only if changing password
              </div>
            </div>

            <div className="col-lg-6 mb-3">
              <Label>New Password (leave blank to keep unchanged)</Label>
              <InputGroup>
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputGroupText
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeSlash /> : <Eye />}
                </InputGroupText>
              </InputGroup>
              <div className="form-text">
                Minimum 6 characters
              </div>
            </div>
          </div>

          <div className="text-end mt-3">
            <Button
              color="primary"
              type="submit"
              className="w-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditProfileForm;