import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '../../components/Common/Breadcrumb';

const CreateLiveSessionPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetchingInstructors, setFetchingInstructors] = useState(true);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  // Timezone options
  const timezones = [
    'UTC',
    'Asia/Dhaka',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney'
  ];

  // Level options
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Language options
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi', 'Bengali'];

  // Platform options
  const platforms = [
    { value: 'zoom', label: 'Zoom' },
    { value: 'teams', label: 'Microsoft Teams' },
    { value: 'meet', label: 'Google Meet' },
    { value: 'custom', label: 'Custom Platform' }
  ];

  // Form state with all fields from JSON
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    type: 'live',
    isPaid: false,
    price: 0,
    currency: 'USD',
    discountedPrice: '',
    status: 'upcoming',
    schedule: {
      startTime: '',
      endTime: '',
      timezone: 'UTC',
      recurring: false,
      recurrencePattern: null
    },
    liveDetails: {
      platform: 'zoom',
      meetingId: '',
      meetingPassword: '',
      meetingUrl: '',
      joinUrl: '',
      streamUrl: '',
      chatEnabled: true,
      qaEnabled: true,
      pollsEnabled: true
    },
    totalSlots: 100,
    availableSlots: 100,
    enrollmentDeadline: '',
    waitlistEnabled: false,
    maxWaitlist: 50,
    prerequisites: [''],
    whatYoullGet: [''],
    recordSession: true,
    autoPublishRecording: true,
    recordingAvailableFor: 30,
    recordingDownloadable: false,
    sendReminders: true,
    language: 'English',
    level: 'Intermediate',
    tags: [],
    isActive: true
  });

  // Auth info
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
  const token = authUser?.token;
  const userRole = authUser?.user?.role;
  const userId = authUser?.user?._id;

  // Fetch instructors from public endpoint
  useEffect(() => {
    const fetchInstructors = async () => {
      setFetchingInstructors(true);

      try {
        console.log('Fetching instructors from public endpoint...');

        const res = await fetch('https://shekhai-server.onrender.com/api/v1/users/instructors/public');

        if (res.ok) {
          const data = await res.json();
          console.log('Instructors data received:', data);

          // Handle the response based on the structure
          let instructorsList = [];

          if (data.success && data.instructors && Array.isArray(data.instructors)) {
            // Your exact response structure: { success: true, count: 3, instructors: [...] }
            instructorsList = data.instructors;
            console.log('Extracted instructors list:', instructorsList);
          } else if (Array.isArray(data)) {
            instructorsList = data;
          } else if (data.data && Array.isArray(data.data)) {
            instructorsList = data.data;
          } else if (data.users) {
            instructorsList = data.users;
          }

          console.log('Final instructors list to set:', instructorsList);
          setInstructors(instructorsList);

          // If user is instructor, auto-select themselves
          if (userRole === 'instructor' && userId) {
            console.log('Auto-selecting instructor as self:', userId);

            // Check if current user is in the instructors list
            const currentUserInList = instructorsList.some(inst =>
              inst._id === userId || inst.id === userId
            );

            if (currentUserInList) {
              setFormData(prev => ({
                ...prev,
                instructor: userId
              }));
            } else {
              // If current user is not in list but is instructor, add them
              const currentUser = {
                _id: userId,
                name: authUser?.user?.name || authUser?.user?.username || 'You',
                email: authUser?.user?.email,
                role: 'instructor'
              };
              setInstructors(prev => [...prev, currentUser]);
              setFormData(prev => ({
                ...prev,
                instructor: userId
              }));
            }
          }
        } else {
          console.log('Failed to fetch instructors:', res.status);
          toast.error('Failed to load instructors');
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        toast.error('Error loading instructors');
      } finally {
        setFetchingInstructors(false);
      }
    };

    fetchInstructors();
  }, [userRole, userId, authUser]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setFetchingCategories(true);

      try {
        const res = await fetch('https://shekhai-server.onrender.com/api/v1/categories');

        if (res.ok) {
          const data = await res.json();
          console.log('Categories response:', data);

          let categoriesList = [];

          if (data.success && data.categories && Array.isArray(data.categories)) {
            categoriesList = data.categories;
          } else if (data.data && Array.isArray(data.data)) {
            categoriesList = data.data;
          } else if (Array.isArray(data)) {
            categoriesList = data;
          }

          setCategories(categoriesList);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle array field changes (prerequisites, whatYoullGet)
  const handleArrayFieldChange = (fieldName, index, value) => {
    const newArray = [...formData[fieldName]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [fieldName]: newArray }));
  };

  const addArrayField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayField = (fieldName, index) => {
    const newArray = formData[fieldName].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [fieldName]: newArray }));
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }

    if (!formData.instructor) {
      toast.error('Instructor is required');
      return;
    }

    if (!formData.category) {
      toast.error('Category is required');
      return;
    }

    if (!formData.schedule.startTime || !formData.schedule.endTime) {
      toast.error('Start time and end time are required');
      return;
    }

    setLoading(true);

    try {
      // Calculate duration in minutes
      const startTime = new Date(formData.schedule.startTime);
      const endTime = new Date(formData.schedule.endTime);
      const duration = Math.round((endTime - startTime) / (1000 * 60));

      // Prepare data
      const submitData = {
        ...formData,
        // Convert price to number
        price: formData.isPaid ? parseFloat(formData.price) : 0,
        discountedPrice: formData.discountedPrice ? parseFloat(formData.discountedPrice) : null,
        // Add duration to schedule
        schedule: {
          ...formData.schedule,
          duration,
          startTime: new Date(formData.schedule.startTime).toISOString(),
          endTime: new Date(formData.schedule.endTime).toISOString(),
          enrollmentDeadline: formData.enrollmentDeadline
            ? new Date(formData.enrollmentDeadline).toISOString()
            : null
        },
        // Clean empty strings from arrays
        prerequisites: formData.prerequisites.filter(p => p.trim()),
        whatYoullGet: formData.whatYoullGet.filter(w => w.trim()),
        tags: formData.tags.filter(t => t.trim())
      };

      console.log('Submitting data:', submitData);

      const res = await fetch('https://shekhai-server.onrender.com/api/v1/live-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Live session created successfully!');
        navigate('/live-sessions');
      } else {
        toast.error(data.message || 'Failed to create live session');
      }
    } catch (error) {
      console.error('Error creating live session:', error);
      toast.error('Error creating live session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Live Sessions" breadcrumbItem="Create Live Session" />

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">Create New Live Session</h4>

                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Basic Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Title *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Enter session title"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Category *</label>
                          <select
                            className="form-select"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            disabled={fetchingCategories}
                          >
                            <option value="">
                              {fetchingCategories ? 'Loading categories...' : 'Select Category'}
                            </option>
                            {categories.map(category => (
                              <option key={category._id} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Instructor Field */}
                        {/* Instructor Field */}
                        {/* Instructor Field */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Instructor *</label>
                          {userRole === 'instructor' ? (
                            <input
                              type="text"
                              className="form-control"
                              value={authUser?.user?.name || authUser?.user?.email || 'You'}
                              disabled
                            />
                          ) : (
                            <>
                              <select
                                className="form-select"
                                value={formData.instructor}
                                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                                required
                              >
                                <option value="">Select Instructor</option>
                                {instructors.map(instructor => (
                                  <option key={instructor._id} value={instructor._id}>
                                    {instructor.name}
                                  </option>
                                ))}
                              </select>
                              {instructors.length === 0 && (
                                <small className="text-muted">No instructors available</small>
                              )}
                            </>
                          )}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Level</label>
                          <select
                            className="form-select"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          >
                            {levels.map(level => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Language</label>
                          <select
                            className="form-select"
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                          >
                            {languages.map(lang => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Tags (comma separated)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="javascript, live, workshop"
                            value={formData.tags.join(', ')}
                            onChange={handleTagsChange}
                          />
                          <small className="text-muted">Separate tags with commas</small>
                        </div>

                        <div className="col-md-12 mb-3">
                          <label className="form-label">Description *</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            placeholder="Enter detailed description of the live session"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Schedule</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Start Time *</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.schedule.startTime}
                            onChange={(e) => setFormData({
                              ...formData,
                              schedule: { ...formData.schedule, startTime: e.target.value }
                            })}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">End Time *</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.schedule.endTime}
                            onChange={(e) => setFormData({
                              ...formData,
                              schedule: { ...formData.schedule, endTime: e.target.value }
                            })}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Timezone</label>
                          <select
                            className="form-select"
                            value={formData.schedule.timezone}
                            onChange={(e) => setFormData({
                              ...formData,
                              schedule: { ...formData.schedule, timezone: e.target.value }
                            })}
                          >
                            {timezones.map(tz => (
                              <option key={tz} value={tz}>{tz}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Enrollment Deadline (Optional)</label>
                          <input
                            type="datetime-local"
                            className="form-control"
                            value={formData.enrollmentDeadline}
                            onChange={(e) => setFormData({ ...formData, enrollmentDeadline: e.target.value })}
                          />
                          <small className="text-muted">Leave empty if no deadline</small>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="recurring"
                              checked={formData.schedule.recurring}
                              onChange={(e) => setFormData({
                                ...formData,
                                schedule: { ...formData.schedule, recurring: e.target.checked }
                              })}
                            />
                            <label className="form-check-label" htmlFor="recurring">
                              Recurring Session
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Session Details */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Live Session Details</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Platform</label>
                          <select
                            className="form-select"
                            value={formData.liveDetails.platform}
                            onChange={(e) => setFormData({
                              ...formData,
                              liveDetails: { ...formData.liveDetails, platform: e.target.value }
                            })}
                          >
                            {platforms.map(platform => (
                              <option key={platform.value} value={platform.value}>
                                {platform.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Meeting ID</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.liveDetails.meetingId}
                            onChange={(e) => setFormData({
                              ...formData,
                              liveDetails: { ...formData.liveDetails, meetingId: e.target.value }
                            })}
                            placeholder="Enter meeting ID"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Meeting Password</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.liveDetails.meetingPassword}
                            onChange={(e) => setFormData({
                              ...formData,
                              liveDetails: { ...formData.liveDetails, meetingPassword: e.target.value }
                            })}
                            placeholder="Enter meeting password"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Meeting URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={formData.liveDetails.meetingUrl}
                            onChange={(e) => setFormData({
                              ...formData,
                              liveDetails: { ...formData.liveDetails, meetingUrl: e.target.value }
                            })}
                            placeholder="https://zoom.us/j/123456789"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Join URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={formData.liveDetails.joinUrl}
                            onChange={(e) => setFormData({
                              ...formData,
                              liveDetails: { ...formData.liveDetails, joinUrl: e.target.value }
                            })}
                            placeholder="https://shekhai.com/live/session-name"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label className="form-label">Stream URL</label>
                          <input
                            type="url"
                            className="form-control"
                            value={formData.liveDetails.streamUrl}
                            onChange={(e) => setFormData({
                              ...formData,
                              liveDetails: { ...formData.liveDetails, streamUrl: e.target.value }
                            })}
                            placeholder="https://stream.shekhai.com/live/session-name"
                          />
                        </div>

                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="chatEnabled"
                                  checked={formData.liveDetails.chatEnabled}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    liveDetails: { ...formData.liveDetails, chatEnabled: e.target.checked }
                                  })}
                                />
                                <label className="form-check-label" htmlFor="chatEnabled">
                                  Enable Chat
                                </label>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="qaEnabled"
                                  checked={formData.liveDetails.qaEnabled}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    liveDetails: { ...formData.liveDetails, qaEnabled: e.target.checked }
                                  })}
                                />
                                <label className="form-check-label" htmlFor="qaEnabled">
                                  Enable Q&A
                                </label>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="pollsEnabled"
                                  checked={formData.liveDetails.pollsEnabled}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    liveDetails: { ...formData.liveDetails, pollsEnabled: e.target.checked }
                                  })}
                                />
                                <label className="form-check-label" htmlFor="pollsEnabled">
                                  Enable Polls
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment & Slots */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Enrollment & Slots</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Total Slots</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.totalSlots}
                            onChange={(e) => setFormData({ ...formData, totalSlots: parseInt(e.target.value) || 0 })}
                            min="1"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="waitlistEnabled"
                              checked={formData.waitlistEnabled}
                              onChange={(e) => setFormData({ ...formData, waitlistEnabled: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="waitlistEnabled">
                              Enable Waitlist
                            </label>
                          </div>
                        </div>

                        {formData.waitlistEnabled && (
                          <div className="col-md-6 mb-3">
                            <label className="form-label">Max Waitlist Size</label>
                            <input
                              type="number"
                              className="form-control"
                              value={formData.maxWaitlist}
                              onChange={(e) => setFormData({ ...formData, maxWaitlist: parseInt(e.target.value) || 0 })}
                              min="1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Pricing</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="isPaid"
                              checked={formData.isPaid}
                              onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="isPaid">
                              This is a paid session
                            </label>
                          </div>
                        </div>

                        {formData.isPaid && (
                          <>
                            <div className="col-md-6 mb-3">
                              <label className="form-label">Price ($)</label>
                              <input
                                type="number"
                                className="form-control"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                min="0"
                                step="0.01"
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">Discounted Price ($) (Optional)</label>
                              <input
                                type="number"
                                className="form-control"
                                value={formData.discountedPrice}
                                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                                min="0"
                                step="0.01"
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">Currency</label>
                              <input
                                type="text"
                                className="form-control"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Prerequisites</h5>
                    </div>
                    <div className="card-body">
                      {formData.prerequisites.map((prereq, index) => (
                        <div className="row mb-3" key={index}>
                          <div className="col-md-10">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Basic JavaScript knowledge"
                              value={prereq}
                              onChange={(e) => handleArrayFieldChange('prerequisites', index, e.target.value)}
                            />
                          </div>
                          <div className="col-md-2">
                            {formData.prerequisites.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeArrayField('prerequisites', index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => addArrayField('prerequisites')}
                      >
                        Add Prerequisite
                      </button>
                    </div>
                  </div>

                  {/* What You'll Get */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">What You'll Get</h5>
                    </div>
                    <div className="card-body">
                      {formData.whatYoullGet.map((item, index) => (
                        <div className="row mb-3" key={index}>
                          <div className="col-md-10">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Recording access for 30 days"
                              value={item}
                              onChange={(e) => handleArrayFieldChange('whatYoullGet', index, e.target.value)}
                            />
                          </div>
                          <div className="col-md-2">
                            {formData.whatYoullGet.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeArrayField('whatYoullGet', index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => addArrayField('whatYoullGet')}
                      >
                        Add Benefit
                      </button>
                    </div>
                  </div>

                  {/* Recording Settings */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Recording Settings</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="recordSession"
                              checked={formData.recordSession}
                              onChange={(e) => setFormData({ ...formData, recordSession: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="recordSession">
                              Record Session
                            </label>
                          </div>
                        </div>

                        {formData.recordSession && (
                          <>
                            <div className="col-md-6 mb-3">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="autoPublishRecording"
                                  checked={formData.autoPublishRecording}
                                  onChange={(e) => setFormData({ ...formData, autoPublishRecording: e.target.checked })}
                                />
                                <label className="form-check-label" htmlFor="autoPublishRecording">
                                  Auto-publish Recording
                                </label>
                              </div>
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label">Recording Available For (days)</label>
                              <input
                                type="number"
                                className="form-control"
                                value={formData.recordingAvailableFor}
                                onChange={(e) => setFormData({ ...formData, recordingAvailableFor: parseInt(e.target.value) || 0 })}
                                min="1"
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="recordingDownloadable"
                                  checked={formData.recordingDownloadable}
                                  onChange={(e) => setFormData({ ...formData, recordingDownloadable: e.target.checked })}
                                />
                                <label className="form-check-label" htmlFor="recordingDownloadable">
                                  Allow Recording Download
                                </label>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="col-md-6 mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="sendReminders"
                              checked={formData.sendReminders}
                              onChange={(e) => setFormData({ ...formData, sendReminders: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="sendReminders">
                              Send Reminders to Participants
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="card border mb-4">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">Status</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="isActive"
                              checked={formData.isActive}
                              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            />
                            <label className="form-check-label" htmlFor="isActive">
                              Active Session
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/live-sessions')}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        'Create Live Session'
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

export default CreateLiveSessionPage;