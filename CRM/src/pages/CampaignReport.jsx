import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './report.css';

const CampaignReport = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/campaigns/report');
        setReports(res.data.reports || []);
      } catch (err) {
        console.error('Error fetching campaign reports:', err);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="container">
      <h2 className="title">📊 Campaign Delivery Report</h2>

      <div className="tableWrapper">
        <table className="table">
          <thead>
            <tr className="theadRow">
              <th className="th thCampaignName">📢 Campaign Name</th>
              <th className="th">✅ Success DLR %</th>
              <th className="th">❌ Failed DLR %</th>
              <th className="th"> Attributed Customers</th>
              <th className="th"> Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="5" className="noDataCell">
                  No campaign report available.
                </td>
              </tr>
            ) : (
              reports.map((report, idx) => {
                const { campaign_name, total, successful, success_rate } = report;
                const failed = total - successful;
                const failedRate = 100 - success_rate * 100;
                const revenue = successful * 105;
                const rowClass = idx % 2 === 0 ? 'tbodyRowEven' : 'tbodyRowOdd';

                return (
                  <tr key={idx} className={`${rowClass} tbodyRowHover`}>
                    <td className="td fontBold">{campaign_name}</td>
                    <td
                      className="td success"
                      title={`${successful} customers succeeded`}
                    >
                      {(success_rate * 100).toFixed(2)}%
                    </td>
                    <td
                      className="td failed"
                      title={`${failed} customers failed`}
                    >
                      {failedRate.toFixed(2)}%
                    </td>
                    <td
                      className="td attributed"
                      title={`~${Math.floor(total * 0.15)} attributed`}
                    >
                      {Math.floor(total * 0.15)}
                    </td>

                    <td className="td attributed" title="Estimated revenue">
                      ₹{revenue.toLocaleString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignReport;
