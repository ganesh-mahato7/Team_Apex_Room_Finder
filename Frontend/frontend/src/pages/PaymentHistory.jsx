import "../css/PaymentHistory.css";
import "../css/globalstyle.css";
import Sidebar from "../components/Sidebar";

const PaymentHistory = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle">☰</button>
          </div>

          <div className="header-right">
            <button className="header-btn">🔔</button>

            <button className="header-btn">
              💬 <span className="message-count">4</span>
            </button>

            <div className="user-profile">
              <div className="user-avatar">RS</div>

              <div className="user-info">
                <span className="user-name">Ram Sharma</span>
                <span className="user-role">Room Seeker</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="page-header">
            <div className="page-title">
              <h1>Payment History</h1>
              <p>Track all your room rental payments</p>
            </div>
          </div>

          <div className="section">
            <div className="section-header">
              <h3>Recent Transactions</h3>
            </div>

            <div className="payment-item">
              <div className="payment-date">
                <div className="date-day">20</div>
                <div className="date-month">Mar</div>
              </div>

              <div className="payment-info">
                <h4>Cozy Room in Thamel</h4>
                <p>March Rent Payment</p>
              </div>

              <div className="payment-amount">
                Rs. 15,000
              </div>

              <span className="status-badge success">
                Completed
              </span>

              <button className="btn btn-sm btn-outline">
                Receipt
              </button>
            </div>

            <div className="payment-item">
              <div className="payment-date">
                <div className="date-day">20</div>
                <div className="date-month">Feb</div>
              </div>

              <div className="payment-info">
                <h4>Cozy Room in Thamel</h4>
                <p>February Rent Payment</p>
              </div>

              <div className="payment-amount">
                Rs. 15,000
              </div>

              <span className="status-badge success">
                Completed
              </span>

              <button className="btn btn-sm btn-outline">
                Receipt
              </button>
            </div>

            <div className="payment-item">
              <div className="payment-date">
                <div className="date-day">20</div>
                <div className="date-month">Jan</div>
              </div>

              <div className="payment-info">
                <h4>Modern Flat in Patan</h4>
                <p>January Rent Payment</p>
              </div>

              <div className="payment-amount">
                Rs. 22,000
              </div>

              <span className="status-badge success">
                Completed
              </span>

              <button className="btn btn-sm btn-outline">
                Receipt
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentHistory;