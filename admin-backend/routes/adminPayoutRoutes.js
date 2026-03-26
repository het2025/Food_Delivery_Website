import express from 'express';
import { getPendingBankAccounts, updateBankAccountStatus } from '../controllers/adminBankAccountController.js';
import { getAllPayoutRequests, updatePayoutStatus } from '../controllers/adminPayoutController.js';
// import { protect, admin } from '../middleware/authMiddleware.js'; // Assuming auth middleware exists

const router = express.Router();

// router.use(protect); // specific protection if needed
// router.use(admin);

router.get('/bank-accounts/pending', getPendingBankAccounts);
router.put('/bank-accounts/:id/status', updateBankAccountStatus);

router.get('/requests', getAllPayoutRequests);
router.put('/requests/:id/status', updatePayoutStatus);

export default router;
