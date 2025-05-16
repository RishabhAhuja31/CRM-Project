import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Segmentation.css';
const CampaignCreation = () => {
  const [communicationId, setCommunicationId] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('Hi {name}, here’s 10% off on your next order!');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState('');

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [campaignType, setCampaignType] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [segments, setSegments] = useState([]);
  const [scheduledCampaigns, setScheduledCampaigns] = useState([]);
  useEffect(() => {
    const fetchScheduledCampaigns = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/campaigns/scheduled');
        if (res.data.success) {
          setScheduledCampaigns(res.data.campaigns);
        }
      } catch (err) {
        console.error('Error fetching scheduled campaigns:', err);
      }
    };
  
    fetchScheduledCampaigns();
  }, []);
  
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/segments');
        if (res.data.success && Array.isArray(res.data.segments)) {
          setSegments(res.data.segments);
        } else {
          setStatus('No segments available');
        }
      } catch (err) {
        setStatus('Error fetching segments');
        console.error('Error fetching data:', err);
      }
    };

    fetchSegments();
  }, []);

  const handleSendCampaign = async () => {
    if (!communicationId || !merchantId || !messageTemplate.includes('{name}')) {
      setStatus('Please fill all fields and include {name} in the message.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const res = await axios.post('http://localhost:5000/api/campaigns/send', {
        communication_id: communicationId,
        merchant_id: merchantId,
        message_template: messageTemplate,
      });
      setStatus(res.data.message || 'Campaign sent successfully!');
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || 'Failed to send campaign');
    } finally {
      setLoading(false);
    }
  };

  const handlePopupOpen = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);

  const handleCampaignTypeSelect = (type) => {
    if (!campaignName.trim()) {
      setStatus('❌ Please enter a campaign name before choosing a type.');
      return;
    }
    setCampaignType(type);
    setIsPopupOpen(false);
  };
  

  const handleApproval = async () => {
    const campaignData = {
      campaignType,
      selectedSegment,
      customMessage,
      scheduleTime,
      campaignName,  // 👈 Include it here
      
    };
    
    const now = new Date();
const selectedTime = new Date(scheduleTime);

if (selectedTime <= now) {
  setStatus('❌ Schedule time must be in the future.');
  return;
}

    try {
      await axios.post('http://localhost:5000/api/campaigns/send', campaignData);
      setStatus('✅ Campaign successfully saved and scheduled!');
    } catch (error) {
      setStatus('❌ Failed to schedule campaign');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        📢 Create & Send Campaign
      </h2>
      <div className="mb-4">
        <div className="segment-name">
        <input
          type="text"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Enter campaign name"
          className="w-full p-2 border rounded"
        /></div>
      </div>

      <button
        onClick={handlePopupOpen}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition"
      >
        + New Campaign
      </button>

      {isPopupOpen && (
       

          <div>
              Select Campaign Type
              <div className="actions">
              <button
                onClick={() => handleCampaignTypeSelect("SMS")}
                className="bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                SMS Campaign
              </button>
              <button
                onClick={() => handleCampaignTypeSelect("WhatsApp")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                WhatsApp Campaign
              </button>
              <button
                onClick={handlePopupClose}
                className="mt-2 text-sm text-gray-500 hover:underline self-center"
              >
                Cancel
              </button>
            </div></div>
   
      )}

      {campaignType && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Campaign Details ({campaignType})
          </h4>
          <div className="condition">
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">
              Select Segment    
            </label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Choose a Segment --</option>
              {segments.length === 0 ? (
                <option disabled>No segments available</option>
              ) : (
                segments.map((segment) => (
                  <option key={segment._id} value={segment._id}>
                    {segment.name} ({segment.customerCount} customers)
                  </option>
                ))
              )}
            </select>
          </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">Message</label>
            <textarea
              rows="3"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use <code>{"{name}"}</code> to personalize the message.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">
              Schedule Time
            </label>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full p-2 border rounded"
              min={new Date().toISOString().slice(0, 16)} 
            />
          </div>

          <button
            onClick={handleApproval}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            ✅ Approve & Schedule
          </button>
        </div>
      )}

      {status && (
        <div
          className={`mt-6 p-3 rounded text-sm ${
            status.includes("Failed")
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status}
        </div>
      )}
      {scheduledCampaigns.length > 0 && (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">
      📅 Scheduled Campaigns
    </h3>
    <div className="saved-segments">
      {scheduledCampaigns.map((camp, index) => (
        <div key={index} className="segment">
          <div className="segment-header">
            <p>{camp.campaign_name}</p>
            <p>📬 {camp.customerCount} Customers</p>
          </div>
          <p style={{ fontSize: '0.9rem', opacity: 0.85 }}>
            Scheduled for: {new Date(camp.scheduled_time).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
  
};

export default CampaignCreation;
