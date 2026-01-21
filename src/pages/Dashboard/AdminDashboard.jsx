import React, { useState, useEffect } from "react";
import DashboardHeader from "./AdminDashboard/DashboardHeader";
import MainMetricsGrid from "./AdminDashboard/MainMetricsGrid";
import RecentActivity from "./AdminDashboard/RecentActivity";

const AdminDashboard = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate loading (remove this if components handle their own loading)
      setTimeout(() => {
        setIsLoading(false);
        setLastUpdated(new Date());
      }, 500);
      
    } catch (error) {
      setError("Failed to load dashboard data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = () => {
    // Refresh all components
    setLastUpdated(new Date());
    // You can add logic here to trigger child component refreshes
  };

  if (isLoading) {
    return (
      <div className="container-fluid p-0">
        <DashboardHeader userName={user?.name || "Admin"} />
        <div className="p-4 px-0">
          {/* Main Metrics Loading Skeleton */}
          <div className="row g-3 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div className="col-xl-3 col-md-6" key={i}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <div className="placeholder col-4 mb-3" style={{ height: "40px" }}></div>
                      <div className="placeholder col-8 mb-2"></div>
                      <div className="placeholder col-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Content Area Loading */}
          <div className="row g-4">
            <div className="col-xl-8">
              {/* Empty space for future content */}
              <div className="card border-0 shadow-sm" style={{ height: "300px" }}>
                <div className="card-body d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mb-0">Loading dashboard content...</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-4">
              {/* Recent Activity Loading Skeleton */}
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <div className="placeholder-glow">
                    <span className="placeholder col-4"></span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="placeholder-glow">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div className="mb-3" key={i}>
                        <div className="placeholder col-8 mb-2"></div>
                        <div className="placeholder col-6"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-0">
        <DashboardHeader userName={user?.name || "Admin"} />
        <div className="p-4 px-0">
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-primary" onClick={handleRefresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <DashboardHeader 
        userName={user?.name || "Admin"} 
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />
      
      <div className="p-4 px-0">
        {/* Main Metrics Grid - fetches its own data */}
        <MainMetricsGrid />
      </div>
    </div>
  );
};

export default AdminDashboard;