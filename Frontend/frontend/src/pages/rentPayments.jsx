import "../css/rentpayment.css";
import Layout from "../components/Layout";

const RentPayments = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-title"><h1>Rent Payments</h1><p>Manage your rent and token payments</p></div>
        <button className="btn btn-outline">Download Statement</button>
      </div>

      <div className="payment-overview">
        <div className="overview-card current-rent">
          <span className="card-label">Current Property</span>
          <h3>2BHK Apartment, Baneshwor</h3>
          <div className="rent-details">
            <div className="rent-amount"><span className="amount">Rs. 15,000</span><span>/month</span></div>
            <div className="due-date"><span>Due Date:</span><span className="date warning">May 15, 2026</span></div>
          </div>
          <button className="btn btn-primary">Pay Rent Now</button>
        </div>
        <div className="overview-card stats-card">
          <div className="stat-row">
            <div className="stat-box"><span className="stat-value">Rs. 45,000</span><span>Total Paid (2026)</span></div>
            <div className="stat-box"><span className="stat-value success">Rs. 5,000</span><span>Token Deposit</span></div>
          </div>
          <div className="stat-row">
            <div className="stat-box"><span className="stat-value">3</span><span>Months Paid</span></div>
            <div className="stat-box"><span className="stat-value success">On Time</span><span>Payment Status</span></div>
          </div>
        </div>
      </div>

      <div className="quick-pay-section">
        <h3>Quick Payment</h3>
        <div className="payment-methods">
          {["eSewa","Khalti","Bank","IPS"].map(m => <div className="payment-method" key={m}>{m}</div>)}
        </div>
      </div>

      <div className="payment-history-card">
        <h3>Payment History</h3>
        <table className="payment-table">
          <thead><tr><th>ID</th><th>Date</th><th>Description</th><th>Property</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>#TXN-78452</td><td>May 1, 2026</td><td>Rent - May</td><td>Baneshwor</td><td>Rs. 15,000</td><td>eSewa</td><td>Completed</td></tr>
            <tr><td>#TXN-78301</td><td>Apr 1, 2026</td><td>Rent - April</td><td>Baneshwor</td><td>Rs. 15,000</td><td>Khalti</td><td>Completed</td></tr>
            <tr><td>#TXN-78156</td><td>Mar 25, 2026</td><td>Token Payment</td><td>Baneshwor</td><td>Rs. 5,000</td><td>Bank</td><td>Completed</td></tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default RentPayments;