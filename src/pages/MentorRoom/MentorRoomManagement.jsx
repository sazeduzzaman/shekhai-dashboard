import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  Save,
  RefreshCw,
  Trash2,
  Upload,
  Plus,
  Minus,
  CheckCircle,
  X,
  Eye,
  Edit,
  Image as ImageIcon,
  Link,
  Star,
  BookOpen,
  Target,
  Award,
  Users,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "http://localhost:8080/api/v1/mentor-room";

// Function to convert blob to base64 for permanent storage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Function to check if string is a base64 image
const isBase64Image = (str) => {
  return str && str.startsWith("data:image/");
};

// Memoized InputField component
const InputField = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
    icon: Icon,
    className = "",
  }) => (
    <div className="mb-3">
      <label className="form-label d-flex align-items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-secondary" />}
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={4}
          className={`form-control ${className}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`form-control ${className}`}
        />
      )}
    </div>
  ),
);

InputField.displayName = "InputField";

// Memoized ImageUploadField component
const ImageUploadField = memo(
  ({
    label,
    value,
    onTextChange,
    onFileUpload,
    field,
    placeholder = "Enter image URL",
    isLoading,
    onRemove,
  }) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(value);

    // Update preview when value changes
    useEffect(() => {
      setPreviewUrl(value);
    }, [value]);

    const handleFileSelect = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      onFileUpload(field, file);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const handleRemoveImage = () => {
      if (onRemove) {
        onRemove(field);
      }
    };

    return (
      <div className="mb-4">
        <label className="form-label d-flex align-items-center gap-2">
          <ImageIcon className="h-4 w-4 text-secondary" />
          {label}
        </label>
        <div className="d-flex gap-3">
          {previewUrl && (
            <div className="flex-shrink-0 position-relative">
              <div
                className="position-relative"
                style={{ width: "100px", height: "100px" }}
              >
                <img
                  src={previewUrl}
                  alt={label}
                  className="w-100 h-100 object-fit-cover rounded border"
                  style={{ objectFit: "cover" }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="position-absolute top-0 end-0 translate-middle btn btn-sm btn-danger rounded-circle"
                  style={{ width: "24px", height: "24px", padding: 0 }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
          <div className="flex-grow-1">
            <div className="mb-2">
              <input
                type="text"
                value={value}
                onChange={onTextChange}
                placeholder={placeholder}
                className="form-control"
              />
            </div>
            <div className="d-flex gap-2">
              <div className="position-relative flex-grow-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                  style={{ zIndex: 2 }}
                />
                <button
                  type="button"
                  className={`btn w-100 ${isLoading ? "btn-light text-muted" : "btn-outline-primary"}`}
                  disabled={isLoading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isLoading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </span>
                  )}
                </button>
              </div>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    if (value.startsWith("http") || value.startsWith("/")) {
                      window.open(value, "_blank");
                    }
                  }}
                  className="btn btn-outline-secondary"
                  title="View Image"
                  disabled={
                    !value ||
                    (!value.startsWith("http") &&
                      !value.startsWith("/") &&
                      !isBase64Image(value))
                  }
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
            </div>
            <small className="text-muted d-block mt-2">
              Supported: JPG, PNG, GIF, WebP • Max: 5MB
              {isBase64Image(value) && " • Stored as Base64"}
            </small>
          </div>
        </div>
      </div>
    );
  },
);

ImageUploadField.displayName = "ImageUploadField";

// Memoized FormSection component
const FormSection = memo(
  ({ children, title, icon: Icon, color = "primary" }) => (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white border-bottom d-flex align-items-center py-3">
        <div className={`p-2 rounded bg-${color} bg-opacity-10 me-3`}>
          <Icon className={`h-5 w-5 text-${color}`} />
        </div>
        <h3 className="h5 mb-0 fw-semibold text-dark">{title}</h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  ),
);

FormSection.displayName = "FormSection";

// Memoized IconItem component
const IconItem = memo(
  ({ icon, index, onNameChange, onIconChange, onRemove, canRemove }) => (
    <div className="col-12">
      <div className="card border">
        <div className="card-body p-3">
          <div className="row align-items-center">
            <div className="col-md-5 mb-2 mb-md-0">
              <label className="form-label small text-muted mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={icon.name}
                onChange={onNameChange} // Use directly, it's already (e) => handler
                placeholder="e.g., Career Strategy"
                className="form-control form-control-sm"
                required
              />
            </div>
            <div className="col-md-5 mb-2 mb-md-0">
              <label className="form-label small text-muted mb-1">
                Icon URL
              </label>
              <input
                type="text"
                value={icon.icon}
                onChange={onIconChange} // Use directly, it's already (e) => handler
                placeholder="e.g., career-strategy.svg"
                className="form-control form-control-sm"
                required
              />
            </div>
            <div className="col-md-2 text-end">
              {canRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="btn btn-outline-danger btn-sm"
                  title="Remove"
                >
                  <Minus className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
);

IconItem.displayName = "IconItem";

const MentorRoomManagement = () => {
  const [formData, setFormData] = useState({
    title: "",
    badge: "Premium",
    short_description: "",
    small_image: "",
    banner_image: "",
    section_one: {
      title: "",
      description: "",
      instructor_name: "",
      instructor_rating: 4.5,
      instructor_link: "",
    },
    section_two: {
      box_title: "",
      box_sub_title: "",
      icons: [{ name: "", icon: "" }],
    },
    cta_section: {
      title: "",
      sub_title: "",
      btn_link: "",
      right_img: "",
    },
    section_three: {
      left_img: "",
      title: "",
      description_title: "",
      btn_link: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setFetching(true);
    try {
      const response = await fetch(API_BASE_URL);
      const result = await response.json();

      if (result.success && result.data) {
        // Convert any existing blob URLs to data URLs if they're still blobs
        const processedData = { ...result.data };

        // Helper function to check and convert blob URLs
        const processImageField = (field) => {
          if (field && typeof field === "string" && field.startsWith("blob:")) {
            // If it's a blob URL, clear it (can't restore blobs)
            return "";
          }
          return field;
        };

        // Process all image fields
        processedData.small_image = processImageField(
          processedData.small_image,
        );
        processedData.banner_image = processImageField(
          processedData.banner_image,
        );
        processedData.cta_section.right_img = processImageField(
          processedData.cta_section.right_img,
        );
        processedData.section_three.left_img = processImageField(
          processedData.section_three.left_img,
        );

        setFormData(processedData);
        setIsEditing(true);
        toast.success("Data loaded successfully!");
      }
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Fetch error:", error);
    } finally {
      setFetching(false);
    }
  };

  // Stable event handlers
  const handleInputChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleNestedChange = useCallback(
    (parent, field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]:
            field === "instructor_rating" ? parseFloat(value) || 0 : value,
        },
      }));
    },
    [],
  );

  // Change these handlers back to curried functions
  const handleIconNameChange = useCallback(
    (index) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        section_two: {
          ...prev.section_two,
          icons: prev.section_two.icons.map((icon, i) =>
            i === index ? { ...icon, name: value } : icon,
          ),
        },
      }));
    },
    [],
  );

  const handleIconUrlChange = useCallback(
    (index) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        section_two: {
          ...prev.section_two,
          icons: prev.section_two.icons.map((icon, i) =>
            i === index ? { ...icon, icon: value } : icon,
          ),
        },
      }));
    },
    [],
  );

  const addIcon = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      section_two: {
        ...prev.section_two,
        icons: [...prev.section_two.icons, { name: "", icon: "" }],
      },
    }));
  }, []);

  const removeIcon = useCallback(
    (index) => {
      if (formData.section_two.icons.length > 1) {
        setFormData((prev) => ({
          ...prev,
          section_two: {
            ...prev.section_two,
            icons: prev.section_two.icons.filter((_, i) => i !== index),
          },
        }));
      }
    },
    [formData.section_two.icons.length],
  );

  // FIXED: Handle text input change for nested image fields
  const handleImageTextChange = useCallback(
    (path) => (e) => {
      const value = e.target.value;

      if (path.includes(".")) {
        // Handle nested paths like 'cta_section.right_img'
        const [parent, child] = path.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else {
        // Handle top-level paths
        setFormData((prev) => ({
          ...prev,
          [path]: value,
        }));
      }
    },
    [],
  );

  // FIXED: Handle file upload for all image fields
  const handleImageFileUpload = useCallback(async (field, file) => {
    setImageUploading(field);

    try {
      // Convert file to base64 for permanent storage
      const base64Image = await fileToBase64(file);

      if (field.includes(".")) {
        // Handle nested paths like 'cta_section.right_img'
        const [parent, child] = field.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: base64Image,
          },
        }));
      } else {
        // Handle top-level paths
        setFormData((prev) => ({
          ...prev,
          [field]: base64Image,
        }));
      }

      toast.success("Image uploaded and stored successfully!");
    } catch (error) {
      console.error("Error converting image:", error);
      toast.error("Failed to upload image");
    } finally {
      setImageUploading(null);
    }
  }, []);

  // FIXED: Handle image removal for all fields
  const handleRemoveImage = useCallback((field) => {
    if (field.includes(".")) {
      // Handle nested paths like 'cta_section.right_img'
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: "",
        },
      }));
    } else {
      // Handle top-level paths
      setFormData((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
    toast.success("Image removed");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission
      const dataToSubmit = { ...formData };

      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          isEditing ? "Data updated successfully!" : "Data saved successfully!",
        );
        setIsEditing(true);
        setFormData(result.data);
      } else {
        if (result.errors) {
          result.errors.forEach((error) => {
            toast.error(`${error.param}: ${error.msg}`);
          });
        } else {
          toast.error(result.message || "Failed to save data");
        }
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Data updated successfully!");
        setFormData(result.data);
      } else {
        toast.error(result.message || "Failed to update data");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all data? This will reset to defaults.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Data deleted successfully!");
        setFormData({
          title: "",
          badge: "Premium",
          short_description: "",
          small_image: "",
          banner_image: "",
          section_one: {
            title: "",
            description: "",
            instructor_name: "",
            instructor_rating: 4.5,
            instructor_link: "",
          },
          section_two: {
            box_title: "",
            box_sub_title: "",
            icons: [{ name: "", icon: "" }],
          },
          cta_section: {
            title: "",
            sub_title: "",
            btn_link: "",
            right_img: "",
          },
          section_three: {
            left_img: "",
            title: "",
            description_title: "",
            btn_link: "",
          },
        });
        setIsEditing(false);
      } else {
        toast.error(result.message || "Failed to delete data");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Settings, color: "primary" },
    { id: "instructor", label: "Instructor", icon: Users, color: "success" },
    { id: "skills", label: "Skills & Icons", icon: Award, color: "warning" },
    { id: "cta", label: "Call to Action", icon: Target, color: "danger" },
    { id: "methodology", label: "Methodology", icon: BookOpen, color: "info" },
    { id: "preview", label: "Preview", icon: Eye, color: "dark" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <>
            <FormSection
              title="Basic Information"
              icon={Settings}
              color="primary"
            >
              <div className="row">
                <div className="col-md-6">
                  <InputField
                    label="Page Title"
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    placeholder="Expert Mentor Program"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label d-flex align-items-center gap-2">
                      <Award className="h-4 w-4 text-secondary" />
                      Badge <span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      value={formData.badge}
                      onChange={handleInputChange("badge")}
                      className="form-select"
                      required
                    >
                      <option value="Premium">Premium</option>
                      <option value="Pro">Pro</option>
                      <option value="Elite">Elite</option>
                      <option value="Basic">Basic</option>
                      <option value="Featured">Featured</option>
                    </select>
                  </div>
                </div>
              </div>

              <InputField
                label="Short Description"
                value={formData.short_description}
                onChange={handleInputChange("short_description")}
                type="textarea"
                placeholder="Brief description of the mentor program..."
                required
              />

              <div className="row">
                <div className="col-md-6">
                  <ImageUploadField
                    label="Small Image"
                    value={formData.small_image}
                    onTextChange={handleImageTextChange("small_image")}
                    onFileUpload={handleImageFileUpload}
                    field="small_image"
                    placeholder="Enter image URL or upload"
                    isLoading={imageUploading === "small_image"}
                    onRemove={handleRemoveImage}
                  />
                </div>
                <div className="col-md-6">
                  <ImageUploadField
                    label="Banner Image"
                    value={formData.banner_image}
                    onTextChange={handleImageTextChange("banner_image")}
                    onFileUpload={handleImageFileUpload}
                    field="banner_image"
                    placeholder="Enter image URL or upload"
                    isLoading={imageUploading === "banner_image"}
                    onRemove={handleRemoveImage}
                  />
                </div>
              </div>
            </FormSection>
          </>
        );

      case "instructor":
        return (
          <FormSection
            title="Instructor Information"
            icon={Users}
            color="success"
          >
            <InputField
              label="Section Title"
              value={formData.section_one.title}
              onChange={handleNestedChange("section_one", "title")}
              placeholder="Meet Your Mentor"
              required
              icon={Edit}
            />

            <InputField
              label="Section Description"
              value={formData.section_one.description}
              onChange={handleNestedChange("section_one", "description")}
              type="textarea"
              placeholder="Detailed description about the instructor..."
              required
              icon={BookOpen}
            />

            <div className="row">
              <div className="col-md-4">
                <InputField
                  label="Instructor Name"
                  value={formData.section_one.instructor_name}
                  onChange={handleNestedChange(
                    "section_one",
                    "instructor_name",
                  )}
                  placeholder="Sarah Johnson"
                  required
                  icon={Users}
                />
              </div>
              <div className="col-md-4">
                <InputField
                  label="Instructor Rating (0-5)"
                  value={formData.section_one.instructor_rating}
                  onChange={handleNestedChange(
                    "section_one",
                    "instructor_rating",
                  )}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.9"
                  required
                  icon={Star}
                />
              </div>
              <div className="col-md-4">
                <InputField
                  label="Instructor Profile Link"
                  value={formData.section_one.instructor_link}
                  onChange={handleNestedChange(
                    "section_one",
                    "instructor_link",
                  )}
                  placeholder="/mentor/sarah-johnson"
                  required
                  icon={Link}
                />
              </div>
            </div>
          </FormSection>
        );

      case "skills":
        return (
          <FormSection title="Skills & Icons" icon={Award} color="warning">
            <div className="row mb-4">
              <div className="col-md-6">
                <InputField
                  label="Box Title"
                  value={formData.section_two.box_title}
                  onChange={handleNestedChange("section_two", "box_title")}
                  placeholder="What You'll Master"
                  required
                  icon={Target}
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Box Sub Title"
                  value={formData.section_two.box_sub_title}
                  onChange={handleNestedChange("section_two", "box_sub_title")}
                  placeholder="Comprehensive skill development"
                  required
                  icon={BookOpen}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <label className="form-label d-flex align-items-center gap-2">
                  <Award className="h-4 w-4 text-secondary" />
                  Skills & Icons <span className="text-danger ms-1">*</span>
                </label>
                <button
                  type="button"
                  onClick={addIcon}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </button>
              </div>

              <div className="row g-3">
                {formData.section_two.icons.map((icon, index) => (
                  <IconItem
                    key={index}
                    icon={icon}
                    index={index}
                    onNameChange={handleIconNameChange(index)} // This is correct
                    onIconChange={handleIconUrlChange(index)} // This is correct
                    onRemove={removeIcon}
                    canRemove={formData.section_two.icons.length > 1}
                  />
                ))}
              </div>
            </div>
          </FormSection>
        );

      case "cta":
        return (
          <FormSection
            title="Call to Action Section"
            icon={Target}
            color="danger"
          >
            <InputField
              label="CTA Title"
              value={formData.cta_section.title}
              onChange={handleNestedChange("cta_section", "title")}
              placeholder="Ready to Transform Your Career?"
              required
              icon={Target}
            />

            <InputField
              label="CTA Sub Title"
              value={formData.cta_section.sub_title}
              onChange={handleNestedChange("cta_section", "sub_title")}
              placeholder="Limited spots available for personalized mentorship"
              required
              icon={BookOpen}
            />

            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="CTA Button Link"
                  value={formData.cta_section.btn_link}
                  onChange={handleNestedChange("cta_section", "btn_link")}
                  placeholder="/mentor-room/apply"
                  required
                  icon={Link}
                />
              </div>
              <div className="col-md-6">
                <ImageUploadField
                  label="CTA Right Image"
                  value={formData.cta_section.right_img}
                  onTextChange={handleImageTextChange("cta_section.right_img")}
                  onFileUpload={handleImageFileUpload}
                  field="cta_section.right_img"
                  placeholder="Enter image URL or upload"
                  isLoading={imageUploading === "cta_section.right_img"}
                  onRemove={handleRemoveImage}
                />
              </div>
            </div>
          </FormSection>
        );

      case "methodology":
        return (
          <FormSection title="Methodology Section" icon={BookOpen} color="info">
            <div className="row">
              <div className="col-md-6">
                <ImageUploadField
                  label="Left Image"
                  value={formData.section_three.left_img}
                  onTextChange={handleImageTextChange("section_three.left_img")}
                  onFileUpload={handleImageFileUpload}
                  field="section_three.left_img"
                  placeholder="Enter image URL or upload"
                  isLoading={imageUploading === "section_three.left_img"}
                  onRemove={handleRemoveImage}
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Section Title"
                  value={formData.section_three.title}
                  onChange={handleNestedChange("section_three", "title")}
                  placeholder="Why Our Mentorship Works"
                  required
                  icon={Edit}
                />

                <InputField
                  label="Description Title"
                  value={formData.section_three.description_title}
                  onChange={handleNestedChange(
                    "section_three",
                    "description_title",
                  )}
                  placeholder="Proven Success Methodology"
                  required
                  icon={BookOpen}
                />

                <InputField
                  label="Button Link"
                  value={formData.section_three.btn_link}
                  onChange={handleNestedChange("section_three", "btn_link")}
                  placeholder="/mentor-room/success-stories"
                  required
                  icon={Link}
                />
              </div>
            </div>
          </FormSection>
        );

      case "preview":
        return (
          <FormSection title="Data Preview" icon={Eye} color="dark">
            <div className="card">
              <div className="card-body bg-light">
                <div style={{ maxHeight: "400px", overflow: "auto" }}>
                  <pre
                    className="mb-0 text-muted"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {JSON.stringify(
                      {
                        ...formData,
                        small_image: formData.small_image
                          ? formData.small_image.startsWith("data:image/")
                            ? "data:image/... [BASE64_IMAGE_DATA]"
                            : formData.small_image
                          : "",
                        banner_image: formData.banner_image
                          ? formData.banner_image.startsWith("data:image/")
                            ? "data:image/... [BASE64_IMAGE_DATA]"
                            : formData.banner_image
                          : "",
                        cta_section: {
                          ...formData.cta_section,
                          right_img: formData.cta_section.right_img
                            ? formData.cta_section.right_img.startsWith(
                                "data:image/",
                              )
                              ? "data:image/... [BASE64_IMAGE_DATA]"
                              : formData.cta_section.right_img
                            : "",
                        },
                        section_three: {
                          ...formData.section_three,
                          left_img: formData.section_three.left_img
                            ? formData.section_three.left_img.startsWith(
                                "data:image/",
                              )
                              ? "data:image/... [BASE64_IMAGE_DATA]"
                              : formData.section_three.left_img
                            : "",
                        },
                      },
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            </div>
            <div className="alert alert-info mt-3 d-flex align-items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              This is a preview of the data that will be saved to the database.
            </div>
          </FormSection>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid">
          <button
            className="btn btn-light me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>

          <div className="navbar-brand">
            <h1 className="h4 mb-0 fw-bold text-dark">Mentor Room Manager</h1>
            <small className="text-muted">
              Single document management system
            </small>
          </div>

          <div className="d-flex align-items-center ms-auto">
            <button
              onClick={fetchData}
              disabled={fetching}
              className="btn btn-outline-secondary me-3 d-flex align-items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${fetching ? "animate-spin" : ""}`}
              />
              {fetching ? "Loading..." : "Refresh"}
            </button>

            <div
              className={`badge d-flex align-items-center gap-2 ${isEditing ? "bg-success bg-opacity-10 text-success" : "bg-warning bg-opacity-10 text-warning"}`}
            >
              <div
                className={`rounded-circle ${isEditing ? "bg-success" : "bg-warning"}`}
                style={{ width: "8px", height: "8px" }}
              ></div>
              <span className="fw-medium">
                {isEditing ? "Document Exists" : "No Data"}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          {sidebarOpen && (
            <div className="col-lg-3 col-xl-2 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h6 className="text-uppercase text-muted mb-3 fw-semibold">
                    Navigation
                  </h6>
                  <nav className="nav flex-column gap-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-link text-start d-flex align-items-center gap-3 py-2 rounded ${activeTab === tab.id ? `active bg-${tab.color} bg-opacity-10 text-${tab.color} border-start border-${tab.color} border-3` : "text-dark"}`}
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                        <ChevronRight className="h-3 w-3 ms-auto" />
                      </button>
                    ))}
                  </nav>

                  <hr className="my-4" />

                  <h6 className="text-uppercase text-muted mb-3 fw-semibold">
                    Actions
                  </h6>
                  <div className="d-grid gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={loading || !isEditing}
                      className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete All Data
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm("Reset all fields?")) {
                          setFormData({
                            title: "",
                            badge: "Premium",
                            short_description: "",
                            small_image: "",
                            banner_image: "",
                            section_one: {
                              title: "",
                              description: "",
                              instructor_name: "",
                              instructor_rating: 4.5,
                              instructor_link: "",
                            },
                            section_two: {
                              box_title: "",
                              box_sub_title: "",
                              icons: [{ name: "", icon: "" }],
                            },
                            cta_section: {
                              title: "",
                              sub_title: "",
                              btn_link: "",
                              right_img: "",
                            },
                            section_three: {
                              left_img: "",
                              title: "",
                              description_title: "",
                              btn_link: "",
                            },
                          });
                          setIsEditing(false);
                        }
                      }}
                      className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Reset Form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className={sidebarOpen ? "col-lg-9 col-xl-10" : "col-12"}>
            <form onSubmit={handleSubmit}>
              {renderTabContent()}

              {/* Action Buttons */}
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary bg-opacity-10 p-2 rounded">
                          <Save className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h5 className="mb-1 fw-semibold">Save Changes</h5>
                          <p className="text-muted mb-0 small">
                            {isEditing
                              ? "Update the existing document"
                              : "Create a new document"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                        {isEditing && (
                          <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={loading}
                            className="btn btn-primary d-flex align-items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {loading ? "Updating..." : "Update Only"}
                          </button>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-success d-flex align-items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          {loading
                            ? "Saving..."
                            : isEditing
                              ? "Save Changes"
                              : "Create Document"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Stats Cards */}
            <div className="row mt-4 g-3">
              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-muted mb-1 small">Status</p>
                        <h5 className="mb-0 fw-semibold">
                          {isEditing ? "Data Exists" : "Empty Database"}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded">
                        <Award className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="text-muted mb-1 small">Badge</p>
                        <h5 className="mb-0 fw-semibold">{formData.badge}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-info bg-opacity-10 p-2 rounded">
                        <Users className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="text-muted mb-1 small">Skills Count</p>
                        <h5 className="mb-0 fw-semibold">
                          {formData.section_two.icons.length}
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorRoomManagement;
