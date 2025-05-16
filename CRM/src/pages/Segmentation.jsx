import { useState, useEffect } from 'react';
import './Segmentation.css';

function Segmentation() {

  const [conditions, setConditions] = useState([
    { id: 1, field: 'spend', operator: '>', logicalOperator: 'AND' },
  ]);
  const [segments, setSegments] = useState([]);
  const [segmentName, setSegmentName] = useState('');
const [tooltipVisibleId, setTooltipVisibleId] = useState(null);

  
  const fetchSegments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/segments');
      const data = await response.json();
      if (data.success) {
        setSegments(data.segments);
      } else {
        alert('Error fetching segments');
      }
    } catch (error) {
      console.error('Error fetching segments:', error);
      alert('Error fetching segments');
    }
  };
  const handleDeleteSegment = async (segmentId) => {
    if (!window.confirm("Are you sure you want to delete this segment?")) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/segments/${segmentId}`, {
        method: 'DELETE',
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Segment deleted successfully');
        fetchSegments(); 
      } else {
        alert(`Error deleting segment: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete segment');
    }
  };
  useEffect(() => {
    fetchSegments();
  }, []);

  
  const handleAddCondition = () => {
    const newCondition = {
      id: conditions.length + 1,
      field: 'spend',
      operator: '>',
      logicalOperator: 'AND',
    };
    setConditions([...conditions, newCondition]);
  };

  
  const handleRemoveCondition = (id) => {
    if (conditions.length === 1) {
      alert('At least one condition is required.');
      return;
    }
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  
  const handleChange = (id, field, value) => {
    setConditions(
      conditions.map((condition) =>
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    );
  };

  
  const handlePreview = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/segments/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conditions }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Estimated Audience Size: ${data.count}`);
      } else {
        alert(`Preview failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Preview Error:', error);
      alert('Failed to preview audience size');
    }
  };

  
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: segmentName, conditions }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Segment saved successfully!');
        setSegmentName('');
        fetchSegments(); 
      } else {
        alert('Error saving segment');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving segment');
    }
  };

  return (
    <div className="segmentation-container">
      <h2>Create Audience Segments</h2>

      <div className="segment-name">
        <input
          type="text"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          placeholder="Enter segment name"
        />
      </div>

      <div className="conditions">
        {conditions.map((condition, index) => (
          <div key={condition.id} className="condition">
            <select
              value={condition.field}
              onChange={(e) =>
                handleChange(condition.id, "field", e.target.value)
              }
            >
              <option value="spend">Spend</option>
              <option value="visits">Visits</option>
            </select>
            <select
              value={condition.operator}
              onChange={(e) =>
                handleChange(condition.id, "operator", e.target.value)
              }
            >
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value="=">=</option>
            </select>

            <input
              type="number"
              value={condition.value}
              onChange={(e) =>
                handleChange(condition.id, "value", e.target.value)
              }
            />

            {index < conditions.length - 1 && (
              <select
                value={condition.logicalOperator}
                onChange={(e) =>
                  handleChange(condition.id, "logicalOperator", e.target.value)
                }
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            )}

            <button
              onClick={() => handleRemoveCondition(condition.id)}
              disabled={conditions.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleAddCondition}>+ Add Condition</button>

      <div className="actions">
        <button onClick={handlePreview}>Preview Audience Size</button>
        <button onClick={handleSubmit}>Save Segment</button>
      </div>

      <h2>Saved Segments</h2>
      <div className="saved-segments">
        {segments.map((segment) => (
  <div key={segment._id} className="segment">
    <div className="segment-header">
      <span>{segment.name}</span>
      
      <button
        className="info-button"
        title="View Conditions"
        onMouseEnter={() => setTooltipVisibleId(segment._id)}
        onMouseLeave={() => setTooltipVisibleId(null)}
      >
        i
      </button>

      {}
      <button
        className="delete-button"
        title="Delete Segment"
        onClick={() => handleDeleteSegment(segment._id)}
        style={{
          marginLeft: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'red',
          fontSize: '16px',
          lineHeight: '1',
        }}
      >
        🗑️
      </button>
    </div>

    <div className="customer-count">
      Customer Count: {segment.customerCount}
    </div>

    <div
      className="conditions-tooltip"
      style={{ display: tooltipVisibleId === segment._id ? 'block' : 'none' }}
    >
      <ul>
        {segment.conditions.map((condition, idx) => (
          <li key={idx}>
            {condition.field} {condition.operator} {condition.value}
            {idx < segment.conditions.length - 1 && (
              <span> {condition.logicalOperator}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  </div>
))}

      </div>
    </div>
  );
}

export default Segmentation;
