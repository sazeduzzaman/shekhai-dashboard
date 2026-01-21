import React, { useState, useEffect } from "react";
import { BarChart2 } from "react-feather";
import api from "../../../services/api";

const MonthlyRevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      // Since you don't have revenue API, we'll use mock data
      // Or fetch from payments endpoint if available
      const mockData = [
        { month: "Jan", revenue: 10500 },
        { month: "Feb", revenue: 12450 },
        { month: "Mar", revenue: 9800 },
        { month: "Apr", revenue: 15600 },
        { month: "May", revenue: 14200 },
        { month: "Jun", revenue: 18900 },
      ];
      
      setRevenueData(mockData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = revenueData.length > 0 
    ? Math.max(...revenueData.map(item => item.revenue)) 
    : 0;

  if (loading) {
    return (
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-transparent border-0">
          <div className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </div>
        </div>
        <div className="card-body">
          <div className="placeholder-glow">
            <div className="placeholder" style={{ height: "150px" }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-transparent border-0">
        <h6 className="mb-0 d-flex align-items-center">
          <BarChart2 size={18} className="me-2 text-primary" />
          Monthly Revenue
        </h6>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-end mb-3" style={{ height: "200px" }}>
          {revenueData.map((month, index) => (
            <div key={index} className="flex-fill px-2">
              <div className="text-center">
                <div
                  className="mx-auto bg-primary bg-opacity-25 rounded-top"
                  style={{
                    height: maxRevenue > 0 ? `${(month.revenue / maxRevenue) * 150}px` : "0px",
                    width: "30px",
                    cursor: "pointer",
                  }}
                  title={`$${month.revenue.toLocaleString()}`}
                ></div>
                <small className="text-muted d-block mt-2">{month.month}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <small className="text-muted">Hover over bars to see exact values</small>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRevenueChart;