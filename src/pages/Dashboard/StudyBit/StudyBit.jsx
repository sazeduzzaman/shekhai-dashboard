"use client";

import { Book, Calendar, Eye, PersonStanding, Trash, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = "https://shekhai-server.onrender.com/api/v1";

const StudyBitAdmin = () => {
    const [studyBits, setStudyBits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [viewMode, setViewMode] = useState('table');
    const [stats, setStats] = useState(null);
    const [filterArea, setFilterArea] = useState('all');
    const [dateRange, setDateRange] = useState('all');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedStudyBit, setSelectedStudyBit] = useState(null);

    const itemsPerPage = 10;

    useEffect(() => {
        fetchStudyBits();
        fetchStats();
    }, [currentPage, filterArea, dateRange]);

    const fetchStudyBits = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/study-bit/all?page=${currentPage}&limit=${itemsPerPage}`);
            const data = await response.json();

            if (data.success) {
                setStudyBits(data.data);
                setTotalPages(data.totalPages || 1);
                setTotalItems(data.total || 0);
            } else {
                toast.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching study bits:', error);
            toast.error('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/study-bit/stats`);
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // View details function
    const handleViewDetails = (item) => {
        setSelectedStudyBit(item);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this submission?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/study-bit/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Submission deleted successfully');
                fetchStudyBits();
                fetchStats();
                setSelectedItems(selectedItems.filter(itemId => itemId !== id));
            } else {
                toast.error(data.error || 'Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Error deleting submission');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedItems.length === 0) {
            toast.error('No items selected');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} submissions?`)) return;

        try {
            for (const id of selectedItems) {
                await fetch(`${API_BASE_URL}/study-bit/${id}`, {
                    method: 'DELETE',
                });
            }

            toast.success(`${selectedItems.length} submissions deleted successfully`);
            setSelectedItems([]);
            fetchStudyBits();
            fetchStats();
        } catch (error) {
            console.error('Error in bulk delete:', error);
            toast.error('Error deleting some submissions');
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === filteredData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredData.map(item => item._id));
        }
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Area', 'Skill Level', 'Goal', 'Time', 'Style', 'Start Time', 'Date'];
        const csvData = filteredData.map(item => [
            item.posterInfo.name,
            item.posterInfo.email,
            `="${item.posterInfo.phone}"`,
            item.step1.interestedArea,
            item.step2.skillLevel,
            item.step2.learningGoal,
            item.step3.timeDedication,
            item.step3.learningStyle,
            item.finalStep.startTime,
            new Date(item.createdAt).toLocaleDateString()
        ]);

        const instructions = ['NOTE: If broken then Press (Ctrl + A) to select all & press (Alt + H + O + I) to AutoFit all columns"'];

        const csv = [instructions, headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = `study-bit-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.href = url;
        a.click();
    };

    const filteredData = studyBits.filter(item => {
        const matchesSearch =
            item.posterInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.posterInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.posterInfo.phone.includes(searchTerm) ||
            item.step1.interestedArea.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesArea = filterArea === 'all' || item.step1.interestedArea === filterArea;

        let matchesDate = true;
        if (dateRange === 'today') {
            const today = new Date().toDateString();
            matchesDate = new Date(item.createdAt).toDateString() === today;
        } else if (dateRange === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = new Date(item.createdAt) >= weekAgo;
        } else if (dateRange === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = new Date(item.createdAt) >= monthAgo;
        }

        return matchesSearch && matchesArea && matchesDate;
    });

    const uniqueAreas = [...new Set(studyBits.map(item => item.step1.interestedArea))];

    // Details Modal Component
    const DetailsModal = () => {
        if (!selectedStudyBit) return null;

        return (
            <div
                className={`modal fade ${showModal ? 'show d-block' : ''}`}
                style={{
                    backgroundColor: 'rgba(2, 6, 23, 0.6)', // Deeper, more modern backdrop
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onClick={() => setShowModal(false)}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
                    <div className="modal-content border-0 shadow-2xl overflow-hidden"
                        style={{
                            borderRadius: '2.5rem',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>

                        {/* Header: Minimal & Integrated */}
                        <div className="d-flex justify-content-between align-items-center p-4 px-md-5">
                            <div className="d-flex align-items-center gap-2">
                                <div className="bg-primary bg-gradient rounded-3 p-2 shadow-sm">
                                    <i className="bi bi-mortarboard-fill text-white fs-5"></i>
                                </div>
                                <span className="fw-black text-dark fs-4 tracking-tight">Study<span className="text-primary">Bit</span></span>
                            </div>
                            <button
                                type="button"
                                className="btn-close bg-light rounded-circle p-3 shadow-sm border-0"
                                onClick={() => setShowModal(false)}
                                style={{ transition: 'transform 0.2s' }}
                            ></button>
                        </div>

                        <div className="modal-body p-4 px-md-5 pt-0">

                            {/* Section 1: Hero Profile Card */}
                            <div className="bg-white rounded-4 p-4 shadow-sm border border-light mb-4 d-flex align-items-center">
                                <div className="position-relative">
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-4 d-flex align-items-center justify-content-center fw-bold fs-2 shadow-sm"
                                        style={{ width: '80px', height: '80px' }}>
                                        {selectedStudyBit.posterInfo.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </div>
                                    <span className="position-absolute bottom-0 end-0 bg-success border border-white border-3 rounded-circle" style={{ width: '18px', height: '18px' }}></span>
                                </div>
                                <div className="ms-4">
                                    <h4 className="mb-1 fw-bold text-slate-900">{selectedStudyBit.posterInfo.name}</h4>
                                    <div className="d-flex flex-wrap gap-3">
                                        <span className="text-muted small"><i className="bi bi-envelope me-1"></i> {selectedStudyBit.posterInfo.email}</span>
                                        <span className="text-muted small"><i className="bi bi-telephone me-1"></i> {selectedStudyBit.posterInfo.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Info Grid (Bento Style) */}
                            <div className="row g-3 mb-4">
                                {/* Interest Card */}
                                <div className="col-md-7">
                                    <div className="h-100 p-4 rounded-4 bg-primary text-white shadow-sm position-relative overflow-hidden">
                                        <i className="bi bi-stars position-absolute end-0 bottom-0 m-n3 opacity-25" style={{ fontSize: '8rem' }}></i>
                                        <h6 className="text-uppercase small fw-black opacity-75 mb-3 tracking-widest">Target Domain</h6>
                                        <h3 className="fw-bold mb-1">{selectedStudyBit.step1.interestedArea}</h3>
                                        {selectedStudyBit.step1.otherArea && <p className="small opacity-75 mb-0">Spec: {selectedStudyBit.step1.otherArea}</p>}
                                    </div>
                                </div>

                                {/* Style Card */}
                                <div className="col-md-5">
                                    <div className="h-100 p-4 rounded-4 bg-white border border-light shadow-sm">
                                        <h6 className="text-uppercase small fw-bold text-muted mb-3 tracking-widest">Preferences</h6>
                                        <div className="d-grid gap-2">
                                            <span className="badge bg-light text-dark border py-2 px-3 rounded-3 fw-medium text-start">
                                                <i className="bi bi-clock-history me-2 text-primary"></i> {selectedStudyBit.step3.timeDedication}
                                            </span>
                                            <span className="badge bg-light text-dark border py-2 px-3 rounded-3 fw-medium text-start">
                                                <i className="bi bi-person-workspace me-2 text-primary"></i> {selectedStudyBit.step3.learningStyle}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: The Learning Goal */}
                            <div className="p-4 rounded-4 bg-white border border-light shadow-sm">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="text-uppercase small fw-bold text-muted mb-0 tracking-widest">Learning Objective</h6>
                                    <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-3 py-2 border border-warning border-opacity-10">
                                        {selectedStudyBit.step2.skillLevel} Level
                                    </span>
                                </div>
                                <p className="fs-4 fw-semibold text-dark mb-0 lh-base">
                                    "{selectedStudyBit.step2.learningGoal}"
                                </p>
                            </div>
                        </div>

                        {/* Footer: Floating Style */}
                        <div className="p-4 px-md-5 bg-light bg-opacity-50 border-top d-flex flex-wrap align-items-center justify-content-between gap-3">
                            <div className="d-flex gap-3">
                                <div className="bg-white px-3 py-2 rounded-3 border shadow-xs small">
                                    <i className="bi bi-calendar3 text-primary me-2"></i>
                                    {new Date(selectedStudyBit.createdAt).toLocaleDateString()}
                                </div>
                                <div className="bg-white px-3 py-2 rounded-3 border shadow-xs small">
                                    <i className="bi bi-alarm text-primary me-2"></i>
                                    {selectedStudyBit.finalStep.startTime}
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-light rounded-pill px-4 fw-bold text-secondary" onClick={() => setShowModal(false)}>
                                    Dismiss
                                </button>
                                <button className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm"
                                    onClick={() => window.confirm('Delete?') && handleDelete(selectedStudyBit._id)}>
                                    Delete Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading && studyBits.length === 0) {
        return (
            <div className="container-fluid bg-light min-vh-100 p-4">
                <div className="row justify-content-center align-items-center" style={{ height: '80vh' }}>
                    <div className="col-auto text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-secondary">Loading submissions...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="container-fluid bg-light min-vh-100 py-4">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="display-6 fw-bold text-dark">Study Bit Submissions</h1>
                    <p className="text-secondary">Manage and view all user submissions</p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="row g-4 mb-4">
                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-secondary mb-1 small">Total Submissions</p>
                                            <h3 className="fw-bold mb-0">{stats.total}</h3>
                                        </div>
                                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                                            <Book className="text-primary" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-secondary mb-1 small">This Week</p>
                                            <h3 className="fw-bold text-success mb-0">{stats.recentSubmissions || 0}</h3>
                                        </div>
                                        <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                                            <Calendar className="text-success" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-secondary mb-1 small">Most Popular Area</p>
                                            <h6 className="fw-bold text-purple mb-0 text-truncate" style={{ maxWidth: '150px' }}>
                                                {stats.distributions?.areas[0]?._id || 'N/A'}
                                            </h6>
                                        </div>
                                        <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                                            <Eye className="text-purple" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <p className="text-secondary mb-1 small">Common Skill Level</p>
                                            <h6 className="fw-bold text-warning mb-0">
                                                {stats.distributions?.skills[0]?._id || 'N/A'}
                                            </h6>
                                        </div>
                                        <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                                            <PersonStanding className="text-warning" size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-5">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-search text-secondary"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Search by name, email, phone or area..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-2">
                                <select
                                    className="form-select"
                                    value={filterArea}
                                    onChange={(e) => setFilterArea(e.target.value)}
                                >
                                    <option value="all">All Areas</option>
                                    {uniqueAreas.map(area => (
                                        <option key={area} value={area}>{area}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-2">
                                <select
                                    className="form-select"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                                        className="btn btn-outline-secondary flex-grow-1"
                                    >
                                        <i className={`bi bi-${viewMode === 'table' ? 'grid' : 'table'} me-2`}></i>
                                        {viewMode === 'table' ? 'Cards' : 'Table'}
                                    </button>

                                    <button
                                        onClick={exportToCSV}
                                        className="btn btn-success flex-grow-1"
                                    >
                                        <i className="bi bi-download me-2"></i>
                                        Export
                                    </button>

                                    {selectedItems.length > 0 && (
                                        <button
                                            onClick={handleBulkDelete}
                                            className="btn btn-danger flex-grow-1"
                                        >
                                            <i className="bi bi-trash me-2"></i>
                                            Delete ({selectedItems.length})
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 small text-secondary">
                            Showing {filteredData.length} of {totalItems} submissions
                        </div>
                    </div>
                </div>

                {/* Table View */}
                {viewMode === 'table' ? (
                    <div className="card shadow-sm">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3" style={{ width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Contact</th>
                                        <th className="px-4 py-3">Area</th>
                                        <th className="px-4 py-3">Skill Level</th>
                                        <th className="px-4 py-3">Goal</th>
                                        <th className="px-4 py-3">Time</th>
                                        <th className="px-4 py-3">Style</th>
                                        <th className="px-4 py-3">Start</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((item) => (
                                        <tr key={item._id}>
                                            <td className="px-4">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={selectedItems.includes(item._id)}
                                                    onChange={() => handleSelectItem(item._id)}
                                                />
                                            </td>
                                            <td className="px-4">
                                                <div className="fw-medium">{item.posterInfo.name}</div>
                                            </td>
                                            <td className="px-4">
                                                <div><i className="bi bi-envelope me-2 text-secondary"></i>{item.posterInfo.email}</div>
                                                <div><i className="bi bi-telephone me-2 text-secondary"></i>{item.posterInfo.phone}</div>
                                            </td>
                                            <td className="px-4">
                                                <div>{item.step1.interestedArea}</div>
                                                {item.step1.otherArea && (
                                                    <small className="text-secondary">{item.step1.otherArea}</small>
                                                )}
                                            </td>
                                            <td className="px-4">
                                                <span className={`badge bg-${item.step2.skillLevel === 'Beginner' ? 'info' : item.step2.skillLevel === 'Intermediate' ? 'warning' : 'success'} bg-opacity-10 text-dark`}>
                                                    {item.step2.skillLevel}
                                                </span>
                                            </td>
                                            <td className="px-4">
                                                <div>{item.step2.learningGoal}</div>
                                                {item.step2.otherGoal && (
                                                    <small className="text-secondary">{item.step2.otherGoal}</small>
                                                )}
                                            </td>
                                            <td className="px-4">{item.step3.timeDedication}</td>
                                            <td className="px-4">{item.step3.learningStyle}</td>
                                            <td className="px-4">
                                                <span className="badge bg-success bg-opacity-10 text-success">
                                                    {item.finalStep.startTime}
                                                </span>
                                            </td>
                                            <td className="px-4 text-secondary">
                                                <i className="bi bi-calendar me-2"></i>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4">
                                                <div className="d-flex gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(item)}
                                                        className="btn btn-link text-primary p-0"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="btn btn-link text-danger p-0"
                                                        title="Delete"
                                                    >
                                                        <Trash size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredData.length === 0 && (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox fs-1 text-secondary mb-3 d-block"></i>
                                <p className="text-secondary mb-0">No submissions found</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Card View */
                    <div className="row g-4">
                        {filteredData.map((item) => (
                            <div key={item._id} className="col-md-6 col-lg-4">
                                <div className="card shadow-sm h-100 hover-shadow transition-shadow">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-semibold mb-1">{item.posterInfo.name}</h5>
                                                <p className="text-secondary small mb-1">
                                                    <i className="bi bi-envelope me-2"></i>{item.posterInfo.email}
                                                </p>
                                                <p className="text-secondary small">
                                                    <i className="bi bi-telephone me-2"></i>{item.posterInfo.phone}
                                                </p>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(item)}
                                                    className="btn btn-link text-primary p-0"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="btn btn-link text-danger p-0"
                                                    title="Delete"
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="border-top pt-3">
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-bullseye text-primary me-2"></i>
                                                <span className="small">{item.step1.interestedArea}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-person text-purple me-2"></i>
                                                <span className="small">{item.step2.skillLevel}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-book text-success me-2"></i>
                                                <span className="small">{item.step2.learningGoal}</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <i className="bi bi-clock text-warning me-2"></i>
                                                <span className="small">{item.step3.timeDedication}</span>
                                            </div>
                                        </div>

                                        <div className="border-top pt-3 mt-2 d-flex justify-content-between align-items-center">
                                            <small className="text-secondary">
                                                <i className="bi bi-calendar me-1"></i>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </small>
                                            <span className="badge bg-success bg-opacity-10 text-success">
                                                {item.finalStep.startTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="card shadow-sm mt-4">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div className="small text-secondary">
                                Page {currentPage} of {totalPages}
                            </div>
                            <nav aria-label="Page navigation">
                                <ul className="pagination mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <i className="bi bi-chevron-left"></i>
                                        </button>
                                    </li>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(i + 1)}
                                            >
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}

                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <i className="bi bi-chevron-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}

                {/* Details Modal */}
                <DetailsModal />
            </div>
        </div>
    );
};

export default StudyBitAdmin;