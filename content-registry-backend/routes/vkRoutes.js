const express = require('express');
const router = express.Router();
const vkController = require('../controllers/vkController');

// Sync VK content with MWS Tables
router.post('/sync', vkController.syncContent);

// Get detailed post information
router.get('/posts/:ownerId/:postId', vkController.getPostDetails);

// Get group statistics
router.get('/groups/:groupId/stats', vkController.getGroupStats);

// Get recent posts
router.get('/groups/:groupId/posts', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { count = 50 } = req.query;
    
    const posts = await require('../services/vkService').getGroupPosts(groupId, parseInt(count));
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;