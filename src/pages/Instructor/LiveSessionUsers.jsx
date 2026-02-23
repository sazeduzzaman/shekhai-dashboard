import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    Download,
    Search,
    Calendar,
    Clock,
    Mail,
    Phone,
    User as UserIcon,
    CreditCard,
    CheckCircle,
    XCircle,
    Clock as ClockIcon,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Filter,
    Eye,
    DollarSign,
    Trash2,
    Award,
    BookOpen,
    Mail as MailIcon,
    AlertCircle,
    Video
} from "lucide-react";
import axios from "axios";
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

const API_BASE_URL = "https://shekhai-server.onrender.com/api/v1";

const LiveSessionUsers = () => {
    const navigate = useNavigate();

    // State Management
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState("");
    const [selectedSession, setSelectedSession] = useState(null);
    const [enrolledUsers, setEnrolledUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal States
    const [showUserModal, setShowUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Stats State
    const [stats, setStats] = useState({
        total: 0,
        enrolled: 0,
        attended: 0,
        cancelled: 0,
        revenue: 0
    });

    const itemsPerPage = 10;

    // Get auth token from localStorage
    const getToken = () => {
        return localStorage.getItem('token') ||
            sessionStorage.getItem('token') ||
            localStorage.getItem('authUser');
    };

    // Create axios instance with auth header
    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Add token to requests if available
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Fetch all live sessions on component mount
    useEffect(() => {
        fetchAllSessions();
    }, []);

    // Fetch session details when session is selected
    useEffect(() => {
        if (selectedSessionId) {
            const session = sessions.find(s => s._id === selectedSessionId);
            setSelectedSession(session);
            fetchSessionDetails(selectedSessionId);
        } else {
            setSelectedSession(null);
            setEnrolledUsers([]);
            setFilteredUsers([]);
        }
    }, [selectedSessionId, sessions]);

    // Filter users based on search and status
    useEffect(() => {
        filterUsers();
    }, [enrolledUsers, searchTerm, statusFilter]);

    // Calculate stats whenever enrolled users change
    useEffect(() => {
        calculateStats();
    }, [enrolledUsers]);

    const fetchAllSessions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/live-sessions?limit=100');

            if (response.data.success) {
                setSessions(response.data.data);
            } else {
                toast.error("Failed to load sessions");
            }
        } catch (error) {
            console.error("Error fetching sessions:", error);
            toast.error("Error loading sessions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await api.get(`/users/${userId}`);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return null;
        }
    };

    const fetchSessionDetails = async (sessionId) => {
        if (!sessionId) return;

        try {
            setUsersLoading(true);
            const response = await api.get(`/live-sessions/${sessionId}`);

            if (response.data.success) {
                const sessionData = response.data.data;
                const enrollments = sessionData.enrolledUsers || [];

                // First, collect all unique user IDs from enrollments
                const userIds = enrollments.map(enrollment => {
                    // Handle both cases: user object or user ID string
                    if (typeof enrollment.user === 'object' && enrollment.user !== null) {
                        return enrollment.user._id || enrollment.user;
                    }
                    return enrollment.user;
                }).filter(id => id); // Remove any null/undefined values

                // Fetch all user details in parallel
                const userDetailsPromises = userIds.map(userId => fetchUserDetails(userId));
                const userDetailsResults = await Promise.all(userDetailsPromises);

                // Create a map of user ID to user details for easy lookup
                const userDetailsMap = {};
                userIds.forEach((userId, index) => {
                    if (userDetailsResults[index]) {
                        userDetailsMap[userId] = userDetailsResults[index];
                    }
                });

                // Format users with their details
                const formattedUsers = enrollments.map((enrollment, index) => {
                    // Get user ID
                    let userId;
                    if (typeof enrollment.user === 'object' && enrollment.user !== null) {
                        userId = enrollment.user._id || enrollment.user;
                    } else {
                        userId = enrollment.user;
                    }

                    // Get user details from map
                    const userDetails = userDetailsMap[userId] || {};

                    return {
                        id: enrollment._id || `user-${index}`,
                        userId: userId || 'N/A',
                        name: userDetails.name || 'N/A',
                        email: userDetails.email || 'N/A',
                        phone: userDetails.phone || 'N/A',
                        status: enrollment.status || 'enrolled',
                        enrolledAt: enrollment.enrollmentDate,
                        attended: enrollment.attended || false,
                        paymentInfo: {
                            amount: enrollment.paymentInfo?.amount || 0,
                            method: enrollment.paymentInfo?.paymentMethod || 'N/A',
                            status: enrollment.paymentInfo?.paymentStatus || 'N/A',
                            transactionId: enrollment.paymentInfo?.transactionId || 'N/A',
                            paymentId: enrollment.paymentInfo?.paymentId || 'N/A',
                            paidAt: enrollment.paymentInfo?.paidAt || null
                        }
                    };
                });

                setEnrolledUsers(formattedUsers);
                setCurrentPage(1);
            } else {
                toast.error("Failed to load session details");
            }
        } catch (error) {
            console.error("Error fetching session details:", error);
            toast.error("Error loading registered users.");
        } finally {
            setUsersLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = [...enrolledUsers];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.phone && user.phone.includes(searchTerm))
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.status === statusFilter);
        }

        setFilteredUsers(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1);
    };

    const calculateStats = () => {
        const enrolled = enrolledUsers.filter(u => u.status === 'enrolled').length;
        const attended = enrolledUsers.filter(u => u.attended).length;
        const cancelled = enrolledUsers.filter(u => u.status === 'cancelled').length;
        const revenue = enrolledUsers
            .filter(u => u.paymentInfo?.status === 'completed')
            .reduce((sum, u) => sum + (u.paymentInfo?.amount || 0), 0);

        setStats({
            total: enrolledUsers.length,
            enrolled,
            attended,
            cancelled,
            revenue
        });
    };

    const handleSessionChange = (e) => {
        setSelectedSessionId(e.target.value);
        setSearchTerm("");
        setStatusFilter("all");
    };

    const handleRefresh = async () => {
        if (!selectedSessionId) return;
        setRefreshing(true);
        await fetchSessionDetails(selectedSessionId);
        setRefreshing(false);
        toast.success("Data refreshed!");
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleCloseModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete || !selectedSessionId) return;

        setDeleteLoading(true);
        try {
            // API call to remove user from session
            await api.delete(`/live-sessions/${selectedSessionId}/users/${userToDelete.userId}`);

            // Update local state
            const updatedUsers = enrolledUsers.filter(u => u.id !== userToDelete.id);
            setEnrolledUsers(updatedUsers);

            toast.success(`User ${userToDelete.name} removed successfully`);
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to remove user. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleExportExcel = () => {
        if (!selectedSession) return;

        const exportData = filteredUsers.map((user, index) => ({
            '#': index + 1,
            'Name': user.name,
            'Email': user.email,
            'Phone': user.phone,
            'Status': user.status.charAt(0).toUpperCase() + user.status.slice(1),
            'Enrolled Date': user.enrolledAt ? new Date(user.enrolledAt).toLocaleDateString() : 'N/A',
            'Amount': user.paymentInfo?.amount || 0,
            'Payment Method': user.paymentInfo?.method || 'N/A',
            'Transaction ID': user.paymentInfo?.transactionId || 'N/A',
            'Attended': user.attended ? 'Yes' : 'No'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "Registered Users");
        XLSX.writeFile(wb, `live-session-${selectedSession.title || 'users'}.xlsx`);

        toast.success("Excel file downloaded!");
    };

    const handleExportCSV = () => {
        if (!selectedSession) return;

        const headers = ['#', 'Name', 'Email', 'Phone', 'Status', 'Enrolled Date', 'Amount', 'Payment Method', 'Transaction ID', 'Attended'];
        const csvData = filteredUsers.map((user, index) => [
            index + 1,
            user.name,
            user.email,
            user.phone,
            user.status,
            user.enrolledAt ? new Date(user.enrolledAt).toLocaleDateString() : 'N/A',
            user.paymentInfo?.amount || 0,
            user.paymentInfo?.method || 'N/A',
            user.paymentInfo?.transactionId || 'N/A',
            user.attended ? 'Yes' : 'No'
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `live-session-${selectedSession.title || 'users'}.csv`;
        link.click();

        toast.success("CSV file downloaded!");
    };

    const getStatusBadge = (status) => {
        const badges = {
            enrolled: { color: 'primary', text: 'Enrolled' },
            attended: { color: 'success', text: 'Attended' },
            cancelled: { color: 'danger', text: 'Cancelled' },
            waitlisted: { color: 'warning', text: 'Waitlisted' }
        };

        const safeStatus = status && typeof status === 'string' ? status.toLowerCase() : 'enrolled';
        const badge = badges[safeStatus] || badges.enrolled;

        return <span className={`badge bg-${badge.color} rounded-pill`}>{badge.text}</span>;
    };

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, type = 'instructor') => {
        if (!amount || amount === 0) return '$0';

        const platformFee = 10;
        const taxRate = 0.10;
        const tax = amount * taxRate;
        const instructorAmount = amount - platformFee - tax;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });

        switch (type) {
            case 'original':
                return formatter.format(amount);
            case 'tax':
                return formatter.format(tax);
            case 'fee':
                return formatter.format(platformFee);
            case 'instructor':
            default:
                return formatter.format(instructorAmount);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-link text-dark p-0 text-decoration-none"
                >
                    <ArrowLeft size={20} className="me-2" />
                    Back
                </button>
                <h4 className="mb-0">Live Session Registered Users</h4>
                {selectedSessionId && (
                    <button
                        className="btn btn-outline-secondary rounded-circle p-2"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        style={{ width: '40px', height: '40px' }}
                    >
                        <RefreshCw size={18} className={refreshing ? 'spinner' : ''} />
                    </button>
                )}
            </div>

            {/* Session Selector */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body py-3">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold mb-2">Select Live Session</label>
                            <select
                                className="form-select"
                                value={selectedSessionId}
                                onChange={handleSessionChange}
                            >
                                <option value="">-- Choose a live session --</option>
                                {sessions.map((session) => (
                                    <option key={session._id} value={session._id}>
                                        {session.title} - {new Date(session.schedule?.startTime).toLocaleDateString()}
                                        ({session.metadata?.totalEnrollments || 0}/{session.totalSlots} enrolled)
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            {selectedSession && (
                                <div className="card shadow-sm border-0 mb-0">
                                    <div className="card-body py-3">
                                        <div className="row align-items-center">
                                            <div className="col-md-8">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                                                        <Video size={24} className="text-primary" />
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-1">{selectedSession.title}</h5>
                                                        <div className="d-flex gap-3">
                                                            <small className="text-muted">
                                                                <Calendar size={12} className="me-1" />
                                                                {formatDate(selectedSession.schedule?.startTime)}
                                                            </small>
                                                            <small className="text-muted">
                                                                <Clock size={12} className="me-1" />
                                                                {new Date(selectedSession.schedule?.startTime).toLocaleTimeString()}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* {selectedSession && (
                            <div className="col-md-6 text-md-end mt-3 mt-md-0">
                                <div className="d-flex gap-2 justify-content-md-end">
                                    <button className="btn btn-success btn-sm" onClick={handleExportExcel}>
                                        <Download size={14} className="me-2" />
                                        Excel
                                    </button>
                                    <button className="btn btn-primary btn-sm" onClick={handleExportCSV}>
                                        <Download size={14} className="me-2" />
                                        CSV
                                    </button>
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>

            {/* Session Info Bar (only if session selected) */}


            {/* Stats Cards (only if session selected and users exist) */}
            {selectedSession && enrolledUsers.length > 0 && (
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card bg-primary text-white border-0 shadow-sm">
                            <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">Total Registrations</h6>
                                        <h3 className="mb-0">{stats.total}</h3>
                                    </div>
                                    <Users size={32} className="opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-success text-white border-0 shadow-sm">
                            <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">Attended</h6>
                                        <h3 className="mb-0">{stats.attended}</h3>
                                    </div>
                                    <CheckCircle size={32} className="opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-warning text-white border-0 shadow-sm">
                            <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">Enrolled</h6>
                                        <h3 className="mb-0">{stats.enrolled}</h3>
                                    </div>
                                    <ClockIcon size={32} className="opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card bg-info text-white border-0 shadow-sm">
                            <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">Total Revenue</h6>
                                        <h3 className="mb-0">{formatCurrency(stats.revenue)}</h3>
                                        <small className="opacity-75">
                                            After ${stats.revenue ? Math.floor(stats.revenue * 0.1) : 0} tax + $10 Platform fee
                                        </small>
                                    </div>
                                    <DollarSign size={32} className="opacity-50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Bar (only if session selected and users exist) */}
            {selectedSession && enrolledUsers.length > 0 && (
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body py-3">
                        <div className="row g-3">
                            <div className="col-md-7">
                                <div className="position-relative">
                                    <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                                    <input
                                        type="text"
                                        className="form-control form-control-sm ps-5"
                                        placeholder="Search by name, email, or phone..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="d-flex align-items-center">
                                    <Filter size={16} className="text-muted me-2" />
                                    <select
                                        className="form-select form-select-sm"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="enrolled">Enrolled</option>
                                        <option value="attended">Attended</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* No Session Selected Message */}
            {!selectedSessionId && (
                <div className="card shadow-sm border-0">
                    <div className="card-body text-center py-5">
                        <Video size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">No Session Selected</h5>
                        <p className="text-muted mb-0">Please select a live session from the dropdown above to view registered users.</p>
                    </div>
                </div>
            )}

            {/* No Users Message */}
            {selectedSessionId && enrolledUsers.length === 0 && !usersLoading && (
                <div className="card shadow-sm border-0">
                    <div className="card-body text-center py-5">
                        <Users size={48} className="text-muted mb-3" />
                        <h5 className="text-muted">No Registered Users</h5>
                        <p className="text-muted mb-0">This session doesn't have any registered users yet.</p>
                    </div>
                </div>
            )}

            {/* Users Table */}
            {selectedSessionId && enrolledUsers.length > 0 && (
                <div className="card shadow-sm border-0">
                    {usersLoading ? (
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="text-muted mb-0">Loading registered users...</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table table-hover table-centered table-nowrap mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: '50px' }}>#</th>
                                            <th>User Details</th>
                                            <th>Contact</th>
                                            <th>Status</th>
                                            <th>Enrolled Date</th>
                                            <th>Total Amount</th>
                                            <th>Current Payment</th>
                                            <th style={{ width: '100px' }} className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedUsers.length > 0 ? (
                                            paginatedUsers.map((user, index) => {
                                                // Calculate payment breakdown
                                                const platformFee = 10;
                                                const taxRate = 0.10;
                                                const totalAmount = user.paymentInfo?.amount || 0;
                                                const taxAmount = totalAmount * taxRate;
                                                const instructorAmount = totalAmount - platformFee - taxAmount;

                                                return (
                                                    <tr key={user.id}>
                                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                                                                    style={{ width: '36px', height: '36px' }}>
                                                                    <UserIcon size={18} className="text-secondary" />
                                                                </div>
                                                                <div>
                                                                    <h6 className="mb-0">{user.name}</h6>
                                                                    <small className="text-muted">ID: {user.userId.substring(0, 8)}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex flex-column">
                                                                <small>
                                                                    <Mail size={12} className="me-1 text-muted" />
                                                                    {user.email}
                                                                </small>
                                                                <small className="mt-1">
                                                                    <Phone size={12} className="me-1 text-muted" />
                                                                    {user.phone}
                                                                </small>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {getStatusBadge(user.status)}
                                                        </td>
                                                        <td>
                                                            <small>{formatDate(user.enrolledAt)}</small>
                                                        </td>
                                                        <td>
                                                            <div className="fw-bold text-primary">{formatCurrency(totalAmount, 'original')}</div>
                                                            <small className="text-muted d-block">Paid by student</small>
                                                        </td>
                                                        <td>
                                                            <div className="fw-bold text-success">{formatCurrency(instructorAmount)}</div>
                                                            <small className="text-muted d-block">
                                                                <span className="text-warning">-${platformFee} fee</span> |
                                                                <span className="text-warning"> -{taxRate * 100}% tax</span>
                                                            </small>
                                                            <small className="text-muted d-block">{user.paymentInfo?.method}</small>
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                className="btn btn-link text-primary p-0 me-2"
                                                                title="View Details"
                                                                onClick={() => handleViewUser(user)}
                                                                style={{ minWidth: '32px' }}
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                className="btn btn-link text-danger p-0"
                                                                title="Remove User"
                                                                onClick={() => handleDeleteClick(user)}
                                                                style={{ minWidth: '32px' }}
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="text-center py-4">
                                                    <AlertCircle size={40} className="text-muted mb-3" />
                                                    <p className="text-muted mb-0">No users match your search criteria.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredUsers.length > 0 && (
                                <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3">
                                    <div className="text-muted small">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                                    </div>
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                >
                                                    <ChevronLeft size={14} />
                                                </button>
                                            </li>
                                            {[...Array(totalPages).keys()].map(num => (
                                                <li key={num + 1} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(num + 1)}
                                                    >
                                                        {num + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                >
                                                    <ChevronRight size={14} />
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 p-2">
                                        <UserIcon size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h5 className="mb-0">{selectedUser.name}</h5>
                                        <small className="text-muted">User ID: {selectedUser.userId}</small>
                                    </div>
                                </div>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-4">
                                    {/* Personal Information */}
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3">
                                            <UserIcon size={16} className="me-2 text-primary" />
                                            Personal Information
                                        </h6>
                                        <div className="bg-light p-3 rounded">
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Full Name</small>
                                                <span className="fw-semibold">{selectedUser.name}</span>
                                            </div>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Email Address</small>
                                                <span className="fw-semibold">{selectedUser.email}</span>
                                            </div>
                                            <div>
                                                <small className="text-muted d-block">Phone Number</small>
                                                <span className="fw-semibold">{selectedUser.phone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="col-md-6">
                                        <h6 className="fw-bold mb-3">
                                            <CreditCard size={16} className="me-2 text-success" />
                                            Payment Details
                                        </h6>
                                        <div className="bg-light p-3 rounded">
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Amount Paid</small>
                                                <span className="fw-semibold">{formatCurrency(selectedUser.paymentInfo?.amount)}</span>
                                            </div>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Payment Method</small>
                                                <span className="fw-semibold">{selectedUser.paymentInfo?.method}</span>
                                            </div>
                                            <div className="mb-2">
                                                <small className="text-muted d-block">Transaction ID</small>
                                                <span className="fw-semibold small">{selectedUser.paymentInfo?.transactionId}</span>
                                            </div>
                                            <div>
                                                <small className="text-muted d-block">Payment Status</small>
                                                <span className={`badge bg-${selectedUser.paymentInfo?.status === 'completed' ? 'success' : 'warning'}`}>
                                                    {selectedUser.paymentInfo?.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enrollment Info */}
                                    <div className="col-12">
                                        <h6 className="fw-bold mb-3">
                                            <BookOpen size={16} className="me-2 text-info" />
                                            Enrollment Information
                                        </h6>
                                        <div className="bg-light p-3 rounded">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <small className="text-muted d-block">Enrollment Date</small>
                                                    <span className="fw-semibold">{formatDate(selectedUser.enrolledAt)}</span>
                                                </div>
                                                <div className="col-md-4">
                                                    <small className="text-muted d-block">Attendance Status</small>
                                                    <span className={`badge bg-${selectedUser.attended ? 'success' : 'secondary'}`}>
                                                        {selectedUser.attended ? 'Attended' : 'Not Attended'}
                                                    </span>
                                                </div>
                                                <div className="col-md-4">
                                                    <small className="text-muted d-block">Status</small>
                                                    <div>{getStatusBadge(selectedUser.status)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCloseModal}>
                                    Close
                                </button>
                                <button className="btn btn-primary">
                                    <MailIcon size={16} className="me-2" />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && userToDelete && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h6 className="modal-title">
                                    <Trash2 size={18} className="me-2" />
                                    Confirm Removal
                                </h6>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-0">
                                    Are you sure you want to remove <strong>{userToDelete.name}</strong> from this session?
                                    This action cannot be undone.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={handleConfirmDelete}
                                    disabled={deleteLoading}
                                >
                                    {deleteLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Removing...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={14} className="me-2" />
                                            Remove User
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Add this CSS to your global styles or component
const styles = `
.spinner {
    animation: spin 1s linear infinite;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.table-centered td {
    vertical-align: middle;
}
.table-nowrap th, 
.table-nowrap td {
    white-space: nowrap;
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LiveSessionUsers;