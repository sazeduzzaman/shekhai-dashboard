import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { ArrowLeft, Save, X } from 'lucide-react';

const EditLiveSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        instructor: '',
        level: 'Intermediate',
        language: 'English',
        tags: [],
        description: '',
        schedule: {
            startTime: '',
            endTime: '',
            timezone: 'UTC',
            enrollmentDeadline: ''
        },
        isRecurring: false,
        liveDetails: {
            platform: 'Zoom',
            meetingId: '',
            meetingPassword: '',
            meetingUrl: '',
            joinUrl: '',
            streamUrl: ''
        },
        settings: {
            enableChat: true,
            enableQnA: true,
            enablePolls: true
        },
        totalSlots: 100,
        enableWaitlist: false,
        isPaid: false,
        price: 0,
        prerequisites: '',
        whatYouGet: '',
        recordingSettings: {
            recordSession: true,
            autoPublish: false,
            availableForDays: 30,
            allowDownload: false
        },
        sendReminders: true,
        status: 'Active Session'
    });

    // Auth info
    const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    const token = authUser?.token;

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('https://shekhai-server.onrender.com/api/v1/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (data.success) {
                    setCategories(data.categories || []);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (token) {
            fetchCategories();
        }
    }, [token]);

    // Fetch instructors
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const res = await fetch('https://shekhai-server.onrender.com/api/v1/users/instructors/public');
                const data = await res.json();

                if (data.success && data.instructors) {
                    setInstructors(data.instructors);
                }
            } catch (error) {
                console.error('Error fetching instructors:', error);
            }
        };

        fetchInstructors();
    }, []);

    // Fetch session details
    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`https://shekhai-server.onrender.com/api/v1/live-sessions/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (data.success) {
                    const sessionData = data.data;

                    // Format dates for input fields
                    const formattedData = {
                        title: sessionData.title || '',
                        category: sessionData.category || '',
                        // Handle instructor ID correctly
                        instructor: sessionData.instructor?._id || sessionData.instructor || '',
                        level: sessionData.level || 'Intermediate',
                        language: sessionData.language || 'English',
                        tags: sessionData.tags || [],
                        description: sessionData.description || '',
                        schedule: {
                            startTime: sessionData.schedule?.startTime
                                ? new Date(sessionData.schedule.startTime).toISOString().slice(0, 16)
                                : '',
                            endTime: sessionData.schedule?.endTime
                                ? new Date(sessionData.schedule.endTime).toISOString().slice(0, 16)
                                : '',
                            timezone: sessionData.schedule?.timezone || 'UTC',
                            enrollmentDeadline: sessionData.schedule?.enrollmentDeadline
                                ? new Date(sessionData.schedule.enrollmentDeadline).toISOString().slice(0, 16)
                                : ''
                        },
                        isRecurring: sessionData.isRecurring || false,
                        liveDetails: {
                            platform: sessionData.liveDetails?.platform || 'Zoom',
                            meetingId: sessionData.liveDetails?.meetingId || '',
                            meetingPassword: sessionData.liveDetails?.meetingPassword || '',
                            meetingUrl: sessionData.liveDetails?.meetingUrl || '',
                            joinUrl: sessionData.liveDetails?.joinUrl || '',
                            streamUrl: sessionData.liveDetails?.streamUrl || ''
                        },
                        settings: {
                            enableChat: sessionData.settings?.enableChat ?? true,
                            enableQnA: sessionData.settings?.enableQnA ?? true,
                            enablePolls: sessionData.settings?.enablePolls ?? true
                        },
                        totalSlots: sessionData.totalSlots || 100,
                        enableWaitlist: sessionData.enableWaitlist || false,
                        isPaid: sessionData.isPaid || false,
                        price: sessionData.price || 0,
                        prerequisites: sessionData.prerequisites || '',
                        whatYouGet: sessionData.whatYouGet || '',
                        recordingSettings: {
                            recordSession: sessionData.recordingSettings?.recordSession ?? true,
                            autoPublish: sessionData.recordingSettings?.autoPublish || false,
                            availableForDays: sessionData.recordingSettings?.availableForDays || 30,
                            allowDownload: sessionData.recordingSettings?.allowDownload || false
                        },
                        sendReminders: sessionData.sendReminders ?? true,
                        status: sessionData.status || 'Active Session'
                    };

                    console.log('Formatted instructor ID:', formattedData.instructor);
                    setFormData(formattedData);
                } else {
                    toast.error(data.message || 'Failed to fetch session details');
                    navigate('/live-sessions');
                }
            } catch (error) {
                console.error('Error fetching session:', error);
                toast.error('Error loading session details');
                navigate('/live-sessions');
            } finally {
                setLoading(false);
            }
        };

        if (id && token) {
            fetchSessionDetails();
        }
    }, [id, token, navigate]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const parts = name.split('.');
            if (parts.length === 2) {
                const [parent, child] = parts;
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...(prev[parent] || {}),
                        [child]: type === 'checkbox' ? checked : value
                    }
                }));
            }
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'tags') {
            const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag);
            setFormData(prev => ({ ...prev, tags: tagsArray }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            // Validate required fields
            if (!formData.title || !formData.category || !formData.instructor || !formData.description) {
                toast.error('Please fill in all required fields');
                setSubmitting(false);
                return;
            }

            if (!formData.schedule.startTime || !formData.schedule.endTime) {
                toast.error('Please set start and end times');
                setSubmitting(false);
                return;
            }

            const res = await fetch(`https://shekhai-server.onrender.com/api/v1/live-sessions/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Live session updated successfully');
                navigate('/live-sessions');
            } else {
                toast.error(data.message || 'Failed to update live session');
            }
        } catch (error) {
            console.error('Error updating session:', error);
            toast.error('Error updating live session');
        } finally {
            setSubmitting(false);
        }
    };

    // Safe getter for array values
    const getArrayValue = (array) => {
        return Array.isArray(array) ? array : [];
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="container-fluid">
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading session details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs
                    title="Live Sessions"
                    breadcrumbItem="Edit Live Session"
                />

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-outline-secondary me-3"
                                        onClick={() => navigate('/all/live-sessions')}
                                        type="button"
                                    >
                                        <ArrowLeft size={16} />
                                    </button>
                                    <h4 className="card-title mb-0">Edit Live Session</h4>
                                </div>
                            </div>

                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Basic Information */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Basic Information</h5>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Title <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    value={formData.title || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter session title"
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Category <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className="form-select"
                                                    name="category"
                                                    value={formData.category || ''}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat._id} value={cat._id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Instructor <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className="form-select"
                                                    name="instructor"
                                                    value={formData.instructor || ''}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Instructor</option>
                                                    {instructors.map(inst => (
                                                        <option key={inst._id} value={inst._id}>
                                                            {inst.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/* Debug info - remove in production */}
                                                <small className="text-muted">
                                                    Selected ID: {formData.instructor}
                                                </small>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Level</label>
                                                <select
                                                    className="form-select"
                                                    name="level"
                                                    value={formData.level || 'Intermediate'}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Beginner">Beginner</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Advanced">Advanced</option>
                                                    <option value="All Levels">All Levels</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Language</label>
                                                <select
                                                    className="form-select"
                                                    name="language"
                                                    value={formData.language || 'English'}
                                                    onChange={handleChange}
                                                >
                                                    <option value="English">English</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="French">French</option>
                                                    <option value="German">German</option>
                                                    <option value="Chinese">Chinese</option>
                                                    <option value="Arabic">Arabic</option>
                                                    <option value="Bengali">Bengali</option>
                                                    <option value="Hindi">Hindi</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Tags (comma separated)</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="tags"
                                                    value={getArrayValue(formData.tags).join(', ')}
                                                    onChange={handleChange}
                                                    placeholder="javascript, live, workshop"
                                                />
                                                <small className="text-muted">Separate tags with commas</small>
                                            </div>

                                            <div className="col-12 mb-3">
                                                <label className="form-label">
                                                    Description <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="description"
                                                    rows="4"
                                                    value={formData.description || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter detailed description of the live session"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Schedule</h5>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    Start Time <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="schedule.startTime"
                                                    value={formData.schedule?.startTime || ''}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">
                                                    End Time <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="schedule.endTime"
                                                    value={formData.schedule?.endTime || ''}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Timezone</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-light"
                                                    name="schedule.timezone"
                                                    value={formData.schedule?.timezone || 'UTC'}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Enrollment Deadline (Optional)</label>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control"
                                                    name="schedule.enrollmentDeadline"
                                                    value={formData.schedule?.enrollmentDeadline || ''}
                                                    onChange={handleChange}
                                                />
                                                <small className="text-muted">Leave empty if no deadline</small>
                                            </div>

                                            <div className="col-md-12 mb-3">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="isRecurring"
                                                        id="isRecurring"
                                                        checked={formData.isRecurring || false}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="isRecurring">
                                                        Recurring Session
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Live Session Details */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Live Session Details</h5>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Platform</label>
                                                <select
                                                    className="form-select"
                                                    name="liveDetails.platform"
                                                    value={formData.liveDetails?.platform || 'Zoom'}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Zoom">Zoom</option>
                                                    <option value="Google Meet">Google Meet</option>
                                                    <option value="Microsoft Teams">Microsoft Teams</option>
                                                    <option value="Custom">Custom</option>
                                                </select>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Meeting ID</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="liveDetails.meetingId"
                                                    value={formData.liveDetails?.meetingId || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter meeting ID"
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Meeting Password</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="liveDetails.meetingPassword"
                                                    value={formData.liveDetails?.meetingPassword || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter meeting password"
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Meeting URL</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    name="liveDetails.meetingUrl"
                                                    value={formData.liveDetails?.meetingUrl || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://zoom.us/j/123456789"
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Join URL</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    name="liveDetails.joinUrl"
                                                    value={formData.liveDetails?.joinUrl || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://shekhai.com/live/session-name"
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Stream URL</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    name="liveDetails.streamUrl"
                                                    value={formData.liveDetails?.streamUrl || ''}
                                                    onChange={handleChange}
                                                    placeholder="https://stream.shekhai.com/live/session-name"
                                                />
                                            </div>

                                            <div className="col-md-12">
                                                <div className="d-flex gap-3">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="settings.enableChat"
                                                            id="enableChat"
                                                            checked={formData.settings?.enableChat ?? true}
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label" htmlFor="enableChat">
                                                            Enable Chat
                                                        </label>
                                                    </div>

                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="settings.enableQnA"
                                                            id="enableQnA"
                                                            checked={formData.settings?.enableQnA ?? true}
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label" htmlFor="enableQnA">
                                                            Enable Q&A
                                                        </label>
                                                    </div>

                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="settings.enablePolls"
                                                            id="enablePolls"
                                                            checked={formData.settings?.enablePolls ?? true}
                                                            onChange={handleChange}
                                                        />
                                                        <label className="form-check-label" htmlFor="enablePolls">
                                                            Enable Polls
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enrollment & Slots */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Enrollment & Slots</h5>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Total Slots</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name="totalSlots"
                                                    value={formData.totalSlots || 100}
                                                    onChange={handleChange}
                                                    min="1"
                                                />
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <div className="form-check mt-4">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="enableWaitlist"
                                                        id="enableWaitlist"
                                                        checked={formData.enableWaitlist || false}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="enableWaitlist">
                                                        Enable Waitlist
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Pricing</h5>
                                        <div className="row">
                                            <div className="col-md-12 mb-3">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="isPaid"
                                                        id="isPaid"
                                                        checked={formData.isPaid || false}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="isPaid">
                                                        This is a paid session
                                                    </label>
                                                </div>
                                            </div>

                                            {formData.isPaid && (
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Price ($)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="price"
                                                        value={formData.price || 0}
                                                        onChange={handleChange}
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Prerequisites */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Prerequisites</h5>
                                        <textarea
                                            className="form-control"
                                            name="prerequisites"
                                            rows="2"
                                            value={formData.prerequisites || ''}
                                            onChange={handleChange}
                                            placeholder="e.g., Basic JavaScript knowledge"
                                        />
                                    </div>

                                    {/* What You'll Get */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">What You'll Get</h5>
                                        <textarea
                                            className="form-control"
                                            name="whatYouGet"
                                            rows="2"
                                            value={formData.whatYouGet || ''}
                                            onChange={handleChange}
                                            placeholder="e.g., Recording access for 30 days"
                                        />
                                    </div>

                                    {/* Recording Settings */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Recording Settings</h5>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-check mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="recordingSettings.recordSession"
                                                        id="recordSession"
                                                        checked={formData.recordingSettings?.recordSession ?? true}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="recordSession">
                                                        Record Session
                                                    </label>
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="recordingSettings.autoPublish"
                                                        id="autoPublish"
                                                        checked={formData.recordingSettings?.autoPublish || false}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="autoPublish">
                                                        Auto-publish Recording
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label className="form-label">Recording Available For (days)</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="recordingSettings.availableForDays"
                                                        value={formData.recordingSettings?.availableForDays || 30}
                                                        onChange={handleChange}
                                                        min="1"
                                                    />
                                                </div>

                                                <div className="form-check mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="recordingSettings.allowDownload"
                                                        id="allowDownload"
                                                        checked={formData.recordingSettings?.allowDownload || false}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="allowDownload">
                                                        Allow Recording Download
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reminders & Status */}
                                    <div className="mb-4">
                                        <h5 className="mb-3">Reminders & Status</h5>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="sendReminders"
                                                        id="sendReminders"
                                                        checked={formData.sendReminders ?? true}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label" htmlFor="sendReminders">
                                                        Send Reminders to Participants
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Status</label>
                                                <select
                                                    className="form-select"
                                                    name="status"
                                                    value={formData.status || 'Active Session'}
                                                    onChange={handleChange}
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Active Session">Active Session</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/live-sessions')}
                                            disabled={submitting}
                                        >
                                            <X size={16} className="me-1" />
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={16} className="me-1" />
                                                    Update Session
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLiveSession;