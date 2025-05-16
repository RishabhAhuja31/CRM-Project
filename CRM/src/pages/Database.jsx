import { useState, useEffect } from 'react';


const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

function Database() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgSpend, setAvgSpend] = useState(0);
  const [newCustomers, setNewCustomers] = useState(0);
  const [repeatCustomers, setRepeatCustomers] = useState(0);

  const fetchData = async () => {
    try {
      const customerResponse = await fetch('http://localhost:5000/api/customers');
      const customers = await customerResponse.json();

      setTotalCustomers(customers.length);

      const totalSpendSum = customers.reduce((sum, c) => sum + (c.total_spend || 0), 0);
      setAvgSpend(customers.length > 0 ? totalSpendSum / customers.length : 0);

      const newCustCount = customers.filter(c => c.number_of_visits === 1).length;
      const repeatCustCount = customers.filter(c => c.number_of_visits > 1).length;

      setNewCustomers(newCustCount);
      setRepeatCustomers(repeatCustCount);

      const orderResponse = await fetch('http://localhost:5000/api/orders');
      const orders = await orderResponse.json();

      setTotalOrders(orders.length);
    } catch (error) {
      console.error('Error fetching data:', error);
      setTotalCustomers(0);
      setTotalOrders(0);
      setAvgSpend(0);
      setNewCustomers(0);
      setRepeatCustomers(0);
    }
  };

  useEffect(() => {
    document.body.classList.add('no-scroll');

    fetchData();
    return () => {
      
      document.body.classList.remove('no-scroll');
    }; 
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        overflow: 'hidden' ,
        justifyContent: 'center',
        alignItems: 'center',
       
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        style={{
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          maxWidth: '900px',
          width: '90%',
          color: '#fff',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#ffffff', fontWeight: '700' }}>
          Mini CRM Dashboard
        </h1>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={fetchData}
            style={{
              backgroundColor: '#ffffff',
              color: '#5041BC',
              border: 'none',
              padding: '10px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              fontFamily: "'Nunito', sans-serif",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e5e4fc')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            Refresh Data
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
          }}
        >
          
          <StatCard label="Total Customers" value={totalCustomers} />
          <StatCard label="Total Orders" value={totalOrders} />
          <StatCard label="Average Spend" value={`₹${avgSpend.toFixed(2)}`} />
          <StatCard label="New Customers" value={newCustomers} />
          <StatCard label="Repeat Cust." value={repeatCustomers} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '1.5rem 1rem',
        textAlign: 'center',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.3s',
        fontFamily: "'Nunito', sans-serif",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: '700' }}>{value}</div>
    </div>
  );
}

export default Database;
