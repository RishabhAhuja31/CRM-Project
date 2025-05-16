const express = require('express');
const router = express.Router();
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const FilterMap = require('../models/FilterMap');

const Segmentation = require('../models/Segmentation');
const mongoose = require('mongoose');
const minRate = 0.8;
const maxRate = 0.9;
router.post('/campaigns/send', async (req, res) => {
  try {



    const { selectedSegment, customMessage, scheduleTime, campaignType, campaignName } = req.body;
    const scheduledDate = scheduleTime ? new Date(scheduleTime) : null;
    if (scheduleTime && isNaN(scheduledDate.getTime())) {
      return res.status(400).json({ message: 'Invalid scheduleTime format' });
    }

    
    const segment = await Segmentation.findById(selectedSegment);
    if (!segment) return res.status(404).json({ message: 'Segment not found.' });

    
    if (!mongoose.Types.ObjectId.isValid(selectedSegment)) {
      return res.status(400).json({ message: 'Invalid segment ID format' });
    }
const filterMapEntries = await FilterMap.find({
  
  segment_id: new mongoose.Types.ObjectId(selectedSegment),
});


if (!filterMapEntries || filterMapEntries.length === 0) {
  return res.status(400).json({ message: 'No customers found in this segment.' });
}


const customerIds = filterMapEntries.map(entry => entry.customer_id);


const customers = await Customer.find({ customer_id: { $in: customerIds } });
console.log("Sample customerId from FilterMap:", customerIds[0]);

const byId = await Customer.findOne({ customer_id: customerIds[0] });
const byCustomerId = await Customer.findOne({ customer_id: customerIds[0] });

  

    if (!customers || customers.length === 0) {
      return res.status(400).json({ message: 'No customers found in this segment.' });
    }



    
    const filteredCustomers = customers;
    


    
    const communicationLogs = filteredCustomers.map((customer) => {

      const personalizedMessage = customMessage.replace('{name}', customer.customer_name);
      const successRate = Math.random() * (maxRate - minRate) + minRate;
      const delivery_status = Math.random() < successRate ? 1 : 0;
      return {
        merchant_id: customer.merchant_id,
        communication_id: uuidv4(),
        customer_id: customer.customer_id,
        content: personalizedMessage,
        delivery_status,
        campaign_name: campaignName,
        scheduled_time: scheduledDate, 
      };
    });
    console.log("Example communication log:", communicationLogs[0]);
    await CommunicationLog.insertMany(communicationLogs);
    
    res.status(200).json({
      message: 'Campaign messages queued successfully.',
      sentCount: filteredCustomers.length
    });
    
  } catch (err) {
    console.error('Error sending campaign:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



  router.get('/scheduled', async (req, res) => {
    try {
      const campaigns = await CommunicationLog.aggregate([

        {
          $group: {
            _id: "$campaign_name",
            scheduled_time: { $first: "$scheduled_time" },
            customerIds: { $addToSet: "$customer_id" }
          }
        },
        {
          $project: {
            _id: 0,
            campaign_name: "$_id",
            scheduled_time: 1,
            customerCount: { $size: "$customerIds" }
          }
        },
        {
          $sort: { scheduled_time: 1 }  
        }
      ]);
  
      res.status(200).json({
        success: true,
        campaigns
      });
  
    } catch (err) {
      console.error('Error fetching scheduled campaigns:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch scheduled campaigns' });
    }
  });
  router.get('/campaigns/report', async (req, res) => {
    try {
      const reports = await CommunicationLog.aggregate([
        {
          $group: {
            _id: "$campaign_name",
            total: { $sum: 1 },
            successful: {
              $sum: {
                $cond: [{ $eq: ["$delivery_status", 1] }, 1, 0]
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            campaign_name: "$_id",
            total: 1,
            successful: 1,
            success_rate: {
              $cond: [
                { $eq: ["$total", 0] },
                0,
                { $divide: ["$successful", "$total"] }
              ]
            }
          }
        },
        { $sort: { campaign_name: 1 } }
      ]);
  
      res.status(200).json({ reports });
    } catch (err) {
      console.error('Failed to generate campaign report:', err);
      res.status(500).json({ message: 'Failed to fetch campaign report' });
    }
  });
  
  module.exports = router;