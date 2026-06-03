import "../css/UpcomingVisit.css";
import Layout from "../components/Layout";

const UpcomingVisit = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-title"><h1>Scheduled Visits</h1><p>Your upcoming property viewing appointments</p></div>
      </div>
      <div className="section">
        <h3 style={{ marginBottom: "16px" }}>Upcoming Visits</h3>
        {[
          { day: "23", month: "Mar", title: "Beautiful Room in Thamel", loc: "Thamel, Kathmandu",  time: "2:00 PM - 3:00 PM",   owner: "Krishna Rai" },
          { day: "25", month: "Mar", title: "Cozy Flat in Patan",       loc: "Patan, Lalitpur",    time: "10:00 AM - 11:00 AM", owner: "Sita Thapa"  },
        ].map(({ day, month, title, loc, time, owner }) => (
          <div className="visit-card" key={title}>
            <div className="visit-header">
              <div className="visit-date-badge"><span className="day">{day}</span><span className="month">{month}</span></div>
              <div className="visit-title"><h4>{title}</h4><p>{loc}</p></div>
            </div>
            <div className="visit-details"><span>🕐 {time}</span><span>👤 {owner}</span></div>
            <div className="visit-actions">
              <button className="btn btn-primary">Reschedule</button>
              <button className="btn btn-outline">Cancel</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default UpcomingVisit;