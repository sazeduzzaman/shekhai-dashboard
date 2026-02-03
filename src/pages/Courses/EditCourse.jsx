"use client";

import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import EditCourseStepper from "./EditCourseStepper";
import EditBasicInfoTab from "./EditBasicInfoTab";
import EditInstructorTab from "./EditInstructorTab";
import EditContentTab from "./EditContentTab";
import EditMetadataTab from "./EditMetadataTab";
import EditMediaTab from "./EditMediaTab";

const EditCourse = () => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [errors, setErrors] = useState({});

  // Course data state
  const [courseData, setCourseData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    category: null,
    price: "",
    promotionalPrice: "",
    level: "Beginner",
    enrollmentDeadline: "",
    published: false,
    language: "English",
    accessType: "lifetime",
    certificateIncluded: false,
    instructor: null,
    modules: [],
    tags: [],
    whatYoullLearn: [],
    prerequisites: [],
    subtitles: [],
    bannerImage: null,
    bannerUrl: "",
    thumbnails: [],
    thumbnailUrls: [],
    totalDuration: 0,
    totalLessons: 0,
    totalQuizzes: 0,
    totalProjects: 0
  });

  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        toast.error("No course ID provided");
        navigate("/all-courses");
        return;
      }

      const stored = localStorage.getItem("authUser");
      if (!stored) {
        toast.error("You are not logged in");
        navigate("/login");
        return;
      }

      try {
        const authData = JSON.parse(stored);
        const token = authData?.token;
        const user = authData?.user;

        if (!token || !user) {
          toast.error("Invalid session data");
          navigate("/login");
          return;
        }

        setUserRole(user.role);
        setUserId(user.id || user._id);

        // Fetch course details
        const courseRes = await axios.get(
          `https://shekhai-server.onrender.com/api/v1/courses/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!courseRes.data.success || !courseRes.data.course) {
          toast.error("Course not found");
          navigate("/all-courses");
          return;
        }

        const course = courseRes.data.course || courseRes.data.data;

        // Check permissions
        if (user.role === "instructor" && course.instructor?._id !== (user.id || user._id)) {
          toast.error("You don't have permission to edit this course");
          navigate("/all-courses");
          return;
        }

        // First fetch quizzes, then transform course data
        await fetchQuizzes(token);
        await fetchCategories(token);
        await fetchInstructors(token);

        // Transform course data with quizzes available
        transformCourseData(course, quizzes);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching course:", error);
        if (error.response?.status === 404) {
          toast.error("Course not found");
        } else if (error.response?.status === 403) {
          toast.error("Access denied");
        } else {
          toast.error("Failed to load course data");
        }
        navigate("/all-courses");
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  const fetchCategories = async (token) => {
    try {
      const res = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/categories",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories(res.data.categories?.map(cat => ({
        value: cat._id,
        label: cat.name
      })) || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchQuizzes = async (token) => {
    try {
      const res = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/quizzes",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Transform quiz data to proper format
      const formattedQuizzes = (res.data.data || []).map(quiz => ({
        value: quiz._id,
        label: quiz.title
      }));

      setQuizzes(formattedQuizzes);
      return formattedQuizzes; // Return for use in transformCourseData
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  };

  const fetchInstructors = async (token) => {
    try {
      const res = await axios.get(
        "https://shekhai-server.onrender.com/api/v1/users?role=instructor",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const instructorsData = res.data.users || res.data.data || [];

      const formattedInstructors = instructorsData.map(instructor => ({
        value: instructor._id,
        label: instructor.name || instructor.username || `Instructor ${instructor._id.slice(-6)}`
      }));

      setInstructors(formattedInstructors);

    } catch (error) {
      console.error("Error fetching instructors:", error);
      toast.error("Failed to load instructors");
      setInstructors([]);
    }
  };

  const transformCourseData = (course, quizzesData = []) => {
    // Format instructor for dropdown
    let instructor = null;
    if (course.instructor) {
      instructor = {
        value: course.instructor._id,
        label: course.instructor.name || course.instructor.username || `Instructor ${course.instructor._id.slice(-6)}`
      };
    }

    // Format category for dropdown
    const category = course.category?._id ? {
      value: course.category._id,
      label: course.category.name
    } : course.category?.[0]?._id ? {
      value: course.category[0]._id,
      label: course.category[0].name
    } : null;

    // Transform modules and lessons
    // Transform modules and lessons
    const transformedModules = course.modules?.map((module, moduleIndex) => ({
      _id: module._id || `module_${Date.now()}_${moduleIndex}`,
      title: module.title || "",
      description: module.description || "",
      order: module.order || moduleIndex + 1,
      status: module.status || "unlocked",
      lessons: module.lessons?.map((lesson, lessonIndex) => {
        let quizData = null;
        // Only set quizId for quiz lessons
        if (lesson.type === 'quiz' && lesson.quizId) {
          const quiz = quizzesData.find(q => q.value === lesson.quizId);
          if (quiz) {
            quizData = quiz;
          }
        }

        const lessonObj = {
          _id: lesson._id || `lesson_${Date.now()}_${lessonIndex}`,
          title: lesson.title || "",
          description: lesson.description || "",
          type: lesson.type || "video",
          videoUrl: lesson.videoUrl || "",
          duration: lesson.duration ? Math.floor(lesson.duration / 60) : 0,
          order: lesson.order || lessonIndex + 1,
          isPreview: lesson.isPreview || false,
          status: lesson.status || "unlocked",
          content: lesson.content || { instructions: "", resources: [] },
        };

        // Only add quizId to the object if it exists
        if (lesson.type === 'quiz' && quizData) {
          lessonObj.quizId = quizData;
        }

        return lessonObj;
      }) || [],
    })) || [];

    // Calculate totals
    const totalDuration = transformedModules.reduce((total, module) => {
      return total + (module.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0);
    }, 0);

    const totalLessons = transformedModules.reduce((sum, module) =>
      sum + (module.lessons?.length || 0), 0
    );

    const totalQuizzes = transformedModules.reduce((sum, module) =>
      sum + (module.lessons?.filter(lesson => lesson.type === 'quiz')?.length || 0), 0
    );

    const totalProjects = transformedModules.reduce((sum, module) =>
      sum + (module.lessons?.filter(lesson =>
        lesson.type === 'project' || lesson.type === 'practice')?.length || 0), 0
    );

    // Format enrollment deadline
    let formattedEnrollmentDeadline = "";
    if (course.enrollmentDeadline) {
      const date = new Date(course.enrollmentDeadline);
      if (!isNaN(date.getTime())) {
        formattedEnrollmentDeadline = date.toISOString().split('T')[0];
      }
    }

    // Format thumbnails
    let thumbnailUrls = [];
    if (course.thumbnails && Array.isArray(course.thumbnails)) {
      thumbnailUrls = course.thumbnails.map(thumb => {
        if (typeof thumb === 'object' && thumb.data) {
          return thumb.data;
        }
        return thumb;
      }).filter(Boolean);
    }

    setCourseData({
      // Basic Info
      title: course.title || "",
      shortDescription: course.shortDescription || "",
      longDescription: course.longDescription || "",
      category: category,
      price: course.price?.toString() || "",
      promotionalPrice: course.promotionalPrice?.toString() || "",
      level: course.level || "Beginner",
      enrollmentDeadline: formattedEnrollmentDeadline,
      published: course.published || false,
      language: course.language || "English",
      accessType: course.accessType || "lifetime",
      certificateIncluded: course.certificateIncluded || false,

      // Instructor
      instructor: instructor,

      // Content
      modules: transformedModules,

      // Metadata
      tags: course.tags || [],
      whatYoullLearn: course.whatYoullLearn || [],
      prerequisites: course.prerequisites || [],
      subtitles: course.subtitles || [],

      // Media
      bannerImage: null,
      bannerUrl: course.bannerUrl || (course.bannerImage?.data || ""),
      thumbnails: [],
      thumbnailUrls: thumbnailUrls,

      // Calculated fields
      totalDuration,
      totalLessons,
      totalQuizzes,
      totalProjects,
    });
  };

  const updateCourseData = (field, value) => {
    console.log("Updating course data field:", field, "value:", value);
    setCourseData(prev => {
      const updated = { ...prev, [field]: value };

      // Update dependent calculated fields for content tab
      if (field === 'modules') {
        const totalDuration = value.reduce((total, module) => {
          return total + (module.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0);
        }, 0);

        const totalLessons = value.reduce((sum, module) =>
          sum + (module.lessons?.length || 0), 0
        );

        const totalQuizzes = value.reduce((sum, module) =>
          sum + (module.lessons?.filter(lesson => lesson.type === 'quiz')?.length || 0), 0
        );

        const totalProjects = value.reduce((sum, module) =>
          sum + (module.lessons?.filter(lesson =>
            lesson.type === 'project' || lesson.type === 'practice')?.length || 0), 0
        );

        return {
          ...updated,
          totalDuration,
          totalLessons,
          totalQuizzes,
          totalProjects
        };
      }

      return updated;
    });

    // Clear error for this field
    if (errors && errors[field] && setErrors) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const prepareUpdateData = () => {
    const updateData = {};

    // Basic Info
    if (courseData.title) updateData.title = courseData.title;
    if (courseData.shortDescription) updateData.shortDescription = courseData.shortDescription;
    if (courseData.longDescription) updateData.longDescription = courseData.longDescription;
    if (courseData.category?.value) updateData.category = courseData.category.value;

    // Convert price to number safely
    if (courseData.price !== undefined) {
      updateData.price = parseFloat(courseData.price) || 0;
    }

    if (courseData.promotionalPrice !== undefined && courseData.promotionalPrice !== '') {
      updateData.promotionalPrice = parseFloat(courseData.promotionalPrice);
    }

    if (courseData.level) updateData.level = courseData.level;

    // Handle enrollment deadline
    if (courseData.enrollmentDeadline) {
      if (courseData.enrollmentDeadline.includes('T')) {
        updateData.enrollmentDeadline = courseData.enrollmentDeadline;
      } else {
        updateData.enrollmentDeadline = new Date(courseData.enrollmentDeadline).toISOString();
      }
    }

    if (courseData.published !== undefined) updateData.published = courseData.published;
    if (courseData.language) updateData.language = courseData.language;
    if (courseData.accessType) updateData.accessType = courseData.accessType;
    if (courseData.certificateIncluded !== undefined) updateData.certificateIncluded = courseData.certificateIncluded;

    // Instructor
    if (userRole === "instructor" && userId) {
      updateData.instructor = userId;
    } else if (userRole === "admin" && courseData.instructor?.value) {
      updateData.instructor = courseData.instructor.value;
    }

    // Metadata
    updateData.tags = courseData.tags || [];
    updateData.whatYoullLearn = courseData.whatYoullLearn || [];
    updateData.prerequisites = courseData.prerequisites || [];
    updateData.subtitles = courseData.subtitles || [];

    // Media - Process images only if they exist
    if (courseData.bannerImage && typeof courseData.bannerImage === 'string' && courseData.bannerImage.startsWith('data:image')) {
      try {
        const contentType = courseData.bannerImage.split(';')[0].split(':')[1];
        const base64Data = courseData.bannerImage.split(',')[1];
        const sizeInBytes = (base64Data.length * 3) / 4;

        updateData.bannerImage = {
          data: courseData.bannerImage,
          contentType: contentType,
          size: sizeInBytes
        };
      } catch (error) {
        console.error("Error processing banner image:", error);
      }
    }

    // Process thumbnails
    if (courseData.thumbnails && courseData.thumbnails.length > 0) {
      updateData.thumbnails = courseData.thumbnails
        .filter(thumb => thumb && typeof thumb === 'string' && thumb.startsWith('data:image'))
        .map((thumb, index) => {
          try {
            const contentType = thumb.split(';')[0].split(':')[1];
            const base64Data = thumb.split(',')[1];
            const sizeInBytes = (base64Data.length * 3) / 4;

            return {
              data: thumb,
              contentType: contentType,
              size: sizeInBytes,
              order: index
            };
          } catch (error) {
            console.error("Error processing thumbnail:", error);
            return null;
          }
        })
        .filter(thumb => thumb !== null);
    }

    // Content - Modules and Lessons (FIXED: Only include quizId for quiz lessons)
    if (courseData.modules && courseData.modules.length > 0) {
      updateData.modules = courseData.modules.map((module, moduleIndex) => {
        const processedModule = {
          title: module.title || "",
          description: module.description || "",
          order: module.order || moduleIndex + 1,
          status: module.status || "unlocked",
          lessons: []
        };

        // Process lessons
        if (module.lessons && module.lessons.length > 0) {
          processedModule.lessons = module.lessons.map((lesson, lessonIndex) => {
            // Create lesson object with common fields
            const processedLesson = {
              title: lesson.title || "",
              description: lesson.description || "",
              type: lesson.type || "video",
              duration: (Number(lesson.duration) || 0) * 60, // Convert minutes to seconds
              order: lesson.order || lessonIndex + 1,
              isPreview: lesson.isPreview || false,
              status: lesson.status || "unlocked"
            };

            // Add video URL if type is video
            if (lesson.type === 'video' && lesson.videoUrl) {
              processedLesson.videoUrl = lesson.videoUrl;
            }

            // CRITICAL FIX: Only add quizId for quiz lessons
            if (lesson.type === 'quiz') {
              // Get the quizId value
              const quizIdValue = lesson.quizId?.value || lesson.quizId;

              // Validate it's a proper MongoDB ObjectId (24 hex chars)
              if (quizIdValue && quizIdValue.trim() !== '' &&
                quizIdValue.length === 24 && /^[0-9a-fA-F]{24}$/.test(quizIdValue)) {
                processedLesson.quizId = quizIdValue;
              } else {
                console.warn(`Invalid quizId for quiz lesson: "${lesson.title}"`, quizIdValue);
                // Still include it even if invalid, but it will fail validation
                processedLesson.quizId = quizIdValue;
              }
            }
            // DO NOT ADD quizId FOR NON-QUIZ LESSONS

            // Add content for practice/project types
            if ((lesson.type === 'practice' || lesson.type === 'project') && lesson.content) {
              processedLesson.content = {
                instructions: lesson.content.instructions || ""
              };
            }

            // Preserve existing _id if it's a real MongoDB ID
            if (lesson._id && !lesson._id.startsWith('lesson_temp_')) {
              processedLesson._id = lesson._id;
            }

            return processedLesson;
          });
        }

        // Preserve existing _id if it's a real MongoDB ID
        if (module._id && !module._id.startsWith('module_temp_')) {
          processedModule._id = module._id;
        }

        return processedModule;
      });
    }

    // Debug logging
    console.log("=== DEBUG: Prepared Update Data ===");
    console.log("Course Title:", updateData.title);

    if (updateData.modules) {
      console.log("Modules count:", updateData.modules.length);
      updateData.modules.forEach((module, moduleIndex) => {
        console.log(`\nModule ${moduleIndex}: "${module.title}"`);
        if (module.lessons) {
          module.lessons.forEach((lesson, lessonIndex) => {
            const hasQuizId = lesson.quizId !== undefined;
            console.log(`  Lesson ${lessonIndex}: "${lesson.title}" (${lesson.type}) - quizId: ${hasQuizId ? `PRESENT: ${lesson.quizId}` : 'ABSENT'}`);
          });
        }
      });
    }

    console.log("=== END DEBUG ===");

    return updateData;
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setErrors({});
    const stored = localStorage.getItem("authUser");

    if (!stored) {
      toast.error("You are not logged in");
      setUpdating(false);
      navigate("/login");
      return;
    }

    try {
      const authData = JSON.parse(stored);
      const token = authData?.token;
      const user = authData?.user;

      // Only validate fields based on active tab
      const validationErrors = {};

      if (activeTab === "basic") {
        if (!courseData.title?.trim()) validationErrors.title = "Course title is required";
        if (!courseData.shortDescription?.trim()) validationErrors.shortDescription = "Short description is required";
        if (!courseData.category) validationErrors.category = "Category is required";
      }

      if (activeTab === "instructor" && userRole === "admin" && !courseData.instructor) {
        validationErrors.instructor = "Instructor is required";
      }

      if (activeTab === "content") {
        if (courseData.modules.length === 0) {
          validationErrors.modules = "At least one module is required";
        } else {
          const hasInvalidModule = courseData.modules.some(module => !module.title?.trim());
          const hasInvalidLesson = courseData.modules.some(module =>
            module.lessons.some(lesson => !lesson.title?.trim())
          );

          if (hasInvalidModule) validationErrors.modules = "All modules must have a title";
          if (hasInvalidLesson) validationErrors.lessons = "All lessons must have a title";
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error("Please fix the errors in the current tab");
        setUpdating(false);
        return;
      }

      const updateData = prepareUpdateData();

      console.log("Sending update data to server:", updateData);

      const res = await axios.put(
        `https://shekhai-server.onrender.com/api/v1/courses/${courseId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", res.data);

      if (res.data.success) {
        toast.success(`Course ${activeTab} updated successfully!`);
        if (!completedSteps.includes(activeTab)) {
          setCompletedSteps([...completedSteps, activeTab]);
        }
      } else {
        toast.error(res.data.msg || "Failed to update course");
      }
    } catch (error) {
      console.error("❌ Update error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        request: error.request
      });

      const errorMsg = error.response?.data?.msg ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error updating course";

      // Show more detailed error message
      if (error.response?.data?.errors) {
        const errorDetails = Object.values(error.response.data.errors).join(', ');
        toast.error(`${errorMsg}: ${errorDetails}`);
      } else {
        toast.error(errorMsg);
      }

      // Set field-specific errors if available
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setUpdating(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case "basic":
        return courseData.title?.trim() &&
          courseData.shortDescription?.trim() &&
          courseData.category;
      case "instructor":
        return userRole === "instructor" || courseData.instructor;
      case "content":
        if (courseData.modules.length === 0) return false;
        return courseData.modules.every(module =>
          module.title?.trim() &&
          module.lessons.length > 0 &&
          module.lessons.every(lesson =>
            lesson.title?.trim() &&
            (lesson.type !== "quiz" || lesson.quizId) // Check if quiz lessons have quizId
          )
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isStepValid(activeTab)) {
      toast.error("Please complete all required fields in this tab");
      return;
    }

    setCompletedSteps([...new Set([...completedSteps, activeTab])]);
    const steps = ["basic", "instructor", "content", "metadata", "media"];
    const currentIndex = steps.indexOf(activeTab);

    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1]);
    } else {
      handleUpdate();
    }
  };

  const handlePrevious = () => {
    const steps = ["basic", "instructor", "content", "metadata", "media"];
    const currentIndex = steps.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(steps[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid">
        <Breadcrumbs title="Edit Course" breadcrumbItem="Loading..." />
        <div className="text-center mt-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Edit Course" breadcrumbItem={courseData.title} />

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="alert alert-info mb-3">
            <div className="d-flex justify-content-between">
              <div>
                <strong>Editing Course:</strong> {courseData.title}
                <span className="ms-2 badge bg-primary">ID: {courseId}</span>
                <span className="ms-2 badge bg-secondary">Role: {userRole}</span>
              </div>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => {
                  console.log("Course Data:", courseData);
                  console.log("Quizzes:", quizzes);
                  console.log("Active Tab:", activeTab);
                }}
              >
                Log Data
              </button>
            </div>
          </div>
        )}

        <div className="row">
          {/* Sidebar Stepper */}
          <div className="col-lg-3 col-xl-2 d-none d-lg-block">
            <EditCourseStepper
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              completedSteps={completedSteps}
              courseTitle={courseData.title}
            />
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-xl-10">
            <div className="card shadow-lg rounded-4">
              <div className="card-body p-4">
                {/* Mobile Stepper */}
                <div className="d-block d-lg-none mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Edit Course</h5>
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
                  <EditBasicInfoTab
                    courseData={courseData}
                    updateCourseData={updateCourseData}
                    errors={errors}
                    setErrors={setErrors}
                    categories={categories}
                    isSubmitting={updating}
                  />
                )}

                {activeTab === "instructor" && (
                  <EditInstructorTab
                    courseData={courseData}
                    updateCourseData={updateCourseData}
                    errors={errors}
                    setErrors={setErrors}
                    instructors={instructors}
                    userRole={userRole}
                    userId={userId}
                    isSubmitting={updating}
                  />
                )}

                {activeTab === "content" && (
                  <EditContentTab
                    courseData={courseData}
                    updateCourseData={updateCourseData}
                    errors={errors}
                    setErrors={setErrors}
                    quizzes={quizzes}
                    isSubmitting={updating}
                  />
                )}

                {activeTab === "metadata" && (
                  <EditMetadataTab
                    courseData={courseData}
                    updateCourseData={updateCourseData}
                    errors={errors}
                    setErrors={setErrors}
                    isSubmitting={updating}
                  />
                )}

                {activeTab === "media" && (
                  <EditMediaTab
                    courseData={courseData}
                    updateCourseData={updateCourseData}
                    errors={errors}
                    setErrors={setErrors}
                    isSubmitting={updating}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/all-courses")}
                    disabled={updating}
                  >
                    Cancel
                  </button>

                  <div className="d-flex gap-3">
                    {activeTab !== "basic" && (
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handlePrevious}
                        disabled={updating}
                      >
                        Previous
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary px-4"
                      onClick={handleUpdate}
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Updating...
                        </>
                      ) : (
                        "Update " + (activeTab.charAt(0).toUpperCase() + activeTab.slice(1))
                      )}
                    </button>

                    {activeTab !== "media" && (
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={handleNext}
                        disabled={updating}
                      >
                        Next
                      </button>
                    )}
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

export default EditCourse;