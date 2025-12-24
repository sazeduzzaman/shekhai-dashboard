import React from 'react';
import { Award, Calendar, ExternalLink, Download, Briefcase } from 'react-feather';

const Certificates = () => {
  const certificateData = [
    {
      id: 1,
      title: "Full Stack Web Development",
      organization: "Meta (via Coursera)",
      date: "Dec 2024",
      verifyLink: "https://your-verification-link.com",
      downloadPath: "/assets/pdf/fullstack-cert.pdf", // Path to your local PDF
      image: "https://www.skillwaala.com/assets/img/sneha_verma_certificate.webp", 
    },
    {
      id: 2,
      title: "AWS Certified Cloud Practitioner",
      organization: "Amazon Web Services",
      date: "Oct 2024",
      verifyLink: "#",
      downloadPath: "/assets/pdf/aws-cert.pdf",
      image: "https://media.licdn.com/dms/image/v2/D4D22AQF8KiCdrG5EYQ/feedshare-shrink_800/feedshare-shrink_800/0/1706161872237?e=2147483647&v=beta&t=UD_SigDRbXiDDETTkLTZADeP5JURGQ66arv4hxFl9gQ",
    },
    {
      id: 3,
      title: "UI/UX Design Essentials",
      organization: "Google",
      date: "August 2024",
      verifyLink: "#",
      downloadPath: "/assets/pdf/google-ux.pdf",
      image: "https://user-images.githubusercontent.com/40789486/112649048-18e3dd80-8e70-11eb-871d-00a15278ce57.png",
    }
  ];

  return (
    <div className="container-fluid py-5 bg-light min-vh-100 mt-5">
      <div className="container">
        {/* Header Section */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <h6 className="text-primary fw-bold text-uppercase tracking-wider mb-2">My Achievements</h6>
            <h2 className="display-5 fw-bold text-dark mb-3">Certifications & Specialized Training</h2>
            <div className="mx-auto bg-primary mb-4" style={{ width: '60px', height: '4px', borderRadius: '2px' }}></div>
            <p className="lead text-muted">
              A curated list of credentials that validate my expertise in modern software engineering and design principles.
            </p>
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="row g-4">
          {certificateData.map((cert) => (
            <div key={cert.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm overflow-hidden hover-lift transition-all">
                {/* Image Wrapper with Overlay */}
                <div className="position-relative overflow-hidden group">
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="card-img-top object-fit-cover"
                    style={{ height: '220px', transition: 'transform 0.5s ease' }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-white text-primary p-2 rounded-circle shadow-sm">
                      <Award size={20} />
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold text-dark mb-3 leading-tight" style={{ minHeight: '3rem' }}>
                    {cert.title}
                  </h5>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-center text-secondary mb-2 small">
                      <Briefcase size={16} className="me-2 text-primary" />
                      {cert.organization}
                    </div>
                    <div className="d-flex align-items-center text-muted small">
                      <Calendar size={16} className="me-2 text-primary" />
                      {cert.date}
                    </div>
                  </div>

                  {/* Buttons Group */}
                  <div className="d-flex gap-2">
                    <a 
                      href={cert.verifyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary flex-grow-1 d-flex align-items-center justify-center py-2 px-1 rounded-3"
                    >
                      <ExternalLink size={16} className="me-2" />
                      Verify
                    </a>
                    <a 
                      href={cert.downloadPath}
                      download={`${cert.title}.pdf`}
                      className="btn btn-primary flex-grow-1 d-flex align-items-center justify-center py-2 px-1 rounded-3 shadow-sm"
                    >
                      <Download size={16} className="me-2" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded CSS for custom interactions */}
      <style>{`
        .hover-lift:hover {
          transform: translateY(-10px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
        }
        .card-img-top:hover {
          transform: scale(1.08);
        }
        .transition-all {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Certificates;