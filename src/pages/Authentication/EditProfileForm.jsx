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
import { Eye, EyeSlash } from "react-bootstrap-icons"; // react-bootstrap-icons
import toast from "react-hot-toast"; // <-- import toast

const EditProfileForm = ({ user, setUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required!");
    if (!email.trim()) return toast.error("Email is required!");

    setLoading(true);

    try {
      const auth = JSON.parse(localStorage.getItem("authUser"));
      const token = auth?.token;
      if (!token) throw new Error("You are not authenticated");

      const payload = { name, email, bio, avatarUrl };
      if (newPassword) {
        if (!currentPassword) {
          setLoading(false);
          return toast.error("Current password is required to change password");
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await axios.put(
        "http://localhost:8080/api/v1/users/me",
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
        auth.user = updatedUser;
        localStorage.setItem("authUser", JSON.stringify(auth));
        setUser(updatedUser);

        toast.success("Profile updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
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

  return (
    <Card className="shadow-sm">
      <CardBody>
        <CardTitle className="mb-4">Edit Or Update Profile</CardTitle>

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

            <div className="col-lg-12 mb-3">
              <Label>Avatar URL</Label>
              <Input
                type="text"
                value={avatarUrl}
                placeholder="https://example.com/avatar.jpg"
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>

            <div className="col-lg-6 mb-3">
              <Label>Current Password</Label>
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
            </div>

            <div className="col-lg-6 mb-3">
              <Label>New Password</Label>
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
          </div>

          <div className="text-end mt-3">
            <Button
              color="primary"
              type="submit"
              className="w-md"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default EditProfileForm;
