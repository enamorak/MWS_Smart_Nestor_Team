const express = require('express');
const router = express.Router();
const mwsService = require('../services/mwsService');

// Get table data
router.get('/tables/:tableId/data', async (req, res) => {
  try {
    const { tableId } = req.params;
    const filters = req.query;
    
    const data = await mwsService.getTableData(tableId, filters);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update table row
router.put('/tables/:tableId/rows/:rowId', async (req, res) => {
  try {
    const { tableId, rowId } = req.params;
    const rowData = req.body;
    
    const result = await mwsService.updateRow(tableId, rowId, rowData);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize content registry
router.post('/tables/initialize', async (req, res) => {
  try {
    const result = await mwsService.initializeContentRegistry();
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;