/**
 * routes/enquiries.js
 * ─────────────────────────────────────────────────────────
 * B2B & Corporate Bulk Enquiry Endpoints:
 *   POST /api/enquiries/corporate
 */

const express      = require('express');
const router       = express.Router();
const validateBody = require('../middleware/validateBody');
const { AppError } = require('../middleware/errorHandler');
const { sendCorporateEnquiryNotificationToAdmin } = require('../services/emailService');

// Store in-memory log of corporate enquiries for demo/development
const corporateEnquiries = [];

router.post(
  '/corporate',
  validateBody({
    fullName:    { type: 'string', required: true },
    companyName: { type: 'string', required: true },
    email:       { type: 'email',  required: true },
    phone:       { type: 'phone',  required: true },
  }),
  async (req, res, next) => {
    try {
      const {
        fullName,
        companyName,
        email,
        phone,
        quantity = '50-100',
        budget = '1000-2500',
        occasion = 'Corporate Gifting',
        message = ''
      } = req.body;

      const enquiryId = `ENQ_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

      const enquiryRecord = {
        id: enquiryId,
        enquiryId,
        fullName,
        companyName,
        email,
        phone,
        quantity,
        budget,
        occasion,
        message,
        createdAt: new Date().toISOString()
      };

      corporateEnquiries.push(enquiryRecord);
      console.log('💼 New Corporate Bulk Enquiry Received:', enquiryRecord);

      // Trigger instant email notification to merchant admin
      sendCorporateEnquiryNotificationToAdmin(enquiryRecord).catch((err) => {
        console.error('Failed to send corporate enquiry email alert:', err.message);
      });

      res.json({
        success: true,
        enquiry_id: enquiryId,
        message: 'Corporate bulk enquiry received successfully.'
      });
    } catch (err) {
      next(new AppError(`Enquiry processing failed: ${err.message}`, 500, 'ENQUIRY_ERROR'));
    }
  }
);

// GET /api/enquiries/corporate — list recent enquiries
router.get('/corporate', (req, res) => {
  res.json({
    success: true,
    total: corporateEnquiries.length,
    enquiries: corporateEnquiries
  });
});

// In-memory list of VIP Energy Stones Launch Subscribers
const energySubscribers = [];

// POST /api/enquiries/subscribe — Subscribe to Energy Stones launch list
router.post(
  '/subscribe',
  validateBody({
    email: { type: 'email', required: true },
  }),
  (req, res, next) => {
    try {
      const body = req.body || {};
      const email = body.email;
      const purpose = body.purpose || 'General Energy Stones';

      const subscriber = {
        id: `SUB_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        email: email.trim().toLowerCase(),
        purpose: String(purpose),
        createdAt: new Date().toISOString()
      };

      energySubscribers.push(subscriber);
      console.log('✨ New Energy Stones VIP Launch Subscriber:', subscriber);

      return res.json({
        success: true,
        message: 'Successfully subscribed to Energy Stones launch access.',
        subscriber
      });
    } catch (err) {
      console.error('Error handling subscription:', err);
      return next(new AppError(`Subscription failed: ${err.message}`, 500, 'SUBSCRIBE_ERROR'));
    }
  }
);

// GET /api/enquiries/subscribers — View subscribers list
router.get('/subscribers', (req, res) => {
  res.json({
    success: true,
    total: energySubscribers.length,
    subscribers: energySubscribers
  });
});

module.exports = router;
