/**
 * routes/rates.js
 * POST /api/rates/check — check delivery serviceability + ETA
 */

const express      = require('express');
const router       = express.Router();
const srClient     = require('../shiprocket/client');
const validateBody = require('../middleware/validateBody');
const { AppError } = require('../middleware/errorHandler');

router.post('/check', validateBody({
  pickup_pincode:   { type: 'number', required: true },
  delivery_pincode: { type: 'number', required: true },
  weight:           { type: 'number', required: true, min: 0.1 },
  cod:              { type: 'boolean', required: false },
}), async (req, res, next) => {
  try {
    const {
      pickup_pincode   = 302006,
      delivery_pincode,
      weight,
      cod = 0,
    } = req.body;

    if (req.mock.shiprocket) {
      return res.json({
        success: true,
        serviceable: true,
        estimated_days: 4,
        couriers: [
          { name: 'Delhivery',  etd: '3-4 days', rate: 0, is_fastest: false },
          { name: 'BlueDart',   etd: '2-3 days', rate: 0, is_fastest: true  },
          { name: 'DTDC',       etd: '4-5 days', rate: 0, is_fastest: false },
        ],
        _mock: true,
      });
    }

    const { data } = await srClient.get('/courier/serviceability/', {
      params: {
        pickup_postcode:   pickup_pincode,
        delivery_postcode: delivery_pincode,
        weight,
        cod: cod ? 1 : 0,
      },
    });

    const couriers = (data?.data?.available_courier_companies || []).map(c => ({
      name:        c.courier_name,
      etd:         c.etd,
      rate:        c.rate,
      is_fastest:  c.is_fastest === 1,
    }));

    res.json({
      success:        true,
      serviceable:    couriers.length > 0,
      estimated_days: couriers[0]?.etd?.split(' ')?.[0] || null,
      couriers,
    });
  } catch (err) {
    next(new AppError(
      `Rates check failed: ${err.response?.data?.message || err.message}`,
      502, 'SHIPROCKET_ERROR'
    ));
  }
});

module.exports = router;
