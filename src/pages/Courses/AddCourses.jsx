"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import CourseStepper from "./CourseStepper";
import BasicInfoTab from "./BasicInfoTab";
import InstructorTab from "./InstructorTab";
import ContentTab from "./ContentTab";
import MetadataTab from "./MetadataTab";
import MediaTab from "./MediaTab";

const AddCourses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [completedSteps, setCompletedSteps] = useState([]);

  // Main data state
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    shortDescription: "",
    longDescription: "",
    category: null,
    price: "",
    level: "Beginner",
    enrollmentDeadline: "",
    published: false,
    language: "English",
    accessType: "lifetime",
    certificateIncluded: false,

    // Instructor
    instructor: null,

    // Content
    modules: [
      {
        title: "",
        description: "",
        order: 1,
        status: "unlocked",
        lessons: [
          {
            title: "",
            description: "",
            type: "video",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            duration: 10, // minutes
            order: 1,
            isPreview: true,
            status: "unlocked",
            quizId: null,
            content: { instructions: "", resources: [] },
          },
        ],
      },
    ],

    // Metadata
    tags: [],
    whatYoullLearn: [],
    prerequisites: [],
    subtitles: [],

    // Media (Base64 images)
    bannerImage: null,
    thumbnails: [],
  });

  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    document.title = "Add Course | LMS Dashboard";
    const stored = localStorage.getItem("authUser");

    if (!stored) {
      toast.error("You are not logged in.");
      navigate("/login");
      return;
    }

    try {
      const authData = JSON.parse(stored);
      const token = authData?.token;
      const user = authData?.user;

      if (!token || !user) {
        toast.error("Invalid session data.");
        navigate("/login");
        return;
      }

      setUserRole(user.role);
      setUserId(user.id);

      // Auto-set instructor for instructors
      if (user.role === "instructor" && user.id) {
        setFormData(prev => ({
          ...prev,
          instructor: {
            value: user.id,
            label: user.name || "You",
          },
        }));
      }

      fetchData(token, user.role);
    } catch (error) {
      console.error("Error parsing auth data:", error);
      toast.error("Invalid session data.");
      navigate("/login");
    }
  }, [navigate]);

  const fetchData = async (token, role) => {
    try {
      // Fetch categories
      const categoriesRes = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(categoriesRes.data.categories?.map(cat => ({
        value: cat._id,
        label: cat.name,
      })) || []);

      // Fetch quizzes
      const quizzesRes = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/quizzes",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizzes(quizzesRes.data.data?.map(quiz => ({
        value: quiz._id,
        label: quiz.title,
      })) || []);

      // Fetch instructors if admin
      if (role === "admin") {
        const instructorsRes = await axios.get(
          "https://shekhai-server.onrender.com/api/v1/users?role=instructor",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInstructors(instructorsRes.data.users?.map(instructor => ({
          value: instructor._id,
          label: instructor.name,
        })) || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch some data.");
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Prepare data for API submission
  const prepareCourseData = () => {
    const courseData = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      category: formData.category?.value,
      price: Number(formData.price) || 0,
      level: formData.level,
      published: formData.published,
      language: formData.language,
      certificateIncluded: formData.certificateIncluded,
      accessType: formData.accessType,
    };

    // Add optional fields if they have values
    if (formData.enrollmentDeadline) {
      courseData.enrollmentDeadline = formData.enrollmentDeadline;
    }

    // Add instructor
    if (userRole === "instructor" && userId) {
      courseData.instructor = userId;
    } else if (userRole === "admin" && formData.instructor?.value) {
      courseData.instructor = formData.instructor.value;
    }

    // Add arrays if they have items
    if (formData.tags.length > 0) {
      courseData.tags = formData.tags;
    }
    if (formData.whatYoullLearn.length > 0) {
      courseData.whatYoullLearn = formData.whatYoullLearn;
    }
    if (formData.prerequisites.length > 0) {
      courseData.prerequisites = formData.prerequisites;
    }
    if (formData.subtitles.length > 0) {
      courseData.subtitles = formData.subtitles;
    }

    // Add Base64 images (only if they exist and are valid)
    if (formData.bannerImage && formData.bannerImage.startsWith('data:image')) {
      try {
        // Validate Base64 and limit size
        const base64Data = formData.bannerImage.split(',')[1];
        const sizeInBytes = (base64Data.length * 3) / 4;
        const sizeInMB = sizeInBytes / (1024 * 1024);

        if (sizeInMB <= 5) { // Max 5MB
          courseData.bannerImage = {
            data: formData.bannerImage,
            contentType: formData.bannerImage.split(';')[0].split(':')[1],
            size: sizeInBytes
          };
        } else {
          toast.error("Banner image too large (max 5MB). Please use a smaller image.");
          return null;
        }
      } catch (error) {
        console.error("Error processing banner image:", error);
      }
    }

    if (formData.thumbnails && formData.thumbnails.length > 0) {
      courseData.thumbnails = formData.thumbnails
        .filter(thumb => thumb && thumb.startsWith('data:image'))
        .map((thumb, index) => {
          try {
            const base64Data = thumb.split(',')[1];
            const sizeInBytes = (base64Data.length * 3) / 4;
            const sizeInMB = sizeInBytes / (1024 * 1024);

            if (sizeInMB <= 5) {
              return {
                data: thumb,
                contentType: thumb.split(';')[0].split(':')[1],
                size: sizeInBytes,
                order: index
              };
            }
            return null;
          } catch (error) {
            console.error("Error processing thumbnail:", error);
            return null;
          }
        })
        .filter(thumb => thumb !== null);
    }

    // Process modules and lessons
    if (formData.modules.length > 0) {
      courseData.modules = formData.modules.map((module, moduleIndex) => {
        const processedModule = {
          title: module.title,
          description: module.description || "",
          order: module.order,
          status: module.status,
          lessons: module.lessons.map((lesson, lessonIndex) => {
            const processedLesson = {
              title: lesson.title,
              description: lesson.description || "",
              type: lesson.type,
              duration: Number(lesson.duration) * 60 || 0, // Convert minutes to seconds
              order: lesson.order,
              isPreview: lesson.isPreview || false,
              status: lesson.status,
            };

            // Add type-specific fields
            if (lesson.type === 'video' && lesson.videoUrl) {
              processedLesson.videoUrl = lesson.videoUrl;
            }

            if (lesson.type === 'quiz' && lesson.quizId) {
              processedLesson.quizId = lesson.quizId.value || lesson.quizId;
            }

            if ((lesson.type === 'practice' || lesson.type === 'project') && lesson.content?.instructions) {
              processedLesson.content = {
                instructions: lesson.content.instructions
              };
            }

            return processedLesson;
          })
        };

        return processedModule;
      });
    }

    return courseData;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const stored = localStorage.getItem("authUser");

    if (!stored) {
      toast.error("You are not logged in.");
      setLoading(false);
      navigate("/login");
      return;
    }

    try {
      const authData = JSON.parse(stored);
      const token = authData?.token;
      const user = authData?.user;

      if (!token || !user) {
        toast.error("Invalid session data.");
        setLoading(false);
        navigate("/login");
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.title.trim()) {
        toast.error("Course title is required");
        setLoading(false);
        return;
      }

      if (!formData.shortDescription || !formData.shortDescription.trim()) {
        toast.error("Short description is required");
        setLoading(false);
        return;
      }

      if (!formData.category) {
        toast.error("Category is required");
        setLoading(false);
        return;
      }

      if (userRole === "admin" && !formData.instructor) {
        toast.error("Instructor is required for admin");
        setLoading(false);
        return;
      }

      // Validate modules and lessons
      if (formData.modules.length === 0) {
        toast.error("At least one module is required");
        setLoading(false);
        return;
      }

      for (const module of formData.modules) {
        if (!module.title || !module.title.trim()) {
          toast.error("Module title is required");
          setLoading(false);
          return;
        }

        if (module.lessons.length === 0) {
          toast.error(`Module "${module.title}" must have at least one lesson`);
          setLoading(false);
          return;
        }

        for (const lesson of module.lessons) {
          if (!lesson.title || !lesson.title.trim()) {
            toast.error("Lesson title is required");
            setLoading(false);
            return;
          }

          if (lesson.type === 'quiz' && !lesson.quizId) {
            toast.error(`Quiz lesson "${lesson.title}" requires a quiz selection`);
            setLoading(false);
            return;
          }
        }
      }

      // Prepare course data
      const courseData = prepareCourseData();
      if (!courseData) {
        setLoading(false);
        return;
      }

      console.log("Submitting course data:", JSON.stringify(courseData, null, 2));

      // Send request
      const res = await axios.post(
        "https://shekhai-server.onrender.com/api/v1/courses",
        courseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("Course created successfully!");

        // Reset form
        setFormData({
          title: "",
          shortDescription: "",
          longDescription: "",
          category: null,
          price: "",
          level: "Beginner",
          enrollmentDeadline: "",
          published: false,
          language: "English",
          accessType: "lifetime",
          certificateIncluded: false,
          instructor: null,
          modules: [
            {
              title: "",
              description: "",
              order: 1,
              status: "unlocked",
              lessons: [
                {
                  title: "",
                  description: "",
                  type: "video",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  duration: 10,
                  order: 1,
                  isPreview: true,
                  status: "unlocked",
                  quizId: null,
                  content: { instructions: "", resources: [] },
                },
              ],
            },
          ],
          tags: [],
          whatYoullLearn: [],
          prerequisites: [],
          subtitles: [],
          bannerImage: null,
          thumbnails: [],
        });

        setActiveTab("basic");
        setCompletedSteps([]);

        // Redirect to courses list
        setTimeout(() => navigate("/all-courses"), 2000);
      } else {
        toast.error(res.data.msg || "Failed to create course");
      }
    } catch (err) {
      console.error("Submit error:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);

        if (err.response.data) {
          toast.error(err.response.data.msg || err.response.data.message || "Server error");
        } else {
          toast.error(`Server error: ${err.response.status}`);
        }
      } else if (err.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error("Request error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case "basic":
        return formData.title && formData.title.trim() &&
          formData.shortDescription && formData.shortDescription.trim() &&
          formData.category;
      case "instructor":
        return userRole === "instructor" || formData.instructor;
      case "content":
        return formData.modules.length > 0 &&
          formData.modules.every(module =>
            module.title && module.title.trim() &&
            module.lessons.length > 0 &&
            module.lessons.every(lesson =>
              lesson.title && lesson.title.trim() &&
              (lesson.type !== "quiz" || lesson.quizId)
            )
          );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isStepValid(activeTab)) {
      toast.error("Please complete all required fields");
      return;
    }

    setCompletedSteps([...new Set([...completedSteps, activeTab])]);

    const steps = ["basic", "instructor", "content", "metadata", "media"];
    const currentIndex = steps.indexOf(activeTab);
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1]);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    const steps = ["basic", "instructor", "content", "metadata", "media"];
    const currentIndex = steps.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Courses" breadcrumbItem="Add Course" />

        <div className="row">
          {/* Sidebar Stepper */}
          <div className="col-lg-3 col-xl-2 d-none d-lg-block">
            <CourseStepper
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              completedSteps={completedSteps}
            />
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-xl-10">
            <div className="card shadow-lg rounded-4">
              <div className="card-body p-4">
                {/* Mobile Stepper */}
                <div className="d-block d-lg-none mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Create Course</h5>
                    <select
                      className="form-select w-auto"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                    >
                      <option value="basic">Basic Info</option>
                      <option value="instructor">Instructor</option>
                      <option value="content">Content</option>
                      <option value="metadata">Metadata</option>
                      <option value="media">Media</option>
                    </select>
                  </div>
                </div>

                {/* Active Tab Content */}
                {activeTab === "basic" && (
                  <BasicInfoTab
                    data={formData}
                    onUpdate={updateFormData}
                    categories={categories}
                    userRole={userRole}
                  />
                )}

                {activeTab === "instructor" && (
                  <InstructorTab
                    data={formData}
                    onUpdate={updateFormData}
                    instructors={instructors}
                    userRole={userRole}
                    userId={userId}
                  />
                )}

                {activeTab === "content" && (
                  <ContentTab
                    modules={formData.modules}
                    onUpdateModules={(modules) => updateFormData("modules", modules)}
                    quizzes={quizzes}
                  />
                )}

                {activeTab === "metadata" && (
                  <MetadataTab
                    data={formData}
                    onUpdate={updateFormData}
                  />
                )}

                {activeTab === "media" && (
                  <MediaTab
                    formData={formData}
                    onUpdate={updateFormData}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/all-courses")}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <div className="d-flex gap-3">
                    {activeTab !== "basic" && (
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handlePrevious}
                        disabled={loading}
                      >
                        Previous
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary px-4"
                      onClick={handleNext}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          {activeTab === "media" ? "Creating..." : "Loading..."}
                        </>
                      ) : (
                        activeTab === "media" ? "Create Course" : "Continue"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              icon: '✅',
              style: {
                background: '#28a745',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: '#dc3545',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AddCourses;