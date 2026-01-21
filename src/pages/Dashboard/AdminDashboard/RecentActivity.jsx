// components/RecentActivity.jsx
import React from "react";
import { Link } from "react-router-dom";
import { UserCheck, FileText, Award, MessageSquare } from "react-feather";

const getActivityColor = (type) => {
  switch (type) {
    case "enrollment": return "success";
    case "assignment": return "info";
    case "completion": return "primary";
    case "certificate": return "warning";
    case "comment": return "secondary";
    default: return "secondary";
  }
};

const getActivityIcon = (type) => {
  switch (type) {
    case "enrollment": return <UserCheck size={16} className="text-success" />;
    case "assignment": return <FileText size={16} className="text-info" />;
    case "completion": return <Award size={16} className="text-primary" />;
    case "certificate": return <Award size={16} className="text-warning" />;
    case "comment": return <MessageSquare size={16} className="text-secondary" />;
    default: return null;
  }
};

const ActivityItem = ({ activity }) => (
  <div className="list-group-item border-0 py-3">
    <div className="d-flex align-items-start">
      <div
        className={`avatar-sm bg-${getActivityColor(activity.type)} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3`}
      >
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-grow-1">
        <h6 className="mb-1">{activity.user}</h6>
        <p className="mb-1 small">
          {activity.action} in <strong>{activity.course}</strong>
        </p>
        <small className="text-muted">{activity.time}</small>
      </div>
    </div>
  </div>
);

const RecentActivity = ({ activities }) => {
  const activityData = activities || [
    {
      id: 1,
      user: "John Doe",
      action: "Enrolled in course",
      course: "React Masterclass",
      time: "10 min ago",
      type: "enrollment",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "Submitted assignment",
      course: "Data Science 101",
      time: "25 min ago",
      type: "assignment",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Completed course",
      course: "Web Development",
      time: "1 hour ago",
      type: "completion",
    },
    {
      id: 4,
      user: "Emma Wilson",
      action: "Requested certificate",
      course: "UI/UX Design",
      time: "2 hours ago",
      type: "certificate",
    },
    {
      id: 5,
      user: "Alex Chen",
      action: "Posted comment",
      course: "Python Basics",
      time: "3 hours ago",
      type: "comment",
    },
  ];

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bold">Recent Activity</h6>
        <Link to="/admin/activity" className="btn btn-sm btn-link">
          View All
        </Link>
      </div>
      <div className="card-body p-0">
        <div className="list-group list-group-flush">
          {activityData.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;