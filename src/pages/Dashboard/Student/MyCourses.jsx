import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Badge, Col, Row } from 'reactstrap';
import { BookOpen, Clock, Star, BookCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyCourses = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user email from localStorage
    const getUserEmail = () => {
        try {
            const authUser = localStorage.getItem('authUser');
            if (authUser) {
                const userData = JSON.parse(authUser);
                return userData.user?.email || userData.email;
            }
        } catch (err) {
            console.log('Error parsing user data:', err);
        }
        return null;
    };

    // Get user token for authorization
    const getUserToken = () => {
        try {
            const authUser = localStorage.getItem('authUser');
            if (authUser) {
                const userData = JSON.parse(authUser);
                return userData.token;
            }
        } catch (err) {
            console.log('Error parsing token:', err);
        }
        return null;
    };

    // Fetch enrolled courses
    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                const userEmail = getUserEmail();
                const token = getUserToken();

                if (!userEmail) {
                    setError("Please log in to view your courses");
                    setLoading(false);
                    return;
                }

                // Fetch enrolled courses by student email
                const response = await axios.get(
                    `https://shekhai-server.onrender.com/api/v1/enrollments/student/${userEmail}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : ''
                        }
                    }
                );

                console.log('API Response:', response.data);

                if (response.data.success) {
                    // Transform API response to match your component structure
                    const courses = response.data.data.map((enrollment) => ({
                        id: enrollment.courseId || enrollment._id,
                        enrollmentId: enrollment._id,
                        title: enrollment.courseTitle || 'Untitled Course',
                        shortDescription: enrollment.courseDescription || '',
                        category: getCategoryFromTitle(enrollment.courseTitle),
                        progress: enrollment.progress || 0,
                        duration: calculateDuration(enrollment.enrollmentDate),
                        rating: 4.5, // Default rating, you might want to fetch this separately
                        thumbnailColor: getRandomColor(),
                        enrolledDate: enrollment.enrollmentDate,
                        lastAccessed: enrollment.lastAccessed,
                        status: enrollment.status || 'active',
                        certificateIssued: enrollment.certificateIssued || false,
                        price: enrollment.coursePrice || 0,
                        paymentStatus: enrollment.paymentInfo?.status || 'Unknown'
                    }));

                    setEnrolledCourses(courses);
                } else {
                    setError("Failed to load courses");
                }
            } catch (err) {
                console.error("Error fetching enrolled courses:", err);
                setError(err.response?.data?.message || "Failed to load courses. Please try again.");

                // For demo purposes, show sample data if API fails
                if (process.env.NODE_ENV === 'development') {
                    setEnrolledCourses(getSampleCourses());
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, []);

    // Helper function to extract category from title
    const getCategoryFromTitle = (title) => {
        if (!title) return 'General';

        const titleLower = title.toLowerCase();
        if (titleLower.includes('web') || titleLower.includes('development')) return 'Web Development';
        if (titleLower.includes('data') || titleLower.includes('science')) return 'Data Science';
        if (titleLower.includes('mobile') || titleLower.includes('app')) return 'Mobile Development';
        if (titleLower.includes('design')) return 'Design';
        if (titleLower.includes('business')) return 'Business';
        if (titleLower.includes('marketing')) return 'Marketing';
        return 'General';
    };

    // Calculate duration from enrollment date
    const calculateDuration = (enrollmentDate) => {
        if (!enrollmentDate) return 'Self-paced';

        const enrolledDate = new Date(enrollmentDate);
        const now = new Date();
        const diffTime = Math.abs(now - enrolledDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 7) return `${diffDays} days`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
        return `${Math.floor(diffDays / 30)} months`;
    };

    // Helper function to generate random colors for thumbnails
    const getRandomColor = () => {
        const colors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Sample courses for demo/fallback
    const getSampleCourses = () => {
        return [
            {
                id: '1',
                enrollmentId: 'sample-1',
                title: 'Web Development Bootcamp',
                category: 'Web Development',
                progress: 65,
                duration: '12 weeks',
                rating: 4.8,
                thumbnailColor: 'primary',
                enrolledDate: new Date().toISOString(),
                status: 'active',
                certificateIssued: false,
                price: 56845
            },
            {
                id: '2',
                enrollmentId: 'sample-2',
                title: 'Data Science Fundamentals',
                category: 'Data Science',
                progress: 30,
                duration: '10 weeks',
                rating: 4.6,
                thumbnailColor: 'success',
                enrolledDate: new Date().toISOString(),
                status: 'active',
                certificateIssued: false,
                price: 45000
            }
        ];
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading your courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error Loading Courses</h4>
                <p>{error}</p>
                <Button color="primary" onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    if (enrolledCourses.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="mb-4">
                    <BookOpen size={64} className="text-muted" />
                </div>
                <h3 className="text-muted">No Courses Enrolled Yet</h3>
                <p className="text-muted mb-4">You haven&apos;t enrolled in any courses yet.</p>
                <Button color="primary" tag={Link} to="/courses">
                    Browse Courses
                </Button>
            </div>
        );
    }

    return (
        <div className="my-courses-container">

            <Row>
                {enrolledCourses.map((course) => (
                    <Col md="6" lg="4" className="mb-4" key={course.enrollmentId || course.id}>
                        <Card className="h-100 border shadow-sm course-card">
                            <CardBody className="p-0">
                                {/* Course Header */}
                                <div className={`bg-${course.thumbnailColor}-subtle p-4 text-center course-header`}>
                                    <div className="avatar-lg mx-auto mb-3">
                                        <div
                                            className={`rounded-circle bg-${course.thumbnailColor} d-flex align-items-center justify-content-center`}
                                            style={{ width: "70px", height: "70px" }}
                                        >
                                            {course.certificateIssued ? (
                                                <BookCheck size={28} className="text-white" />
                                            ) : (
                                                <BookOpen size={28} className="text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <h6 className="mb-1 fw-bold">{course.title}</h6>
                                    <div className="d-flex justify-content-center align-items-center mt-2">
                                        <Badge color="light" className="text-dark me-2">
                                            {course.category}
                                        </Badge>
                                        {course.certificateIssued && (
                                            <Badge color="success" pill>
                                                Certified
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Course Body */}
                                <div className="p-3">

                                    {/* Course Info */}
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <small className="text-muted">
                                                <Clock size={12} className="me-1" />
                                                Enrolled
                                                {/* {calculateDuration(course.enrolledDate)} ago */}
                                            </small>
                                            <Badge color="warning" pill>
                                                <Star size={10} className="me-1" />
                                                {course.rating}
                                            </Badge>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">
                                                Price: <span className="fw-bold">{formatPrice(course.price)}</span>
                                            </small>
                                            <Badge color={course.paymentStatus === 'Completed' ? 'success' : 'warning'}>
                                                {course.paymentStatus}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-between mt-4">
                                        <Link to={"/student/continue-courses"}
                                            color="primary"
                                            size="sm"
                                            className="d-flex align-items-center"
                                        >
                                            <BookOpen size={14} className="me-1" />
                                            {course.progress > 0 ? 'Continue' : 'Start'}
                                        </Link>
                                    </div>

                                    {/* Additional Info */}
                                    <div className="mt-3 pt-3 border-top">
                                        <div className="d-flex justify-content-between">
                                            <small className="text-muted">
                                                Last accessed: {formatDate(course.lastAccessed)}
                                            </small>
                                            <small className={`text-${course.status === 'active' ? 'success' : 'secondary'}`}>
                                                {course.status}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Stats Summary */}
            <div className="mt-5 pt-4 border-top">
                <Row>
                    <Col md="4" className="mb-3">
                        <div className="text-center p-3 bg-light rounded">
                            <h4 className="text-primary">{enrolledCourses.length}</h4>
                            <p className="mb-0 text-muted">Total Courses</p>
                        </div>
                    </Col>
                    <Col md="4" className="mb-3">
                        <div className="text-center p-3 bg-light rounded">
                            <h4 className="text-success">
                                {enrolledCourses.filter(c => c.certificateIssued).length}
                            </h4>
                            <p className="mb-0 text-muted">Certificates Earned</p>
                        </div>
                    </Col>
                    <Col md="4" className="mb-3">
                        <div className="text-center p-3 bg-light rounded">
                            <h4 className="text-info">
                                {Math.round(
                                    enrolledCourses.reduce((sum, course) => sum + course.progress, 0) /
                                    (enrolledCourses.length || 1)
                                )}%
                            </h4>
                            <p className="mb-0 text-muted">Average Progress</p>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MyCourses;