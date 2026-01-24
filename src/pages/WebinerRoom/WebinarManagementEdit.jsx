import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Form,
  Input,
  Label,
  FormGroup,
  Alert,
  Spinner,
  CardImg
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://shekhai-server.onrender.com/api/v1";

const WebinarManagementEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    badge: "webinar",
    shortDescription: "",
    longDescription: "",
    startTime: "",
    endTime: "",
    thumbnail: null,
    bannerImage: null,
    instructorAvatar: null,
    price: 0,
    isFree: true,
    isFeatured: false,
    status: "draft",
    maxParticipants: 100,
    instructorName: "",
    instructorTitle: "",
    tags: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({
    thumbnail: null,
    bannerImage: null,
    instructorAvatar: null
  });
  const [existingImages, setExistingImages] = useState({
    thumbnail: "",
    bannerImage: "",
    instructorAvatar: ""
  });

  // Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Fetch webinar data for editing
  useEffect(() => {
    const fetchWebinar = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/webinars/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.success) {
          const webinar = result.data;
          
          // Store existing image URLs
          setExistingImages({
            thumbnail: webinar.thumbnail || "",
            bannerImage: webinar.bannerImage || "",
            instructorAvatar: webinar.instructor?.avatar || ""
          });

          // Transform the data for the form
          setFormData({
            title: webinar.title || "",
            badge: webinar.badge || "webinar",
            shortDescription: webinar.shortDescription || "",
            longDescription: webinar.longDescription || "",
            startTime: webinar.startTime ? webinar.startTime.slice(0, 16) : "",
            endTime: webinar.endTime ? webinar.endTime.slice(0, 16) : "",
            thumbnail: null, // We'll handle files separately
            bannerImage: null,
            instructorAvatar: null,
            price: webinar.price || 0,
            isFree: webinar.isFree || false,
            isFeatured: webinar.isFeatured || false,
            status: webinar.status || "draft",
            maxParticipants: webinar.maxParticipants || 100,
            instructorName: webinar.instructor?.name || "",
            instructorTitle: webinar.instructor?.title || "",
            tags: webinar.tags?.join(", ") || "",
          });

          // Set image previews from existing URLs
          setImagePreviews({
            thumbnail: webinar.thumbnail || null,
            bannerImage: webinar.bannerImage || null,
            instructorAvatar: webinar.instructor?.avatar || null
          });
        } else {
          throw new Error(result.message || "Failed to load webinar");
        }
      } catch (error) {
        console.error("Error fetching webinar:", error);
        setError(error.message);
        toast.error("Failed to load webinar data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWebinar();
    }
  }, [id]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      // Update form data with file
      setFormData({
        ...formData,
        [name]: file
      });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews({
        ...imagePreviews,
        [name]: previewUrl
      });
    }
  };

  // Clear a specific image
  const clearImage = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: null
    });
    
    // Revoke the object URL to avoid memory leaks
    if (imagePreviews[fieldName] && imagePreviews[fieldName].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[fieldName]);
    }
    
    // Restore existing image or clear
    setImagePreviews({
      ...imagePreviews,
      [fieldName]: existingImages[fieldName] || null
    });
  };

  // Handle form submission (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      // Convert files to base64 if new files are selected
      let thumbnailBase64 = existingImages.thumbnail;
      let bannerImageBase64 = existingImages.bannerImage;
      let instructorAvatarBase64 = existingImages.instructorAvatar;

      if (formData.thumbnail) {
        thumbnailBase64 = await convertToBase64(formData.thumbnail);
      }
      if (formData.bannerImage) {
        bannerImageBase64 = await convertToBase64(formData.bannerImage);
      }
      if (formData.instructorAvatar) {
        instructorAvatarBase64 = await convertToBase64(formData.instructorAvatar);
      }

      // Prepare webinar data for API
      const webinarData = {
        title: formData.title,
        badge: formData.badge,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        startTime: formData.startTime,
        endTime: formData.endTime,
        thumbnail: thumbnailBase64,
        bannerImage: bannerImageBase64,
        price: Number(formData.price),
        isFree: formData.isFree,
        isFeatured: formData.isFeatured,
        status: formData.status,
        maxParticipants: Number(formData.maxParticipants),
        instructor: {
          name: formData.instructorName,
          title: formData.instructorTitle,
          avatar: instructorAvatarBase64
        },
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      console.log("Updating webinar data:", webinarData);

      const response = await fetch(`${API_BASE_URL}/webinars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webinarData),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok && result.success) {
        toast.success("Webinar updated successfully!");
        navigate("/webinar-management");
      } else {
        // Display validation errors if any
        if (result.errors) {
          const errorMessages = result.errors.join(', ');
          throw new Error(`Validation Error: ${errorMessages}`);
        }
        throw new Error(result.message || "Failed to update webinar");
      }
    } catch (error) {
      console.error("Error updating webinar:", error);
      setError(error.message);
      toast.error(error.message || "Failed to update webinar");
    } finally {
      setUpdating(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div className="text-center my-5 py-5">
            <Spinner color="primary" />
            <p className="mt-2">Loading webinar data...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        <div className="mb-4">
          <h4 className="mb-0">Edit Webinar</h4>
          <p className="text-muted">Update the webinar details</p>
        </div>

        {error && (
          <Alert color="danger" className="mb-3" isOpen={!!error} toggle={() => setError(null)}>
            <strong>Error:</strong> {error}
          </Alert>
        )}

        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg={12}>
                  <div className="mb-4">
                    <h5 className="card-title">Basic Information</h5>
                    <hr />
                  </div>
                </Col>

                <Col lg={8}>
                  <FormGroup>
                    <Label htmlFor="title" className="form-label">
                      Webinar Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="Enter webinar title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="badge" className="form-label">
                      Type
                    </Label>
                    <Input
                      type="select"
                      id="badge"
                      name="badge"
                      value={formData.badge}
                      onChange={handleInputChange}
                      disabled={updating}
                    >
                      <option value="webinar">Webinar</option>
                      <option value="workshop">Workshop</option>
                      <option value="masterclass">Masterclass</option>
                      <option value="seminar">Seminar</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="startTime" className="form-label">
                      Start Time *
                    </Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="endTime" className="form-label">
                      End Time *
                    </Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <FormGroup>
                    <Label htmlFor="shortDescription" className="form-label">
                      Short Description *
                    </Label>
                    <Input
                      id="shortDescription"
                      name="shortDescription"
                      type="textarea"
                      rows="3"
                      placeholder="Brief description (shown in lists)"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      required
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <FormGroup>
                    <Label htmlFor="longDescription" className="form-label">
                      Full Description
                    </Label>
                    <Input
                      id="longDescription"
                      name="longDescription"
                      type="textarea"
                      rows="5"
                      placeholder="Detailed description (shown on webinar page)"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      required
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <div className="mb-4 mt-4">
                    <h5 className="card-title">Pricing & Capacity</h5>
                    <hr />
                  </div>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="price" className="form-label">
                      Price (BDT)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={updating || formData.isFree}
                    />
                    <div className="form-check mt-2">
                      <Input
                        type="checkbox"
                        id="isFree"
                        name="isFree"
                        className="form-check-input"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        disabled={updating}
                      />
                      <Label className="form-check-label" htmlFor="isFree">
                        Mark as Free Webinar
                      </Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="maxParticipants" className="form-label">
                      Maximum Participants
                    </Label>
                    <Input
                      id="maxParticipants"
                      name="maxParticipants"
                      type="number"
                      min="1"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <div className="mb-4 mt-4">
                    <h5 className="card-title">Image Uploads</h5>
                    <hr />
                  </div>
                </Col>

                {/* Thumbnail Upload */}
                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="thumbnail" className="form-label">
                      Thumbnail Image
                    </Label>
                    <div className="border rounded p-3 text-center">
                      {imagePreviews.thumbnail ? (
                        <div>
                          <CardImg
                            top
                            src={imagePreviews.thumbnail}
                            alt="Thumbnail preview"
                            className="mb-2"
                            style={{ maxHeight: "150px", objectFit: "cover" }}
                          />
                          <div className="small text-muted mb-2">
                            {formData.thumbnail ? (
                              <>
                                {formData.thumbnail.name} ({formatFileSize(formData.thumbnail.size)})
                                <br />
                                <span className="text-info">New file selected</span>
                              </>
                            ) : (
                              <span className="text-success">Existing image</span>
                            )}
                          </div>
                          <div className="d-flex gap-1 justify-content-center">
                            <Label
                              htmlFor="thumbnail"
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="ri-upload-line me-1"></i> Change
                            </Label>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => clearImage('thumbnail')}
                              disabled={updating}
                            >
                              <i className="ri-delete-bin-line me-1"></i> Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-3">
                            <i className="ri-image-line display-4 text-muted"></i>
                          </div>
                          <Label
                            htmlFor="thumbnail"
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="ri-upload-line me-1"></i> Choose File
                          </Label>
                        </div>
                      )}
                      <Input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={updating}
                        className="d-none"
                      />
                      <p className="small text-muted mt-2 mb-0">
                        Recommended: 400x225px
                      </p>
                    </div>
                  </FormGroup>
                </Col>

                {/* Banner Image Upload */}
                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="bannerImage" className="form-label">
                      Banner Image
                    </Label>
                    <div className="border rounded p-3 text-center">
                      {imagePreviews.bannerImage ? (
                        <div>
                          <CardImg
                            top
                            src={imagePreviews.bannerImage}
                            alt="Banner preview"
                            className="mb-2"
                            style={{ maxHeight: "150px", objectFit: "cover" }}
                          />
                          <div className="small text-muted mb-2">
                            {formData.bannerImage ? (
                              <>
                                {formData.bannerImage.name} ({formatFileSize(formData.bannerImage.size)})
                                <br />
                                <span className="text-info">New file selected</span>
                              </>
                            ) : (
                              <span className="text-success">Existing image</span>
                            )}
                          </div>
                          <div className="d-flex gap-1 justify-content-center">
                            <Label
                              htmlFor="bannerImage"
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="ri-upload-line me-1"></i> Change
                            </Label>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => clearImage('bannerImage')}
                              disabled={updating}
                            >
                              <i className="ri-delete-bin-line me-1"></i> Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-3">
                            <i className="ri-image-2-line display-4 text-muted"></i>
                          </div>
                          <Label
                            htmlFor="bannerImage"
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="ri-upload-line me-1"></i> Choose File
                          </Label>
                        </div>
                      )}
                      <Input
                        id="bannerImage"
                        name="bannerImage"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={updating}
                        className="d-none"
                      />
                      <p className="small text-muted mt-2 mb-0">
                        Recommended: 1200x400px
                      </p>
                    </div>
                  </FormGroup>
                </Col>

                {/* Instructor Avatar Upload */}
                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="instructorAvatar" className="form-label">
                      Instructor Avatar
                    </Label>
                    <div className="border rounded p-3 text-center">
                      {imagePreviews.instructorAvatar ? (
                        <div>
                          <CardImg
                            top
                            src={imagePreviews.instructorAvatar}
                            alt="Avatar preview"
                            className="mb-2 rounded-circle"
                            style={{ 
                              maxHeight: "150px", 
                              objectFit: "cover",
                              width: "150px",
                              height: "150px"
                            }}
                          />
                          <div className="small text-muted mb-2">
                            {formData.instructorAvatar ? (
                              <>
                                {formData.instructorAvatar.name} ({formatFileSize(formData.instructorAvatar.size)})
                                <br />
                                <span className="text-info">New file selected</span>
                              </>
                            ) : (
                              <span className="text-success">Existing image</span>
                            )}
                          </div>
                          <div className="d-flex gap-1 justify-content-center">
                            <Label
                              htmlFor="instructorAvatar"
                              className="btn btn-outline-primary btn-sm"
                            >
                              <i className="ri-upload-line me-1"></i> Change
                            </Label>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => clearImage('instructorAvatar')}
                              disabled={updating}
                            >
                              <i className="ri-delete-bin-line me-1"></i> Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-3">
                            <i className="ri-user-line display-4 text-muted"></i>
                          </div>
                          <Label
                            htmlFor="instructorAvatar"
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="ri-upload-line me-1"></i> Choose File
                          </Label>
                        </div>
                      )}
                      <Input
                        id="instructorAvatar"
                        name="instructorAvatar"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={updating}
                        className="d-none"
                      />
                      <p className="small text-muted mt-2 mb-0">
                        Recommended: 200x200px
                      </p>
                    </div>
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <div className="mb-4 mt-4">
                    <h5 className="card-title">Instructor Information</h5>
                    <hr />
                  </div>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="instructorName" className="form-label">
                      Instructor Name *
                    </Label>
                    <Input
                      id="instructorName"
                      name="instructorName"
                      type="text"
                      placeholder="Enter instructor's full name"
                      value={formData.instructorName}
                      onChange={handleInputChange}
                      required
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="instructorTitle" className="form-label">
                      Instructor Title *
                    </Label>
                    <Input
                      id="instructorTitle"
                      name="instructorTitle"
                      type="text"
                      placeholder="e.g., Senior Developer, CEO, Expert"
                      value={formData.instructorTitle}
                      onChange={handleInputChange}
                      required
                      disabled={updating}
                    />
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <div className="mb-4 mt-4">
                    <h5 className="card-title">Additional Settings</h5>
                    <hr />
                  </div>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="status" className="form-label">
                      Status
                    </Label>
                    <Input
                      type="select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={updating}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </Input>
                  </FormGroup>
                </Col>

                <Col lg={6}>
                  <FormGroup>
                    <Label htmlFor="tags" className="form-label">
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      type="text"
                      placeholder="technology, programming, webinar (comma separated)"
                      value={formData.tags}
                      onChange={handleInputChange}
                      disabled={updating}
                    />
                    <small className="text-muted">
                      Separate tags with commas
                    </small>
                  </FormGroup>
                </Col>

                <Col lg={12}>
                  <div className="d-flex gap-3 mb-3">
                    <div className="form-check">
                      <Input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        className="form-check-input"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        disabled={updating}
                      />
                      <Label className="form-check-label" htmlFor="isFeatured">
                        Mark as Featured Webinar
                      </Label>
                    </div>
                  </div>
                </Col>

                <Col lg={12}>
                  <div className="d-flex justify-content-between mt-4">
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => navigate("/webinar-management")}
                      disabled={updating}
                    >
                      <i className="ri-arrow-left-line me-1"></i>
                      Back to List
                    </Button>

                    <div className="d-flex gap-2">
                      <Button
                        type="button"
                        color="warning"
                        onClick={() => window.location.reload()}
                        disabled={updating}
                      >
                        <i className="ri-refresh-line me-1"></i>
                        Reload Data
                      </Button>

                      <Button
                        type="submit"
                        color="primary"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="ri-save-line me-1"></i>
                            Update Webinar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default WebinarManagementEdit;