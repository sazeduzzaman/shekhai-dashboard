import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowLeft,
  Plus,
  Trash,
  Save,
  ChevronUp,
  ChevronDown,
  Clock,
  Award,
  Hash,
  FileText,
  Type,
  Calendar,
  CalendarCheck,
  Book,
  Tag,
} from "react-bootstrap-icons";

const API_URL = "https://shekhai-server-production.up.railway.app/api/v1";

const CreateQuiz = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    moduleId: "",
    moduleTitle: "",
    duration: 30,
    passingScore: 70,
    maxAttempts: 3,
    instructions: "",
    tags: [],
    availableFrom: new Date().toISOString().split("T")[0] + "T10:00",
    availableUntil:
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0] + "T23:59",
    scheduleType: "scheduled",
    isPublished: true,
    questions: [],
  });

  // Get auth token
  const getAuthToken = () => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      try {
        const parsed = JSON.parse(authUser);
        return parsed.token || parsed;
      } catch {
        return authUser;
      }
    }
    return null;
  };

  // Get API headers
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    const initialize = async () => {
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to create quizzes", {
          onClose: () => navigate("/login"),
        });
        return;
      }

      await fetchCourses();

      if (mode === "edit" && id) {
        await fetchQuiz();
      }
    };

    initialize();
  }, [id, mode, navigate]);

  // Fetch courses with modules
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/courses`);

      if (res.data.success) {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (user) {
          const myCourses = res.data.courses.filter(
            (course) => course.instructor._id === user.id
          );
          setCourses(myCourses);
        } else {
          setCourses(res.data.courses);
        }
      }
    } catch (err) {
      console.error("Failed to load courses:", err);
      toast.error("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch quiz data for editing
  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/quizzes/${id}`, {
        headers: getHeaders(),
      });

      const quizData = response.data.data;

      const transformedData = {
        title: quizData.title || "",
        description: quizData.description || "",
        courseId: quizData.courseId?._id || quizData.courseId || "",
        moduleId: quizData.moduleId || "",
        moduleTitle: quizData.moduleTitle || "",
        duration: quizData.duration || 30,
        passingScore: quizData.passingScore || 70,
        maxAttempts: quizData.maxAttempts || 3,
        instructions: quizData.instructions || "",
        tags: quizData.tags || [],
        availableFrom: quizData.availableFrom
          ? new Date(quizData.availableFrom).toISOString().slice(0, 16)
          : formData.availableFrom,
        availableUntil: quizData.availableUntil
          ? new Date(quizData.availableUntil).toISOString().slice(0, 16)
          : formData.availableUntil,
        scheduleType: quizData.scheduleType || "scheduled",
        isPublished: quizData.isPublished || true,
        questions: quizData.questions
          ? quizData.questions.map((q) => ({
              question: q.question || "",
              type: q.type || "single-choice",
              options: q.options
                ? q.options.map((opt) => ({
                    text: opt.text || "",
                    isCorrect: opt.isCorrect || false,
                  }))
                : [],
              correctAnswer: q.correctAnswer || "",
              points: q.points || 1,
              explanation: q.explanation || "",
            }))
          : [],
      };

      setFormData(transformedData);
      setSelectedCourse(transformedData.courseId);
      setSelectedModule(transformedData.moduleId);
      setTags(transformedData.tags);

      toast.success("Quiz loaded successfully!");
    } catch (err) {
      console.error("Failed to load quiz:", err);
      toast.error("Failed to load quiz data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get selected course details
  const getSelectedCourse = () => {
    return courses.find((c) => c._id === selectedCourse);
  };

  // Tag management
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setFormData((prev) => ({ ...prev, tags: newTags }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  // Question management
  const addQuestion = () => {
    if (formData.questions.length >= 30) {
      toast.error("Maximum 30 questions reached");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          type: "single-choice",
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
          ],
          correctAnswer: "",
          points: 1,
          explanation: "",
        },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    const questions = [...formData.questions];

    if (field === "type") {
      if (value === "single-choice" || value === "multiple-choice") {
        questions[index].options = [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
        ];
      } else if (value === "true-false") {
        questions[index].options = [];
        questions[index].correctAnswer = "true";
      } else if (value === "short-answer") {
        questions[index].options = [];
        questions[index].correctAnswer = "";
      }
    }

    questions[index][field] = value;

    if (
      field === "type" &&
      (value === "single-choice" || value === "multiple-choice")
    ) {
      const correctOption = questions[index].options.find(
        (opt) => opt.isCorrect
      );
      questions[index].correctAnswer = correctOption ? correctOption.text : "";
    }

    setFormData({ ...formData, questions });
  };

  const updateOption = (questionIndex, optionIndex, field, value) => {
    const questions = [...formData.questions];

    if (field === "isCorrect") {
      if (questions[questionIndex].type === "single-choice" && value === true) {
        questions[questionIndex].options.forEach((opt, idx) => {
          if (idx !== optionIndex) opt.isCorrect = false;
        });
      }

      if (questions[questionIndex].type === "single-choice") {
        questions[questionIndex].correctAnswer = value
          ? questions[questionIndex].options[optionIndex].text
          : "";
      } else if (questions[questionIndex].type === "multiple-choice") {
        const correctOptions = questions[questionIndex].options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt.text);
        questions[questionIndex].correctAnswer = correctOptions;
      }
    }

    questions[questionIndex].options[optionIndex][field] = value;

    if (field === "text") {
      const option = questions[questionIndex].options[optionIndex];
      if (option.isCorrect) {
        if (questions[questionIndex].type === "single-choice") {
          questions[questionIndex].correctAnswer = value;
        } else if (questions[questionIndex].type === "multiple-choice") {
          const correctOptions = questions[questionIndex].options
            .filter((opt) => opt.isCorrect)
            .map((opt) => opt.text);
          questions[questionIndex].correctAnswer = correctOptions;
        }
      }
    }

    setFormData({ ...formData, questions });
  };

  const addOption = (questionIndex) => {
    const questions = [...formData.questions];
    questions[questionIndex].options.push({
      text: "",
      isCorrect: false,
    });
    setFormData({ ...formData, questions });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const questions = [...formData.questions];
    if (questions[questionIndex].options.length > 2) {
      const removedOption = questions[questionIndex].options[optionIndex];

      questions[questionIndex].options.splice(optionIndex, 1);

      if (removedOption.isCorrect) {
        if (questions[questionIndex].type === "single-choice") {
          const newCorrectOption = questions[questionIndex].options.find(
            (opt) => opt.isCorrect
          );
          questions[questionIndex].correctAnswer = newCorrectOption
            ? newCorrectOption.text
            : "";
        } else if (questions[questionIndex].type === "multiple-choice") {
          const correctOptions = questions[questionIndex].options
            .filter((opt) => opt.isCorrect)
            .map((opt) => opt.text);
          questions[questionIndex].correctAnswer = correctOptions;
        }
      }

      setFormData({ ...formData, questions });
    }
  };

  const removeQuestion = (index) => {
    const questions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions });
  };

  const moveQuestionUp = (index) => {
    if (index === 0) return;
    const questions = [...formData.questions];
    [questions[index - 1], questions[index]] = [
      questions[index],
      questions[index - 1],
    ];
    setFormData({ ...formData, questions });
  };

  const moveQuestionDown = (index) => {
    if (index === formData.questions.length - 1) return;
    const questions = [...formData.questions];
    [questions[index], questions[index + 1]] = [
      questions[index + 1],
      questions[index],
    ];
    setFormData({ ...formData, questions });
  };

  // Form handlers
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedModule("");

    const course = courses.find((c) => c._id === courseId);
    setFormData((prev) => ({
      ...prev,
      courseId: courseId,
      moduleId: "",
      moduleTitle: "",
    }));
  };

  const handleModuleChange = (e) => {
    const moduleId = e.target.value;
    setSelectedModule(moduleId);

    const course = getSelectedCourse();
    const module = course?.modules?.find((m) => m._id === moduleId);

    setFormData((prev) => ({
      ...prev,
      moduleId: moduleId,
      moduleTitle: module?.title || "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Quiz title is required");
      return false;
    }

    if (!formData.courseId) {
      toast.error("Please select a course");
      return false;
    }

    if (!formData.availableFrom || !formData.availableUntil) {
      toast.error("Start and end dates are required");
      return false;
    }

    const startDate = new Date(formData.availableFrom);
    const endDate = new Date(formData.availableUntil);

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return false;
    }

    if (formData.questions.length === 0) {
      toast.error("At least one question is required");
      return false;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];

      if (!q.question.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return false;
      }

      if (!q.type) {
        toast.error(`Question ${i + 1}: Question type is required`);
        return false;
      }

      if (
        !q.correctAnswer ||
        (typeof q.correctAnswer === "string" && !q.correctAnswer.trim())
      ) {
        toast.error(`Question ${i + 1}: Correct answer is required`);
        return false;
      }

      if (q.type === "single-choice" || q.type === "multiple-choice") {
        if (!q.options || q.options.length < 2) {
          toast.error(`Question ${i + 1}: At least 2 options are required`);
          return false;
        }

        const hasCorrect = q.options.some((opt) => opt.isCorrect);
        if (!hasCorrect) {
          toast.error(`Question ${i + 1}: Select at least one correct option`);
          return false;
        }

        const hasEmptyOption = q.options.some((opt) => !opt.text.trim());
        if (hasEmptyOption) {
          toast.error(`Question ${i + 1}: All options must have text`);
          return false;
        }
      }
    }

    return true;
  };

  // Prepare data for submission
  const prepareSubmissionData = () => {
    const submissionData = {
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      moduleId: formData.moduleId || null,
      moduleTitle: formData.moduleTitle || null,
      duration: parseInt(formData.duration),
      passingScore: parseInt(formData.passingScore),
      maxAttempts: parseInt(formData.maxAttempts),
      instructions: formData.instructions,
      tags: formData.tags,
      availableFrom: new Date(formData.availableFrom).toISOString(),
      availableUntil: new Date(formData.availableUntil).toISOString(),
      scheduleType: formData.scheduleType,
      isPublished: formData.isPublished,
      questions: formData.questions.map((q) => {
        const questionData = {
          question: q.question,
          type: q.type,
          correctAnswer: q.correctAnswer,
          points: parseInt(q.points) || 1,
          explanation: q.explanation || "",
        };

        if (q.type === "single-choice" || q.type === "multiple-choice") {
          questionData.options = q.options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect || false,
          }));
        }

        return questionData;
      }),
    };

    return submissionData;
  };

  // Helper function to publish quiz
  const publishQuiz = async (quizId) => {
    try {
      console.log(`📢 Publishing quiz ${quizId}...`);
      const response = await axios.patch(
        `${API_URL}/quizzes/${quizId}/publish`,
        {},
        { headers: getHeaders() }
      );
      console.log("✅ Quiz published:", response.data);
      return response.data;
    } catch (err) {
      console.error("❌ Publish failed:", err);
      throw err;
    }
  };

  // Form submission - FIXED VERSION
  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const submissionData = prepareSubmissionData();

      console.log(
        "📤 Submitting quiz data:",
        JSON.stringify(submissionData, null, 2)
      );

      let response;
      let quizId;

      if (mode === "create") {
        // Step 1: Create the quiz
        response = await axios.post(`${API_URL}/quizzes`, submissionData, {
          headers: getHeaders(),
        });
        console.log("✅ Quiz created:", response.data);

        quizId = response.data.data._id;

        // Step 2: If user wants it published, call publish endpoint
        if (formData.isPublished) {
          try {
            await publishQuiz(quizId);
            toast.success("🎉 Quiz created and published successfully!");
          } catch (publishErr) {
            console.warn(
              "⚠️ Could not publish quiz, but it was created:",
              publishErr
            );
            toast.success(
              "🎉 Quiz created successfully! (Could not publish automatically)"
            );
          }
        } else {
          toast.success("🎉 Quiz created as draft successfully!");
        }

        setTimeout(() => navigate("/quizzes"), 1500);
      } else {
        // For edit mode
        response = await axios.put(`${API_URL}/quizzes/${id}`, submissionData, {
          headers: getHeaders(),
        });
        console.log("✅ Quiz updated:", response.data);

        quizId = id;

        // Step 2: If user wants it published, call publish endpoint
        if (formData.isPublished) {
          try {
            await publishQuiz(quizId);
            toast.success("🎉 Quiz updated and published successfully!");
          } catch (publishErr) {
            console.warn(
              "⚠️ Could not publish quiz, but it was updated:",
              publishErr
            );
            toast.success(
              "🎉 Quiz updated successfully! (Could not publish automatically)"
            );
          }
        } else {
          // If user unchecked publish, try to unpublish
          try {
            await axios.patch(
              `${API_URL}/quizzes/${quizId}/unpublish`,
              {},
              { headers: getHeaders() }
            );
            toast.success("🎉 Quiz updated and unpublished (saved as draft)!");
          } catch (unpublishErr) {
            toast.success("🎉 Quiz updated successfully!");
          }
        }

        setTimeout(() => navigate("/quizzes"), 1500);
      }
    } catch (err) {
      console.error("❌ Submit failed:", err);

      let errorMessage = "Failed to save quiz. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
        setTimeout(() => navigate("/login"), 2000);
      } else if (err.response?.status === 403) {
        errorMessage =
          "You are not authorized to create quizzes for this course.";
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Header */}
      <div className="mb-4">
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate("/quizzes")}
        >
          <ArrowLeft /> Back to Quizzes
        </button>

        <h2>{mode === "create" ? "Create New Quiz" : "Edit Quiz"}</h2>
        <p className="text-muted">
          {mode === "create"
            ? "Create a quiz with course/module selection and scheduling"
            : "Update your quiz information"}
        </p>
      </div>

      {/* Error Alert (for non-toast errors) */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          <strong>Error:</strong> {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      <form onSubmit={submitForm}>
        {/* Basic Information Card */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <Book className="me-2" /> Basic Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    id="publishNow"
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="publishNow"
                  >
                    Publish Immediately
                  </label>
                  <small className="text-muted d-block">
                    Uncheck to save as draft (quiz won't be visible to students)
                  </small>
                </div>
              </div>
              <div className="col-md-8 mb-3">
                <label className="form-label fw-bold">Quiz Title *</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Schedule Type</label>
                <select
                  className="form-select"
                  name="scheduleType"
                  value={formData.scheduleType}
                  onChange={handleInputChange}
                >
                  <option value="immediate">Available Immediately</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what this quiz covers"
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Instructions</label>
              <textarea
                className="form-control"
                rows="2"
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                placeholder="Enter instructions for students"
              />
            </div>
          </div>
        </div>

        {/* Course & Module Selection Card */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">
              <Book className="me-2" /> Course & Module Selection
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Course *</label>
                <select
                  className="form-select"
                  value={selectedCourse}
                  onChange={handleCourseChange}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title} ({course.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Module (Optional)</label>
                <select
                  className="form-select"
                  value={selectedModule}
                  onChange={handleModuleChange}
                  disabled={!selectedCourse}
                >
                  <option value="">Select a module (optional)</option>
                  {selectedCourse &&
                    getSelectedCourse()?.modules?.map((module, index) => (
                      <option key={module._id || index} value={module._id}>
                        Module {index + 1}: {module.title}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {selectedModule && (
              <div className="mb-3">
                <label className="form-label fw-bold">Module Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="moduleTitle"
                  value={formData.moduleTitle}
                  onChange={handleInputChange}
                  placeholder="Module title"
                />
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Settings Card */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">
              <CalendarCheck className="me-2" /> Schedule & Settings
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">
                  <Calendar className="me-1" /> Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">
                  <Calendar className="me-1" /> End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <Clock className="me-1" /> Duration (minutes)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="5"
                  max="180"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <Award className="me-1" /> Passing Score (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">
                  <Hash className="me-1" /> Max Attempts
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="maxAttempts"
                  value={formData.maxAttempts}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                <Tag className="me-1" /> Tags
              </label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddTag())
                  }
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-primary d-flex align-items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white btn-sm"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label="Remove"
                    />
                  </span>
                ))}
                {tags.length === 0 && (
                  <small className="text-muted">No tags added yet</small>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Questions Card */}
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FileText className="me-2" /> Questions (
              {formData.questions.length}/30)
            </h5>
            <button
              type="button"
              className="btn btn-light btn-sm"
              onClick={addQuestion}
              disabled={formData.questions.length >= 30}
            >
              <Plus /> Add Question
            </button>
          </div>

          <div className="card-body">
            {formData.questions.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FileText size={48} className="mb-3" />
                <h5>No questions yet</h5>
                <p>Click "Add Question" to start building your quiz</p>
              </div>
            ) : (
              <div className="questions-list">
                {formData.questions.map((question, index) => (
                  <div key={index} className="card mb-3 border">
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <h6 className="mb-0 me-3">Question {index + 1}</h6>
                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => moveQuestionUp(index)}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ChevronUp />
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => moveQuestionDown(index)}
                            disabled={index === formData.questions.length - 1}
                            title="Move down"
                          >
                            <ChevronDown />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash />
                      </button>
                    </div>

                    <div className="card-body">
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Question Text *
                        </label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(index, "question", e.target.value)
                          }
                          placeholder="Enter your question here"
                          required
                        />
                      </div>

                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">
                            <Type className="me-1" /> Question Type
                          </label>
                          <select
                            className="form-select"
                            value={question.type}
                            onChange={(e) =>
                              updateQuestion(index, "type", e.target.value)
                            }
                          >
                            <option value="single-choice">Single Choice</option>
                            <option value="multiple-choice">
                              Multiple Choice
                            </option>
                            <option value="true-false">True/False</option>
                            <option value="short-answer">Short Answer</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-bold">Points</label>
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            max="100"
                            value={question.points}
                            onChange={(e) =>
                              updateQuestion(
                                index,
                                "points",
                                parseInt(e.target.value) || 1
                              )
                            }
                          />
                        </div>
                      </div>

                      {(question.type === "single-choice" ||
                        question.type === "multiple-choice") && (
                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            Options *
                          </label>
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="input-group mb-2">
                              <span className="input-group-text">
                                <input
                                  className="form-check-input mt-0"
                                  type={
                                    question.type === "single-choice"
                                      ? "radio"
                                      : "checkbox"
                                  }
                                  name={`question-${index}-option`}
                                  checked={option.isCorrect}
                                  onChange={(e) =>
                                    updateOption(
                                      index,
                                      optIndex,
                                      "isCorrect",
                                      e.target.checked
                                    )
                                  }
                                />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={`Option ${optIndex + 1}`}
                                value={option.text}
                                onChange={(e) =>
                                  updateOption(
                                    index,
                                    optIndex,
                                    "text",
                                    e.target.value
                                  )
                                }
                                required
                              />
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeOption(index, optIndex)}
                                disabled={question.options.length <= 2}
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm mt-2"
                            onClick={() => addOption(index)}
                          >
                            <Plus size={14} /> Add Option
                          </button>
                        </div>
                      )}

                      {question.type === "true-false" && (
                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            Correct Answer *
                          </label>
                          <div className="d-flex gap-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`tf-${index}`}
                                value="true"
                                checked={question.correctAnswer === "true"}
                                onChange={(e) =>
                                  updateQuestion(
                                    index,
                                    "correctAnswer",
                                    e.target.value
                                  )
                                }
                              />
                              <label className="form-check-label">True</label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`tf-${index}`}
                                value="false"
                                checked={question.correctAnswer === "false"}
                                onChange={(e) =>
                                  updateQuestion(
                                    index,
                                    "correctAnswer",
                                    e.target.value
                                  )
                                }
                              />
                              <label className="form-check-label">False</label>
                            </div>
                          </div>
                        </div>
                      )}

                      {question.type === "short-answer" && (
                        <div className="mb-3">
                          <label className="form-label fw-bold">
                            Correct Answer *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter the correct answer"
                            value={question.correctAnswer}
                            onChange={(e) =>
                              updateQuestion(
                                index,
                                "correctAnswer",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      )}

                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Explanation (Optional)
                        </label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="Explain why this answer is correct"
                          value={question.explanation}
                          onChange={(e) =>
                            updateQuestion(index, "explanation", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="d-flex justify-content-between mb-5">
          <div>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/quizzes")}
              disabled={saving}
            >
              Cancel
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="me-2" />
                  {mode === "create" ? "Create Quiz" : "Update Quiz"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
