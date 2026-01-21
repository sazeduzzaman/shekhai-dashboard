import React from "react";
import { RefreshCw } from "react-feather";

const DashboardHeader = ({ userName, lastUpdated, onRefresh }) => {
  return (
    <div className="bg-primary bg-gradient py-4 px-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 text-white mb-1">Welcome back, {userName}!</h1>
          <p className="text-white-50 mb-0">LMS Administration Dashboard</p>
          {lastUpdated && (
            <small className="text-white-50">
              Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
          )}
        </div>
        
        <button 
          className="btn btn-light btn-sm d-flex align-items-center"
          onClick={onRefresh}
        >
          <RefreshCw size={14} className="me-1" />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;