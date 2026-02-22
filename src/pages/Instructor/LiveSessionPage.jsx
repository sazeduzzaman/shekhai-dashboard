import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Edit, Eye, Play, StopCircle, Trash } from 'lucide-react';
import { BoxArrowUpRight } from 'react-bootstrap-icons';

const LiveSessionPage = () => {
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    type: '',
    isPaid: ''
  });

  // Auth info
  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const token = authUser?.token;
  const userRole = authUser?.user?.role;

  // Fetch live sessions
  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      // Add filters to query
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.isPaid) queryParams.append('isPaid', filters.isPaid);
      if (search) queryParams.append('search', search);

      const queryString = queryParams.toString();
      const url = `https://shekhai-server.onrender.com/api/v1/live-sessions${queryString ? `?${queryString}` : ''}`;

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        setLiveSessions(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch live sessions');
        setLiveSessions([]);
      }
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      toast.error('Error loading live sessions');
      setLiveSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete live session
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this live session?')) {
      return;
    }

    try {
      const res = await fetch(`https://shekhai-server.onrender.com/api/v1/live-sessions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Live session deleted successfully');
        // Refresh the list
        fetchLiveSessions();
      } else {
        toast.error(data.message || 'Failed to delete live session');
      }
    } catch (error) {
      console.error('Error deleting live session:', error);
      toast.error('Error deleting live session');
    }
  };

  // Start live session
  const handleStartSession = async (id) => {
    try {
      const res = await fetch(`https://shekhai-server.onrender.com/api/v1/live-sessions/${id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Live session started successfully');
        fetchLiveSessions();
      } else {
        toast.error(data.message || 'Failed to start live session');
      }
    } catch (error) {
      console.error('Error starting live session:', error);
      toast.error('Error starting live session');
    }
  };

  // End live session
  const handleEndSession = async (id) => {
    try {
      const res = await fetch(`https://shekhai-server.onrender.com/api/v1/live-sessions/${id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Live session ended successfully');
        fetchLiveSessions();
      } else {
        toast.error(data.message || 'Failed to end live session');
      }
    } catch (error) {
      console.error('Error ending live session:', error);
      toast.error('Error ending live session');
    }
  };

  // Initialize
  useEffect(() => {
    fetchLiveSessions();
  }, [filters, search]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return 'badge bg-success';
      case 'upcoming':
        return 'badge bg-primary';
      case 'completed':
        return 'badge bg-secondary';
      case 'draft':
        return 'badge bg-warning';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-light text-dark';
    }
  };

  // Filtered data
  const filteredData = liveSessions.filter(session => {
    if (search) {
      return session.title.toLowerCase().includes(search.toLowerCase()) ||
        session.description.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Live Sessions" breadcrumbItem="All Live Sessions" />

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-primary-subtle text-primary rounded-2 fs-2">
                      <i className="bi bi-camera-video"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <p className="text-muted mb-1">Total Sessions</p>
                    <h4 className="mb-0">{liveSessions.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-success-subtle text-success rounded-2 fs-2">
                      <i className="bi bi-play-circle"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <p className="text-muted mb-1">Live Now</p>
                    <h4 className="mb-0">{liveSessions.filter(s => s.status === 'live').length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-info-subtle text-info rounded-2 fs-2">
                      <i className="bi bi-calendar-check"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <p className="text-muted mb-1">Upcoming</p>
                    <h4 className="mb-0">{liveSessions.filter(s => s.status === 'upcoming').length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-warning-subtle text-warning rounded-2 fs-2">
                      <i className="bi bi-cash-coin"></i>
                    </span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <p className="text-muted mb-1">Paid Sessions</p>
                    <h4 className="mb-0">{liveSessions.filter(s => s.isPaid).length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search sessions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">All Types</option>
                  <option value="live">Live</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="on-demand">On Demand</option>
                </select>
              </div>

              <div className="col-md-2">
                <select
                  className="form-select"
                  value={filters.isPaid}
                  onChange={(e) => setFilters({ ...filters, isPaid: e.target.value })}
                >
                  <option value="">All Pricing</option>
                  <option value="true">Paid</option>
                  <option value="false">Free</option>
                </select>
              </div>

              <div className="col-md-3">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setFilters({
                        status: '',
                        category: '',
                        type: '',
                        isPaid: ''
                      });
                      setSearch('');
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Reset
                  </button>

                  <Link to="/live-sessions/create" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-1"></i>
                    Create Live Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Sessions Table */}
        <div className="card">
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading live sessions...</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="bi bi-camera-video-slash display-4 text-muted"></i>
                </div>
                <h4>No live sessions found</h4>
                <p className="text-muted mb-4">
                  {search || Object.values(filters).some(f => f)
                    ? 'Try changing your search or filters'
                    : 'Create your first live session to get started'}
                </p>
                <Link to="/live-sessions/create" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-1"></i>
                  Create Live Session
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-centered table-nowrap mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Session</th>
                      <th>Instructor</th>
                      <th>Schedule</th>
                      <th>Status</th>
                      <th>Slots</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((session, index) => (
                      <tr key={session._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div>
                            <h6 className="mb-1">{session.title}</h6>
                            <p className="text-muted mb-0 small" style={{ maxWidth: '300px' }}>
                              {session.description.substring(0, 80)}...
                            </p>
                            <div className="mt-1">
                              <span className="badge bg-light text-dark me-1">
                                {session.category}
                              </span>
                              {session.tags?.slice(0, 2).map((tag, i) => (
                                <span key={i} className="badge bg-light text-dark me-1">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{session.instructor?.name || 'N/A'}</strong>
                            <br />
                            <small className="text-muted">
                              {session.instructor?.email || session.instructor}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div><strong>Start:</strong> {formatDate(session.schedule?.startTime)}</div>
                            <div><strong>End:</strong> {formatDate(session.schedule?.endTime)}</div>
                            <div className="text-muted small">
                              Duration: {session.schedule?.duration || 0} mins
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={getStatusBadge(session.status)}>
                            {session.status?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div>
                            <div className="progress" style={{ height: '6px' }}>
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${((session.totalSlots - session.availableSlots) / session.totalSlots) * 100}%`
                                }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {session.totalSlots - session.availableSlots} / {session.totalSlots} filled
                            </small>
                          </div>
                        </td>
                        <td>
                          {session.isPaid ? (
                            <div>
                              <strong className="text-success">${session.price}</strong>
                              {session.discountedPrice && (
                                <div className="text-muted small">
                                  <s>${session.discountedPrice}</s>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="badge bg-success">FREE</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {/* View Details */}
                            {/* <Link
                              to={`/live-sessions/view/${session._id}`}
                              className="btn btn-sm btn-outline-primary"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </Link> */}

                            {/* Edit */}
                            <Link
                              to={`/live-sessions/edit/${session._id}`}
                              className="btn btn-sm btn-outline-warning"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>

                            {/* Start Session Button (only for upcoming) */}
                            {session.status === 'upcoming' && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleStartSession(session._id)}
                                title="Start Session"
                              >
                                <Play size={16} />
                              </button>
                            )}

                            {/* End Session Button (only for live) */}
                            {session.status === 'live' && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleEndSession(session._id)}
                                title="End Session"
                              >
                                <StopCircle size={16} />
                              </button>
                            )}

                            {/* Join Button (for live sessions) */}
                            {session.status === 'live' && session.liveDetails?.meetingUrl && (
                              <a
                                href={session.liveDetails.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-info"
                                title="Join Session"
                              >
                                <BoxArrowUpRight size={16} />
                              </a>
                            )}

                            {/* Delete */}
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(session._id)}
                              title="Delete"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionPage;