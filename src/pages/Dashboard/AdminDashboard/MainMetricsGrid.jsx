// src/pages/Dashboard/AdminDashboard/MainMetricsGrid.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  Tag,
  MoreVertical,
} from "react-feather";
import api from "../../../services/api";

const StatCard = ({ metric, loading }) => {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="placeholder-glow">
            <div className="placeholder col-4 mb-3" style={{ height: "40px" }}></div>
            <div className="placeholder col-8 mb-2"></div>
            <div className="placeholder col-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!metric) return null;

  const { icon, color, value, label, link, detail } = metric;

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div
              className={`avatar-sm bg-${color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3`}
            >
              {React.cloneElement(icon, {
                className: `text-${color}`,
                size: 20,
              })}
            </div>
            <h3 className="mb-1">{value}</h3>
            <p className="text-muted mb-2">{label}</p>
          </div>
          <div className="dropdown">
            <button
              className="btn btn-sm btn-link text-muted"
              data-bs-toggle="dropdown"
            >
              <MoreVertical size={16} />
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to={link}>
                  View Details
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Total count
          </small>
          <Link to={link} className="btn btn-sm btn-link">
            {detail} →
          </Link>
        </div>
      </div>
    </div>
  );
};

const MainMetricsGrid = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication
      const authUser = localStorage.getItem("authUser");
      if (!authUser) {
        throw new Error("Please login to view dashboard");
      }


      // Fetch data from all endpoints
      const [categoriesResponse, usersResponse, coursesResponse] = await Promise.allSettled([
        api.get('/categories'),
        api.get('/users'),
        api.get('/courses')
      ]);

      // Helper function to extract count from response
      const getCount = (response, endpointName) => {
        if (response.status === 'fulfilled') {
          const data = response.value.data;
          
          // Based on your API response structure
          if (data.success && Array.isArray(data[endpointName])) {
            // For courses: data.courses is an array
            // For categories: data.categories should be an array
            // For users: data.users should be an array
            return data[endpointName].length;
          } else if (data.success && Array.isArray(data.data)) {
            // Alternative structure: data.data is an array
            return data.data.length;
          } else if (Array.isArray(data)) {
            // Direct array response
            return data.length;
          } else if (data && typeof data === 'object' && data.count !== undefined) {
            // Object with count property
            return data.count;
          }
          console.warn(`Unknown data structure for ${endpointName}:`, data);
          return 0;
        } else {
          console.error(`Error fetching ${endpointName}:`, response.reason);
          return "Error";
        }
      };

      // Get counts
      const categoriesCount = getCount(categoriesResponse, 'categories');
      const usersCount = getCount(usersResponse, 'users');
      const coursesCount = getCount(coursesResponse, 'courses');


      // Extract instructors count from users data
      let instructorsCount = 0;
      if (usersResponse.status === 'fulfilled') {
        const usersData = usersResponse.value.data;
        let usersArray = [];
        
        if (usersData.success && Array.isArray(usersData.users)) {
          usersArray = usersData.users;
        } else if (usersData.success && Array.isArray(usersData.data)) {
          usersArray = usersData.data;
        } else if (Array.isArray(usersData)) {
          usersArray = usersData;
        }
        
        if (usersArray.length > 0) {
          instructorsCount = usersArray.filter(user => 
            user.role === 'instructor' || 
            user.userType === 'instructor' ||
            user.role === 'teacher'
          ).length;
          console.log(`Found ${instructorsCount} instructors out of ${usersArray.length} users`);
        }
      }

      // Prepare metrics with actual data
      const calculatedMetrics = [
        {
          icon: <Users />,
          color: "primary",
          value: typeof usersCount === 'number' ? usersCount.toLocaleString() : usersCount,
          label: "Total Users",
          link: "/users",
          detail: "View all users",
        },
        {
          icon: <Users />,
          color: "info",
          value: instructorsCount.toLocaleString(),
          label: "Total Instructors",
          link: "/all-instructors",
          detail: "Manage instructors",
        },
        {
          icon: <BookOpen />,
          color: "success",
          value: typeof coursesCount === 'number' ? coursesCount.toLocaleString() : coursesCount,
          label: "Total Courses",
          link: "/all-courses",
          detail: "Manage courses",
        },
        {
          icon: <Tag />,
          color: "warning",
          value: typeof categoriesCount === 'number' ? categoriesCount.toLocaleString() : categoriesCount,
          label: "Total Categories",
          link: "/all-categories",
          detail: "Manage categories",
        },
      ];

      setMetrics(calculatedMetrics);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(`Failed to load dashboard data: ${error.message}`);
      }
      
      // Show fallback data
      setMetrics(getFallbackMetrics());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackMetrics = () => [
    {
      icon: <Users />,
      color: "primary",
      value: "0",
      label: "Total Users",
      link: "/admin/users",
      detail: "View all users",
    },
    {
      icon: <Users />,
      color: "info",
      value: "0",
      label: "Total Instructors",
      link: "/admin/instructors",
      detail: "Manage instructors",
    },
    {
      icon: <BookOpen />,
      color: "success",
      value: "0",
      label: "Total Courses",
      link: "/admin/courses",
      detail: "Manage courses",
    },
    {
      icon: <Tag />,
      color: "warning",
      value: "0",
      label: "Total Categories",
      link: "/admin/categories",
      detail: "Manage categories",
    },
  ];

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (error) {
    return (
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="alert alert-warning d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-primary" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        </div>
        {metrics.map((metric, index) => (
          <div className="col-xl-3 col-md-6" key={index}>
            <StatCard metric={metric} loading={false} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-3 mb-4">
      {metrics.map((metric, index) => (
        <div className="col-xl-3 col-md-6" key={index}>
          <StatCard metric={metric} loading={loading} />
        </div>
      ))}
    </div>
  );
};

export default MainMetricsGrid;