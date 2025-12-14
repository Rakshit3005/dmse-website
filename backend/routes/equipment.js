const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const authMiddleware = require('../middleware/authMiddleware');

// Routes for equipment management
router.get('/labs', equipmentController.getLabs);
router.get('/instruments/:lab_id', equipmentController.getInstruments);
router.post('/book', authMiddleware, equipmentController.bookSlot);
router.get('/slot-history', authMiddleware, equipmentController.getSlotHistory);
router.get('/bookings', authMiddleware, equipmentController.getAllBookings);
router.post('/approve/:id', authMiddleware, equipmentController.approveBooking);
router.post('/reject/:id', authMiddleware, equipmentController.rejectBooking);
router.post('/add-instrument', authMiddleware, equipmentController.addInstrument);

module.exports = router;