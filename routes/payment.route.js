const express=require('express');
const { startSession } = require('mongoose');
const router = express.Router();
const stripe = require ('stripe');
const Stripe =
stripe('sk_test_51KtYRUD3HS4vNAwa7ANL32HQqRTywhV3JHWIp3BxAIHv04bWoz22aKlRs9Q1L6znSX2i5fu5i3Xkl9i2Goz7jAkC00LL0T3lTL');
router.post('/', async (req, res) => { console.log(req.body)
let status, error;
const { token, amount } = req.body;


try {
await Stripe.charges.create({
source: token.id,
amount,
currency: 'usd',
});
status = 'success';
} catch (error) {
console.log(error);
status = 'Failure';
}
res.json({ error, status });
});
module.exports = router;