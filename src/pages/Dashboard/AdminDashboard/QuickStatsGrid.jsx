import React, { useState, useEffect } from "react";
import { Activity, Award, MessageSquare, FileText } from "react-feather";
import { getQuickStats } from "../../../services/dashboardService";

const QuickStatsGrid = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getQuickStats();
      setStats(data);
    } catch (error) {
      console.log("Using fallback stats");
      // Fallback data
      setStats([
        {
          id: 1,
          label: "Active Sessions",
          value: "234",
          icon: <Activity />,
          color: "primary",
          change: "+12%",
        },
        {
          id: 2,
          label: "Avg. Completion",
          value: "78%",
          icon: <Award />,
          color: "success",
          change: "+5%",
        },
        {
          id: 3,
          label: "Support Tickets",
          value: "12",
          icon: <MessageSquare />,
          color: "warning",
          change: "-3",
        },
        {
          id: 4,
          label: "Certificates",
          value: "89",
          icon: <FileText />,
          color: "info",
          change: "+8",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="placeholder-glow">
                  <div className="placeholder col-6 mb-3"></div>
                  <div className="placeholder col-8"></div>
                  <div className="placeholder col-4"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-3 mb-4">
      {stats.map((stat) => (
        <div className="col-xl-3 col-md-6" key={stat.id}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">{stat.label}</h6>
                  <h3 className="mb-0">{stat.value}</h3>
                  <small
                    className={`text-${
                      stat.change.startsWith("+") ? "success" : "danger"
                    }`}
                  >
                    {stat.change} from last week
                  </small>
                </div>
                <div
                  className={`avatar-sm bg-${stat.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`}
                >
                  {React.cloneElement(stat.icon, {
                    className: `text-${stat.color}`,
                    size: 20,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsGrid;
