import React, { useState, useEffect } from "react";
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
  Badge,
  Row,
  Col,
} from "reactstrap";
import { Eye, EyeSlash, Facebook, Github, Linkedin, Twitter, Globe } from "react-bootstrap-icons";
import toast from "react-hot-toast";

const EditProfileForm = ({ user, setUser, setSuccess, setError }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    bio: user.bio || "",
    phone: user.phone || "",
    location: user.location || "",
    website: user.website || "",
    avatarUrl: user.avatarUrl || "",
    expertise: user.expertise || [],
    socialLinks: {
      facebook: user.socialLinks?.facebook || "",
      twitter: user.socialLinks?.twitter || "",
      linkedin: user.socialLinks?.linkedin || "",
      github: user.socialLinks?.github || "",
    },
    currentPassword: "",
    newPassword: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl || "");
  const [newExpertise, setNewExpertise] = useState("");

  // Update form data when user prop changes
  useEffect(() => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      phone: user.phone || "",
      location: user.location || "",
      website: user.website || "",
      avatarUrl: user.avatarUrl || "",
      expertise: user.expertise || [],
      socialLinks: {
        facebook: user.socialLinks?.facebook || "",
        twitter: user.socialLinks?.twitter || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
      },
      currentPassword: "",
      newPassword: "",
    });
    setAvatarPreview(user.avatarUrl || "");
  }, [user]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested socialLinks
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Upload file to server and get URL
  const uploadFile = async () => {
    if (!avatarFile) return formData.avatarUrl;

    const auth = JSON.parse(localStorage.getItem("authUser"));
    const token = auth?.token;

    const formDataObj = new FormData();
    formDataObj.append("file", avatarFile);
    formDataObj.append("folder", "users");

    try {
      const res = await axios.post(
        "https://shekhai-server.onrender.com/api/v1/uploads",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        const fileUrl = res.data.fileUrl;
        setFormData(prev => ({ ...prev, avatarUrl: fileUrl }));
        setAvatarPreview(fileUrl);
        updateLocalStorageAvatar(fileUrl);
        toast.success("Avatar uploaded successfully!");
        return fileUrl;
      } else {
        toast.error(res.data.message || "Failed to upload avatar");
        return formData.avatarUrl;
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar image");
      return formData.avatarUrl;
    }
  };

  // Helper to update avatar in localStorage
  const updateLocalStorageAvatar = (newAvatarUrl) => {
    try {
      const auth = JSON.parse(localStorage.getItem("authUser"));
      if (auth && auth.user) {
        auth.user.avatarUrl = newAvatarUrl;
        localStorage.setItem("authUser", JSON.stringify(auth));
      }
    } catch (error) {
      console.error("Error updating localStorage avatar:", error);
    }
  };

  // Handle expertise tags for instructors
  const addExpertise = () => {
    if (newExpertise.trim()) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise("");
    }
  };

  const removeExpertise = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Validate URLs
  const isValidUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) return toast.error("Name is required!");
    if (!formData.email.trim()) return toast.error("Email is required!");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email address!");
    }

    // Phone validation (optional)
    if (formData.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
      return toast.error("Please enter a valid phone number!");
    }

    // Website URL validation (optional)
    if (formData.website && !isValidUrl(formData.website)) {
      return toast.error("Please enter a valid website URL!");
    }

    // Social media URL validation (optional)
    for (const [platform, url] of Object.entries(formData.socialLinks)) {
      if (url && !isValidUrl(url)) {
        return toast.error(`Please enter a valid ${platform} URL!`);
      }
    }

    setLoading(true);
    try {
      const auth = JSON.parse(localStorage.getItem("authUser"));
      const token = auth?.token;
      if (!token) throw new Error("You are not authenticated");

      // Upload avatar if new file selected
      const uploadedUrl = await uploadFile();

      // Prepare complete payload with all fields
      const payload = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        website: formData.website,
        avatarUrl: uploadedUrl,
        expertise: formData.expertise,
        socialLinks: formData.socialLinks,
      };

      // Add password fields if changing password
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          setLoading(false);
          return toast.error("Current password is required to change password");
        }
        if (formData.newPassword.length < 6) {
          setLoading(false);
          return toast.error("New password must be at least 6 characters");
        }
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      // Send update request
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

        // Update authUser in localStorage
        auth.user = updatedUser;
        localStorage.setItem("authUser", JSON.stringify(auth));

        // Update parent component state
        setUser(updatedUser);

        // Reset form state for password fields only
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
        setAvatarFile(null);

        // Show success message
        setSuccess("Profile updated successfully!");
        toast.success("Profile updated successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorMsg = res.data.message || "Failed to update profile";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || "Server error";
      setError(errorMsg);
      toast.error(errorMsg);
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
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardBody>
        <CardTitle className="mb-4 d-flex align-items-center">
          <h4 className="mb-0">Edit Profile</h4>
          <Badge color="info" className="ms-2 text-capitalize">
            {user.role}
          </Badge>
        </CardTitle>

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Basic Information Section */}
            <Col lg="12">
              <h5 className="mb-3 text-primary">Basic Information</h5>
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                placeholder="Enter your full name"
                onChange={handleInputChange}
                invalid={!formData.name.trim()}
              />
              {!formData.name.trim() && (
                <FormFeedback>Name is required</FormFeedback>
              )}
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleInputChange}
                invalid={!formData.email.trim()}
              />
              {!formData.email.trim() && (
                <FormFeedback>Email is required</FormFeedback>
              )}
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                placeholder="+1 (555) 456-7890"
                onChange={handleInputChange}
              />
              <div className="form-text">
                Optional: Include country code
              </div>
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                placeholder="City, State/Country"
                onChange={handleInputChange}
              />
            </Col>

            <Col lg="12" className="mb-3">
              <Label for="bio">Bio / About Me</Label>
              <Input
                id="bio"
                name="bio"
                type="textarea"
                rows="3"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your experience, and expertise..."
              />
            </Col>

            {/* Avatar Upload Section */}
            <Col lg="12">
              <h5 className="mb-3 text-primary">Profile Avatar</h5>
            </Col>

            <Col lg="10" className="mb-3">
              <Label for="avatar">Upload New Avatar</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <div className="form-text">
                Max 5MB. Supported: JPG, PNG, GIF, WebP
              </div>
            </Col>

            <Col lg="2" className="mb-3">
              <div className="d-flex justify-content-center mt-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar preview"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: avatarFile ? "3px solid #0d6efd" : "3px solid #dee2e6",
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-secondary rounded-circle"
                    style={{
                      width: 80,
                      height: 80,
                    }}
                  >
                    <span className="text-white fw-bold fs-4">
                      {formData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                {avatarFile && (
                  <Badge color="primary" className="ms-2 align-self-start">
                    New
                  </Badge>
                )}
              </div>
            </Col>

            {/* Website Section */}
            <Col lg="12">
              <h5 className="mb-3 text-primary">Website</h5>
            </Col>

            <Col lg="12" className="mb-3">
              <Label for="website">Personal Website</Label>
              <InputGroup>
                <InputGroupText>
                  <Globe />
                </InputGroupText>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  placeholder="https://yourwebsite.com"
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Col>

            {/* Expertise Section */}
            <Col lg="12">
              <h5 className="mb-3 text-primary">Expertise Areas</h5>
            </Col>

            <Col lg="12" className="mb-3">
              <div className="d-flex gap-2 mb-2">
                <Input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add expertise (e.g., React, Node.js, TypeScript)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addExpertise())}
                />
                <Button color="secondary" type="button" onClick={addExpertise}>
                  Add
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {formData.expertise.map((item, index) => (
                  <Badge
                    key={index}
                    color="info"
                    pill
                    className="p-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => removeExpertise(index)}
                  >
                    {item} ✕
                  </Badge>
                ))}
                {formData.expertise.length === 0 && (
                  <span className="text-muted">No expertise added yet</span>
                )}
              </div>
            </Col>

            {/* Social Links Section */}
            <Col lg="12">
              <h5 className="mb-3 text-primary">Social Media Links</h5>
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="facebook">Facebook</Label>
              <InputGroup>
                <InputGroupText>
                  <Facebook />
                </InputGroupText>
                <Input
                  id="facebook"
                  name="social.facebook"
                  type="url"
                  value={formData.socialLinks.facebook}
                  placeholder="https://facebook.com/username"
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="twitter">Twitter / X</Label>
              <InputGroup>
                <InputGroupText>
                  <Twitter />
                </InputGroupText>
                <Input
                  id="twitter"
                  name="social.twitter"
                  type="url"
                  value={formData.socialLinks.twitter}
                  placeholder="https://twitter.com/username"
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="linkedin">LinkedIn</Label>
              <InputGroup>
                <InputGroupText>
                  <Linkedin />
                </InputGroupText>
                <Input
                  id="linkedin"
                  name="social.linkedin"
                  type="url"
                  value={formData.socialLinks.linkedin}
                  placeholder="https://linkedin.com/in/username"
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="github">GitHub</Label>
              <InputGroup>
                <InputGroupText>
                  <Github />
                </InputGroupText>
                <Input
                  id="github"
                  name="social.github"
                  type="url"
                  value={formData.socialLinks.github}
                  placeholder="https://github.com/username"
                  onChange={handleInputChange}
                />
              </InputGroup>
            </Col>

            {/* Password Change Section */}
            <Col lg="12">
              <h5 className="mb-3 text-primary">Change Password</h5>
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="currentPassword">Current Password</Label>
              <InputGroup>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={formData.currentPassword}
                  placeholder="Enter current password"
                  onChange={handleInputChange}
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
            </Col>

            <Col lg="6" className="mb-3">
              <Label for="newPassword">New Password</Label>
              <InputGroup>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  value={formData.newPassword}
                  placeholder="Enter new password"
                  onChange={handleInputChange}
                />
                <InputGroupText
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeSlash /> : <Eye />}
                </InputGroupText>
              </InputGroup>
              <div className="form-text">
                Minimum 6 characters. Leave blank to keep unchanged.
              </div>
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button
              color="primary"
              type="submit"
              className="w-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Updating Profile...
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