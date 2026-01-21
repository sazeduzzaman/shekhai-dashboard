// components/SystemHealth.jsx
import React from "react";
import { Activity, Database, Server, Cpu } from "react-feather";

const SystemHealth = ({ metrics }) => {
  const systemMetrics = metrics || [
    {
      label: "Server Load",
      value: 65,
      color: "success",
      icon: <Server size={14} />,
    },
    {
      label: "Database",
      value: 92,
      color: "warning",
      icon: <Database size={14} />,
    },
    {
      label: "API Response",
      value: 98,
      color: "success",
      icon: <Activity size={14} />,
    },
    { 
      label: "Uptime", 
      value: 99.9, 
      color: "success", 
      icon: <Cpu size={14} /> 
    },
  ];

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0">
        <h6 className="mb-0 d-flex align-items-center">
          <Activity size={18} className="me-2 text-primary" />
          System Health
        </h6>
      </div>
      <div className="card-body">
        {systemMetrics.map((item, index) => (
          <div className="mb-3" key={index}>
            <div className="d-flex justify-content-between mb-1">
              <small className="text-muted d-flex align-items-center">
                {item.icon}
                <span className="ms-2">{item.label}</span>
              </small>
              <small className={`text-${item.color} fw-bold`}>
                {item.value}%
              </small>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className={`progress-bar bg-${item.color}`}
                style={{ width: `${item.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemHealth;