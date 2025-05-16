
const express = require('express');
const Segmentation = require('../models/Segmentation');
const Customer = require('../models/Customer');
const FilterMap = require('../models/FilterMap');  
const router = express.Router();


router.post('/segments', async (req, res) => {
    
fetch("/api/segments")
  .then((response) => {
    
    console.log("Response:", response);

    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject("Failed to fetch segments");
    }
  })
  .then((data) => {
    console.log("Segments:", data);
  })
  .catch((error) => {
    console.error("Error fetching segments:", error);
  });

  try {
    const { name, conditions } = req.body;

    if (!name || !conditions || !Array.isArray(conditions)) {
      return res.status(400).json({ success: false, message: 'Segment name and conditions are required' });
    }

    
    const filters = [];

    for (let cond of conditions) {
      let field = '';
      if (cond.field === 'spend') field = 'total_spend';
      if (cond.field === 'visits') field = 'number_of_visits';

      if (!field || !cond.operator || cond.value === undefined) continue;

      let mongoOperator;
      switch (cond.operator) {
        case '>': mongoOperator = '$gt'; break;
        case '<': mongoOperator = '$lt'; break;
        case '=': mongoOperator = '$eq'; break;
        case '>=': mongoOperator = '$gte'; break;
        case '<=': mongoOperator = '$lte'; break;
        default: mongoOperator = null;
      }

      if (!mongoOperator) continue;

      const filter = { [field]: { [mongoOperator]: Number(cond.value) } };
      filters.push({ filter, logicalOperator: cond.logicalOperator });
    }

    let mongoQuery = {};
    if (filters.length === 1) {
      mongoQuery = filters[0].filter;
    } else {
      let combined = filters[0].filter;
      for (let i = 1; i < filters.length; i++) {
        const logic = filters[i - 1].logicalOperator;
        if (logic === 'OR') {
          combined = { $or: [combined, filters[i].filter] };
        } else {
          combined = { $and: [combined, filters[i].filter] };
        }
      }
      mongoQuery = combined;
    }

    
    const matchingCustomers = await Customer.find(mongoQuery);

    
    if (matchingCustomers.length === 0) {
      return res.status(400).json({ success: false, message: 'No customers found for this segment' });
    }

    
    const newSegmentation = new Segmentation({
      name,
      conditions,
      customerCount: matchingCustomers.length,
    });
    await newSegmentation.save();

    
    const filterMapEntries = matchingCustomers.map((customer) => {
      return {
        phone_number: customer.phone,  
        segment_id: newSegmentation._id,
        customer_id: customer.customer_id,
      };
    });

    
    await FilterMap.insertMany(filterMapEntries);

    res.status(201).json({
      success: true,
      message: 'Segment created and filter_map entries added successfully',
      segment: newSegmentation,
    });

  } catch (error) {
    console.error('Error creating segment:', error);
    res.status(400).json({ success: false, message: 'Error creating segment', error });
  }
});
router.get('/segments', async (req, res) => {
  try {
    const segments = await Segmentation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, segments });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error fetching segments', error });
  }
});
router.post('/segments/preview', async (req, res) => {
  try {
    const { conditions } = req.body;

    if (!conditions || conditions.length === 0) {
      return res.status(400).json({ success: false, message: 'No conditions provided' });
    }

    const filters = [];

    for (let cond of conditions) {
      let field = '';
      if (cond.field === 'spend') field = 'total_spend';
      if (cond.field === 'visits') field = 'number_of_visits';

      if (!field || !cond.operator || cond.value === undefined) continue;

      let mongoOperator;
      switch (cond.operator) {
        case '>': mongoOperator = '$gt'; break;
        case '<': mongoOperator = '$lt'; break;
        case '>=': mongoOperator = '$gte'; break;
        case '<=': mongoOperator = '$lte'; break;
        case '=': mongoOperator = '$eq'; break;
        default: mongoOperator = null;
      }

      if (!mongoOperator) continue;

      const filter = { [field]: { [mongoOperator]: Number(cond.value) } };
      filters.push({ filter, logicalOperator: cond.logicalOperator });
    }

    
    let mongoQuery = {};
    if (filters.length === 1) {
      mongoQuery = filters[0].filter;
    } else {
      
      let combined = filters[0].filter;
      for (let i = 1; i < filters.length; i++) {
        const logic = filters[i - 1].logicalOperator; 
        if (logic === 'OR') {
          combined = { $or: [combined, filters[i].filter] };
        } else {
          combined = { $and: [combined, filters[i].filter] };
        }
      }
      mongoQuery = combined;
    }

    console.log('Mongo Query:', JSON.stringify(mongoQuery, null, 2));
    const count = await Customer.countDocuments(mongoQuery);
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ success: false, message: 'Error previewing audience size', error: error.message || error });
  }
});

router.delete('/segments/:id', async (req, res) => {
  try {
    const segmentId = req.params.id;

    
    if (!segmentId) {
      return res.status(400).json({ success: false, message: 'Segment ID is required' });
    }

    
    const deletedSegment = await Segmentation.findByIdAndDelete(segmentId);

    if (!deletedSegment) {
      return res.status(404).json({ success: false, message: 'Segment not found' });
    }

    
    await FilterMap.deleteMany({ segment_id: segmentId });

    res.status(200).json({ success: true, message: 'Segment and related filter_map entries deleted successfully' });
  } catch (error) {
    console.error('Error deleting segment:', error);
    res.status(500).json({ success: false, message: 'Error deleting segment', error: error.message || error });
  }
});

module.exports = router;
