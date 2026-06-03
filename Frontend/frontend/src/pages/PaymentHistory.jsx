import "../css/PaymentHistory.css";
import Layout from "../components/Layout";

const payments = [
  { day: "20", month: "Mar", title: "Cozy Room in Thamel",  desc: "March Rent Payment",    amount: "Rs. 15,000" },
  { day: "20", month: "Feb", title: "Cozy Room in Thamel",  desc: "February Rent Payment", amount: "Rs. 15,000" },
  { day: "20", month: "Jan", title: "Modern Flat in Patan", desc: "January Rent Payment",  amount: "Rs. 22,000" },
];

const PaymentHistory = () => {
  return (
    <Layout>
      <div className="page-header">
        <div className="page-title"><h1>Payment History</h1><p>Track all your room rental payments</p></div>
      </div>
      <div className="section">
        <div className="section-header"><h3>Recent Transactions</h3></div>
        {payments.map(({ day, month, title, desc, amount }) => (
          <div className="payment-item" key={desc}>
            <div className="payment-date"><div className="date-day">{day}</div><div className="date-month">{month}</div></div>
            <div className="payment-info"><h4>{title}</h4><p>{desc}</p></div>
            <div className="payment-amount">{amount}</div>
            <span className="status-badge success">Completed</span>
            <button className="btn btn-sm btn-outline">Receipt</button>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default PaymentHistory;