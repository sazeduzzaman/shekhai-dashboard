import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Download,
    Eye,
    User,
    BookOpen,
    DollarSign,
    Calendar,
    CheckCircle,
    Phone,
    CreditCard,
    ChevronDown
} from 'react-feather';

const Enrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCourse, setFilterCourse] = useState('all');
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            setLoading(true);
            // Using your axiosInstance or fetch directly
            const response = await fetch('https://shekhai-server.onrender.com/api/v1/enrollments');
            const data = await response.json();
            setEnrollments(data.data || []);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique courses for filter dropdown
    const uniqueCourses = ['all', ...new Set(enrollments.map(e => e.courseTitle))];

    // Filter enrollments
    const filteredEnrollments = enrollments.filter(enrollment => {
        const matchesSearch =
            enrollment.studentInfo.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.studentInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
        const matchesCourse = filterCourse === 'all' || enrollment.courseTitle === filterCourse;

        return matchesSearch && matchesStatus && matchesCourse;
    });

    // Format functions
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `৳${amount.toLocaleString()}`;
    };

    const toggleRowExpansion = (id) => {
        setExpandedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Student Name', 'Email', 'Phone', 'Course', 'Amount', 'Payment Method', 'Status', 'Enrollment Date'];
        const csvData = filteredEnrollments.map(enrollment => [
            enrollment.studentInfo.fullname,
            enrollment.studentInfo.email,
            enrollment.studentInfo.phone,
            enrollment.courseTitle,
            enrollment.paymentInfo.amount,
            enrollment.paymentInfo.method,
            enrollment.status,
            formatDate(enrollment.enrollmentDate)
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'enrollments.csv';
        a.click();
    };

    if (loading) {
        return (
            <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading enrollments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-3">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h4 fw-bold mb-2">
                        <User className="me-2" size={20} />
                        Student Enrollments
                    </h2>
                    <p className="text-muted mb-0">
                        Showing {filteredEnrollments.length} of {enrollments.length} enrollments
                    </p>
                </div>
                <button onClick={exportToCSV} className="btn btn-primary">
                    <Download size={16} className="me-2" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-lg-4">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <Search size={16} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search students or courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <select
                                className="form-select"
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                            >
                                <option value="all">All Courses</option>
                                {uniqueCourses
                                    .filter(course => course !== 'all')
                                    .map((course, index) => (
                                        <option key={index} value={course}>
                                            {course.length > 40 ? `${course.substring(0, 40)}...` : course}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="col-lg-3">
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div className="col-lg-2">
                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterCourse('all');
                                    setFilterStatus('all');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '25%' }}>Student</th>
                                <th style={{ width: '25%' }}>Course Name</th>
                                <th style={{ width: '15%' }}>Payment</th>
                                <th style={{ width: '15%' }}>Enrollment Date</th>
                                <th style={{ width: '10%' }}>Status</th>
                                <th style={{ width: '10%' }} className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        <div className="text-muted">
                                            No enrollments found matching your filters
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEnrollments.map((enrollment) => (
                                    <React.Fragment key={enrollment._id}>
                                        <tr className="align-middle">
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className="avatar-circle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                                                            style={{ width: '36px', height: '36px' }}>
                                                            {enrollment.studentInfo.fullname.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <div className="fw-medium">{enrollment.studentInfo.fullname}</div>
                                                        <small className="text-muted d-block">
                                                            {enrollment.studentInfo.email}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <BookOpen size={16} className="me-2 text-muted" />
                                                    <div>
                                                        <div className="fw-medium">
                                                            {enrollment.courseTitle.length > 50
                                                                ? `${enrollment.courseTitle.substring(0, 50)}...`
                                                                : enrollment.courseTitle}
                                                        </div>
                                                        <small className="text-muted">
                                                            Price: {formatCurrency(enrollment.coursePrice)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <CreditCard size={16} className="me-2 text-muted" />
                                                    <div>
                                                        <div className="fw-medium">
                                                            {formatCurrency(enrollment.paymentInfo.amount)}
                                                        </div>
                                                        <small className="badge bg-light text-dark">
                                                            {enrollment.paymentInfo.method}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <Calendar size={16} className="me-2 text-muted" />
                                                    <div>
                                                        {formatDate(enrollment.enrollmentDate)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${enrollment.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                                                    {enrollment.status === 'active' && <CheckCircle size={12} className="me-1" />}
                                                    {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => toggleRowExpansion(enrollment._id)}
                                                    title="View Details"
                                                >
                                                    {expandedRows.includes(enrollment._id) ? 'Hide' : 'View'}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded Details Row */}
                                        {expandedRows.includes(enrollment._id) && (
                                            <tr className="bg-light">
                                                <td colSpan="6" className="p-4">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h6 className="fw-bold mb-3">Student Details</h6>
                                                            <div className="row mb-2">
                                                                <div className="col-4 fw-medium">Full Name:</div>
                                                                <div className="col-8">{enrollment.studentInfo.fullname}</div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-4 fw-medium">Email:</div>
                                                                <div className="col-8">{enrollment.studentInfo.email}</div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-4 fw-medium">Phone:</div>
                                                                <div className="col-8">
                                                                    <Phone size={14} className="me-2" />
                                                                    {enrollment.studentInfo.phone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <h6 className="fw-bold mb-3">Payment Details</h6>
                                                            <div className="row mb-2">
                                                                <div className="col-4 fw-medium">Transaction ID:</div>
                                                                <div className="col-8">{enrollment.paymentInfo.transactionId}</div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-4 fw-medium">Payment ID:</div>
                                                                <div className="col-8">{enrollment.paymentInfo.paymentId}</div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-4 fw-medium">Paid At:</div>
                                                                <div className="col-8">{formatDate(enrollment.paymentInfo.paidAt)}</div>
                                                            </div>
                                                            <div className="row mb-2">
                                                                <div className="col-4 fw-medium">Progress:</div>
                                                                <div className="col-8">
                                                                    <div className="progress" style={{ height: '6px' }}>
                                                                        <div className="progress-bar"
                                                                            style={{ width: `${enrollment.progress}%` }}></div>
                                                                    </div>
                                                                    <small>{enrollment.progress}% complete</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add some CSS styles */}
            <style jsx>{`
        .avatar-circle {
          width: 36px;
          height: 36px;
          background-color: #4e54c8;
          color: white;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .table-hover tbody tr:hover {
          background-color: rgba(78, 84, 200, 0.05);
        }
        
        .card {
          border: none;
        }
        
        .form-select, .form-control {
          border-color: #dee2e6;
        }
        
        .form-select:focus, .form-control:focus {
          border-color: #4e54c8;
          box-shadow: 0 0 0 0.2rem rgba(78, 84, 200, 0.25);
        }
        
        .badge.bg-success {
          background-color: #28a745 !important;
        }
        
        .badge.bg-warning {
          background-color: #ffc107 !important;
          color: #000;
        }
      `}</style>
        </div>
    );
};

export default Enrollments;