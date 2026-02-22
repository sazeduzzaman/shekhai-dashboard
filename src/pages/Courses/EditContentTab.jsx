import { ArrowDown, ArrowUp, Pencil, Trash } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const EditContentTab = ({
    courseData,
    updateCourseData,
    errors = {},
    setErrors,
    quizzes = [],
    isSubmitting = false
}) => {
    const [modules, setModules] = useState([]);
    const [expandedModule, setExpandedModule] = useState(null);
    const [editingModule, setEditingModule] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);
    const [newModule, setNewModule] = useState({ title: '', description: '' });
    const [newLesson, setNewLesson] = useState({
        title: '',
        type: 'video',
        duration: '',
        videoUrl: '',
        content: '',
        quizId: '', // FIX: Empty string instead of null
        isPreview: false
    });

    // Initialize with existing course data
    useEffect(() => {
        if (courseData?.modules) {
            // Ensure all lessons have quizId as empty string for non-quiz types
            const normalizedModules = courseData.modules.map(module => ({
                ...module,
                lessons: module.lessons?.map(lesson => ({
                    ...lesson,
                    quizId: lesson.type === 'quiz' ? lesson.quizId : '' // Ensure empty string for non-quiz
                })) || []
            }));
            setModules(normalizedModules);
        }
    }, [courseData]);

    // Calculate totals
    const calculateTotalDuration = () => {
        return modules.reduce((total, module) => {
            return total + (module.lessons || []).reduce((sum, lesson) => {
                return sum + (Number(lesson.duration) || 0);
            }, 0);
        }, 0);
    };

    const totalDuration = calculateTotalDuration();
    const totalLessons = modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
    const totalQuizzes = modules.reduce((sum, module) =>
        sum + (module.lessons?.filter(lesson => lesson.type === 'quiz')?.length || 0), 0
    );
    const totalProjects = modules.reduce((sum, module) =>
        sum + (module.lessons?.filter(lesson =>
            lesson.type === 'project' || lesson.type === 'practice')?.length || 0), 0
    );

    const handleAddModule = () => {
        if (!newModule.title.trim()) {
            if (setErrors) {
                setErrors(prev => ({ ...prev, modules: 'Module title is required' }));
            }
            toast.error("Module title is required");
            return;
        }

        const newModuleObj = {
            _id: `module_temp_${Date.now()}`,
            title: newModule.title,
            description: newModule.description || '',
            order: modules.length + 1,
            status: 'unlocked',
            lessons: []
        };

        const updatedModules = [...modules, newModuleObj];
        setModules(updatedModules);
        updateCourseData('modules', updatedModules);
        setNewModule({ title: '', description: '' });

        if (errors.modules && setErrors) {
            setErrors(prev => ({ ...prev, modules: '' }));
        }
    };

    const handleEditModule = (moduleId) => {
        const module = modules.find(m => m._id === moduleId);
        if (module) {
            setEditingModule(moduleId);
            setNewModule({ title: module.title, description: module.description || '' });
        }
    };

    const handleUpdateModule = () => {
        if (!newModule.title.trim()) {
            toast.error("Module title is required");
            return;
        }

        const updatedModules = modules.map(module =>
            module._id === editingModule
                ? { ...module, title: newModule.title, description: newModule.description }
                : module
        );

        setModules(updatedModules);
        updateCourseData('modules', updatedModules);
        setEditingModule(null);
        setNewModule({ title: '', description: '' });
    };

    const handleDeleteModule = (moduleId) => {
        const updatedModules = modules.filter(module => module._id !== moduleId);
        setModules(updatedModules);
        updateCourseData('modules', updatedModules);
    };

    const handleAddLesson = (moduleId) => {
        if (!newLesson.title.trim()) {
            toast.error("Lesson title is required");
            return;
        }

        if (newLesson.type === 'quiz' && !newLesson.quizId) {
            toast.error("Please select a quiz for quiz lessons");
            return;
        }

        // Create base lesson object
        const newLessonObj = {
            _id: `lesson_temp_${Date.now()}`,
            title: newLesson.title,
            description: '',
            type: newLesson.type,
            videoUrl: newLesson.videoUrl || '',
            duration: Number(newLesson.duration) || 0,
            order: 1,
            isPreview: newLesson.isPreview || false,
            status: 'unlocked'
        };

        // Only add quizId for quiz lessons
        if (newLesson.type === 'quiz' && newLesson.quizId) {
            const quizIdValue = newLesson.quizId?.value || newLesson.quizId;
            if (quizIdValue && quizIdValue.trim() !== '') {
                newLessonObj.quizId = quizIdValue;
            }
        }

        // Add content for specific types
        if (newLesson.type === 'article' || newLesson.type === 'quiz' ||
            newLesson.type === 'project' || newLesson.type === 'practice') {
            newLessonObj.content = { instructions: newLesson.content || '' };
        }

        const updatedModules = modules.map(module => {
            if (module._id === moduleId) {
                const lessonOrder = module.lessons ? module.lessons.length + 1 : 1;
                return {
                    ...module,
                    lessons: [
                        ...(module.lessons || []),
                        { ...newLessonObj, order: lessonOrder }
                    ]
                };
            }
            return module;
        });

        setModules(updatedModules);
        updateCourseData('modules', updatedModules);

        // Reset form
        setNewLesson({
            title: '',
            type: 'video',
            duration: '',
            videoUrl: '',
            content: '',
            quizId: '',
            isPreview: false
        });
    };

    const handleEditLesson = (moduleId, lessonId) => {
        const module = modules.find(m => m._id === moduleId);
        if (module) {
            const lesson = module.lessons.find(l => l._id === lessonId);
            if (lesson) {
                setEditingLesson({ moduleId, lessonId });

                // Handle quiz selection properly
                let quizValue = '';
                if (lesson.type === 'quiz' && lesson.quizId) {
                    const quiz = quizzes.find(q => q.value === lesson.quizId);
                    if (quiz) {
                        quizValue = quiz;
                    } else if (typeof lesson.quizId === 'string' && lesson.quizId.trim()) {
                        // If quizId exists but not in quizzes list, create a temporary object
                        quizValue = { value: lesson.quizId, label: `Quiz: ${lesson.quizId.substring(0, 8)}...` };
                    }
                }

                setNewLesson({
                    title: lesson.title,
                    type: lesson.type,
                    duration: lesson.duration || '',
                    videoUrl: lesson.videoUrl || '',
                    content: lesson.content?.instructions || '',
                    quizId: quizValue, // This will be either quiz object or empty string
                    isPreview: lesson.isPreview || false
                });
            }
        }
    };

    const handleUpdateLesson = () => {
        if (!newLesson.title.trim() || !editingLesson) return;

        if (newLesson.type === 'quiz' && !newLesson.quizId) {
            toast.error("Please select a quiz for quiz lessons");
            return;
        }

        const updatedModules = modules.map(module => {
            if (module._id === editingLesson.moduleId) {
                return {
                    ...module,
                    lessons: module.lessons.map(lesson => {
                        if (lesson._id === editingLesson.lessonId) {
                            // Create updated lesson
                            const updatedLesson = {
                                ...lesson,
                                title: newLesson.title,
                                type: newLesson.type,
                                duration: Number(newLesson.duration) || 0,
                                videoUrl: newLesson.videoUrl || '',
                                isPreview: newLesson.isPreview
                            };

                            // Handle quizId: ONLY for quiz lessons
                            if (newLesson.type === 'quiz') {
                                // Set quizId for quiz lessons
                                const quizIdValue = newLesson.quizId?.value || newLesson.quizId;
                                if (quizIdValue && quizIdValue.trim() !== '') {
                                    updatedLesson.quizId = quizIdValue;
                                }
                            } else {
                                // Remove quizId for non-quiz lessons
                                delete updatedLesson.quizId;
                            }

                            // Handle content
                            if (newLesson.type === 'article' || newLesson.type === 'quiz' ||
                                newLesson.type === 'project' || newLesson.type === 'practice') {
                                updatedLesson.content = { instructions: newLesson.content || '' };
                            } else {
                                // Remove content for non-content types
                                delete updatedLesson.content;
                            }

                            return updatedLesson;
                        }
                        return lesson;
                    })
                };
            }
            return module;
        });

        setModules(updatedModules);
        updateCourseData('modules', updatedModules);
        setEditingLesson(null);

        // Reset form
        setNewLesson({
            title: '',
            type: 'video',
            duration: '',
            videoUrl: '',
            content: '',
            quizId: '',
            isPreview: false
        });
    };

    const handleDeleteLesson = (moduleId, lessonId) => {
        const updatedModules = modules.map(module => {
            if (module._id === moduleId) {
                return {
                    ...module,
                    lessons: module.lessons.filter(lesson => lesson._id !== lessonId)
                };
            }
            return module;
        });

        setModules(updatedModules);
        updateCourseData('modules', updatedModules);
    };

    const handleReorderLesson = (moduleId, fromIndex, toIndex) => {
        const updatedModules = modules.map(module => {
            if (module._id === moduleId) {
                const newLessons = [...module.lessons];
                const [removed] = newLessons.splice(fromIndex, 1);
                newLessons.splice(toIndex, 0, removed);

                // Update order numbers
                const lessonsWithOrder = newLessons.map((lesson, idx) => ({
                    ...lesson,
                    order: idx + 1
                }));

                return {
                    ...module,
                    lessons: lessonsWithOrder
                };
            }
            return module;
        });

        setModules(updatedModules);
        updateCourseData('modules', updatedModules);
    };

    const getLessonTypeLabel = (type) => {
        const types = {
            video: 'Video',
            article: 'Article',
            quiz: 'Quiz',
            practice: 'Practice',
            project: 'Project',
            download: 'Download'
        };
        return types[type] || type;
    };

    // Check if a lesson is valid (has quizId if it's a quiz type)
    const isLessonValid = (lesson) => {
        if (lesson.type === 'quiz') {
            return !!lesson.quizId && lesson.quizId.trim() !== '';
        }
        return true;
    };

    return (
        <div className="card p-4">
            <div className="mb-4">
                <h3 className="mb-3">Edit Course Content</h3>
                <div className="alert alert-info mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Organize your course content into modules and lessons.
                    {quizzes.length === 0 && (
                        <span className="ms-2 text-warning">
                            <i className="bi bi-exclamation-triangle"></i> No quizzes available. Create quizzes first to add quiz lessons.
                        </span>
                    )}
                </div>
            </div>

            {/* Course Stats */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card text-center border">
                        <div className="card-body">
                            <h4 className="card-title">{modules.length}</h4>
                            <p className="card-text text-muted small">Modules</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-center border">
                        <div className="card-body">
                            <h4 className="card-title">{totalLessons}</h4>
                            <p className="card-text text-muted small">Lessons</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-center border">
                        <div className="card-body">
                            <h4 className="card-title">
                                {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                            </h4>
                            <p className="card-text text-muted small">Total Duration</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card text-center border">
                        <div className="card-body">
                            <h4 className="card-title">{totalQuizzes}</h4>
                            <p className="card-text text-muted small">Quizzes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit Module Form */}
            <div className="card border mb-4 p-3">
                <h5 className="mb-3">
                    {editingModule ? 'Edit Module' : 'Add New Module'}
                </h5>
                <div className="row g-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                className={`form-control ${errors.modules ? 'is-invalid' : ''}`}
                                placeholder="e.g., Introduction to React"
                                value={newModule.title}
                                onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Brief overview of this module (Optional)"
                                value={newModule.description}
                                onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div className="col-12">
                        <button
                            className="btn btn-primary"
                            onClick={editingModule ? handleUpdateModule : handleAddModule}
                            disabled={isSubmitting}
                        >
                            <i className="bi bi-plus me-2"></i>
                            {editingModule ? 'Update Module' : 'Add Module'}
                        </button>
                        {editingModule && (
                            <button
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => {
                                    setEditingModule(null);
                                    setNewModule({ title: '', description: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
                {errors.modules && <div className="text-danger small mt-2">{errors.modules}</div>}
            </div>

            {/* Modules List */}
            {modules.map((module, moduleIndex) => (
                <div className="card border mb-3" key={module._id || moduleIndex}>
                    <div
                        className="card-header bg-light d-flex justify-content-between align-items-center"
                        onClick={() => setExpandedModule(expandedModule === module._id ? null : module._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center">
                            <i className="bi bi-journal-text me-2 text-muted"></i>
                            <h6 className="mb-0">
                                Module {module.order || moduleIndex + 1}: {module.title}
                            </h6>
                            {/* {module.lessons?.some(lesson => !isLessonValid(lesson)) && (
                                <span className="badge bg-warning ms-2">Has Issues</span>
                            )} */}
                        </div>
                        <div className="d-flex align-items-center">
                            <span className="badge bg-secondary me-2">
                                {module.lessons?.length || 0} lessons
                            </span>
                            <button
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditModule(module._id);
                                }}
                                disabled={isSubmitting}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Are you sure you want to delete this module?')) {
                                        handleDeleteModule(module._id);
                                    }
                                }}
                                disabled={isSubmitting}
                            >
                                <Trash size={16} />
                            </button>
                            <i
                                className={`bi ms-2 ${expandedModule === module._id ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                            ></i>
                        </div>
                    </div>

                    {expandedModule === module._id && (
                        <div className="card-body">
                            {module.description && (
                                <p className="text-muted mb-3">{module.description}</p>
                            )}

                            {/* Add/Edit Lesson Form */}
                            <div className="card border mb-4 p-3">
                                <h6 className="mb-3">
                                    {editingLesson?.moduleId === module._id ? 'Edit Lesson' : 'Add Lesson to this Module'}
                                </h6>
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.lessons ? 'is-invalid' : ''}`}
                                                placeholder="e.g., Introduction to Components"
                                                value={newLesson.title}
                                                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <select
                                                className="form-select"
                                                value={newLesson.type}
                                                onChange={(e) => {
                                                    const newType = e.target.value;
                                                    setNewLesson({
                                                        ...newLesson,
                                                        type: newType,
                                                        // Reset quizId if changing from quiz type
                                                        quizId: newType === 'quiz' ? newLesson.quizId : ''
                                                    });
                                                }}
                                                disabled={isSubmitting}
                                            >
                                                <option value="video">Video</option>
                                                {/* <option value="article">Article</option> */}
                                                <option value="quiz">Quiz</option>
                                                <option value="practice">Practice</option>
                                                <option value="project">Project</option>
                                                {/* <option value="download">Download</option> */}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Duration (minutes)"
                                                value={newLesson.duration}
                                                onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="isPreview"
                                                checked={newLesson.isPreview}
                                                onChange={(e) => setNewLesson({ ...newLesson, isPreview: e.target.checked })}
                                                disabled={isSubmitting}
                                            />
                                            <label className="form-check-label" htmlFor="isPreview">
                                                Preview
                                            </label>
                                        </div>
                                    </div>

                                    {newLesson.type === 'video' && (
                                        <div className="col-12">
                                            <div className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                                                    value={newLesson.videoUrl}
                                                    onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {newLesson.type === 'quiz' && (
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="form-label">Select Quiz *</label>
                                                <select
                                                    className={`form-select ${newLesson.type === 'quiz' && !newLesson.quizId ? 'is-invalid' : ''}`}
                                                    value={newLesson.quizId?.value || newLesson.quizId || ''}
                                                    onChange={(e) => {
                                                        const selectedValue = e.target.value;
                                                        if (selectedValue === '') {
                                                            setNewLesson({ ...newLesson, quizId: '' });
                                                        } else {
                                                            const selected = quizzes.find(q => q.value === selectedValue);
                                                            setNewLesson({ ...newLesson, quizId: selected || '' });
                                                        }
                                                    }}
                                                    disabled={isSubmitting || quizzes.length === 0}
                                                >
                                                    <option value="">{quizzes.length === 0 ? "No quizzes available" : "Select a quiz"}</option>
                                                    {quizzes.map(quiz => (
                                                        <option key={quiz.value} value={quiz.value}>{quiz.label}</option>
                                                    ))}
                                                </select>
                                                {quizzes.length === 0 && (
                                                    <div className="text-warning small mt-1">
                                                        <i className="bi bi-exclamation-triangle"></i> You need to create quizzes first
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(newLesson.type === 'article' || newLesson.type === 'practice' || newLesson.type === 'project') && (
                                        <div className="col-12">
                                            <div className="form-group">
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    value={newLesson.content}
                                                    onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                                                    disabled={isSubmitting}
                                                    placeholder="Enter content or instructions..."
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() =>
                                                editingLesson?.moduleId === module._id
                                                    ? handleUpdateLesson()
                                                    : handleAddLesson(module._id)
                                            }
                                            disabled={isSubmitting || (newLesson.type === 'quiz' && !newLesson.quizId)}
                                        >
                                            <i className="bi bi-plus me-1"></i>
                                            {editingLesson?.moduleId === module._id ? 'Update Lesson' : 'Add Lesson'}
                                        </button>
                                        {editingLesson?.moduleId === module._id && (
                                            <button
                                                className="btn btn-sm btn-outline-secondary ms-2"
                                                onClick={() => {
                                                    setEditingLesson(null);
                                                    setNewLesson({
                                                        title: '',
                                                        type: 'video',
                                                        duration: '',
                                                        videoUrl: '',
                                                        content: '',
                                                        quizId: '',
                                                        isPreview: false
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {errors.lessons && <div className="text-danger small mt-2">{errors.lessons}</div>}
                            </div>

                            {/* Lessons List */}
                            <div className="lessons-list">
                                {module.lessons?.map((lesson, lessonIndex) => (
                                    <div
                                        key={lesson._id || lessonIndex}
                                        className={`card border mb-2 p-3 ${!isLessonValid(lesson) ? 'border-warning' : ''}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-list text-muted me-3"></i>
                                                <div>
                                                    <h6 className="mb-1">
                                                        {lesson.title}
                                                        {lesson.isPreview && (
                                                            <span className="badge bg-info ms-2">Preview</span>
                                                        )}
                                                        {lesson.type === 'quiz' && !isLessonValid(lesson) && (
                                                            <span className="badge bg-warning ms-2">Missing Quiz</span>
                                                        )}
                                                    </h6>
                                                    <p className="text-muted small mb-0">
                                                        Type: {getLessonTypeLabel(lesson.type)} • Duration: {lesson.duration || '0'} min
                                                    </p>
                                                    {lesson.type === 'video' && lesson.videoUrl && (
                                                        <p className="text-muted small mb-0">
                                                            Video: {lesson.videoUrl.substring(0, 50)}...
                                                        </p>
                                                    )}
                                                    {lesson.type === 'quiz' && lesson.quizId && (
                                                        <p className="text-muted small mb-0">
                                                            Quiz: {quizzes.find(q => q.value === lesson.quizId)?.label || 'Quiz'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-1"
                                                    onClick={() => handleEditLesson(module._id, lesson._id)}
                                                    disabled={isSubmitting}
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this lesson?')) {
                                                            handleDeleteLesson(module._id, lesson._id);
                                                        }
                                                    }}
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash size={16} />
                                                </button>
                                                <div className="btn-group btn-group-sm ms-2" role="group">
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => lessonIndex > 0 && handleReorderLesson(module._id, lessonIndex, lessonIndex - 1)}
                                                        disabled={isSubmitting || lessonIndex === 0}
                                                    >
                                                        <ArrowUp size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => lessonIndex < module.lessons.length - 1 && handleReorderLesson(module._id, lessonIndex, lessonIndex + 1)}
                                                        disabled={isSubmitting || lessonIndex === module.lessons.length - 1}
                                                    >
                                                        <ArrowDown size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {(!module.lessons || module.lessons.length === 0) && (
                                    <div className="text-center text-muted py-4 border rounded">
                                        <i className="bi bi-journal-text display-6 mb-3"></i>
                                        <p className="mb-0">No lessons in this module yet. Add your first lesson above.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {modules.length === 0 && (
                <div className="alert alert-warning mt-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    No modules added yet. Start by adding your first module above.
                </div>
            )}

            {/* Validation Summary */}
            <div className="mt-4">
                <div className="alert alert-warning">
                    <h6><i className="bi bi-exclamation-triangle me-2"></i>Important Notes:</h6>
                    <ul className="mb-0">
                        <li>All lessons must have a <strong>quizId</strong> field (empty string for non-quiz lessons)</li>
                        <li>Quiz lessons must have a valid quiz selected</li>
                        <li>Check for lessons with <span className="badge bg-warning">Missing Quiz</span> warning</li>
                        <li>Duration is in minutes</li>
                    </ul>
                </div>
            </div>

            {errors.modules && (
                <div className="alert alert-danger mt-2">
                    {errors.modules}
                </div>
            )}
        </div>
    );
};

export default EditContentTab;