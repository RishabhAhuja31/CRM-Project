const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require('axios');

router.post('/segments/nlp-parse', async (req, res) => {
  const { prompt } = req.body;

  const systemMessage = `
You are a helpful assistant that turns English segmentation prompts into JSON rules.
Use only these fields: "spend", "visits", "last_shopped".
Operators: ">", "<", "=".
Return this format:

[
  {
    "field": "spend",
    "operator": ">",
    "value": 5000,
    "logicalOperator": "AND"
  },
  {
    "field": "last_shopped",
    "operator": "<",
    "value": "2024-11-16"
  }
]

If time is mentioned (like "not shopped in 6 months"), return a date 6 months ago from today.
`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'nousresearch/deephermes-3-mistral-24b-preview:free',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const jsonText = response.data.choices[0].message.content.trim();

    let conditions;
    try {
      conditions = JSON.parse(jsonText);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format returned by AI' });
    }
// Normalize logicalOperator for all but the first condition
conditions = conditions.map((cond, idx) => {
    if (idx === 0) return cond;
    if (!cond.logicalOperator) {
      return { ...cond, logicalOperator: 'AND' };
    }
    return cond;
  });
  
    return res.json({ success: true, conditions });
  } catch (error) {
    console.error('OpenRouter error:', error.response?.data || error.message || error);
    return res.status(500).json({ success: false, message: 'AI parsing failed' });
  }
});

module.exports = router;
