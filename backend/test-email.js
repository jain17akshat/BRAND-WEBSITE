require('dotenv').config();
const { sendCorporateEnquiryNotificationToAdmin } = require('./services/emailService');

async function test() {
  console.log('Sending test corporate enquiry email via Gmail SMTP...');
  const res = await sendCorporateEnquiryNotificationToAdmin({
    enquiryId: 'ENQ_TEST_001',
    fullName: 'Test Client',
    companyName: 'Shraviko Test Corp',
    email: 'shraviko@gmail.com',
    phone: '+91 7742320607',
    quantity: '100-500',
    budget: '₹1,000 - ₹2,500',
    occasion: 'Diwali Corporate Gifting',
    message: 'Testing real Gmail SMTP email delivery for Shraviko.'
  });

  console.log('Result:', res);
}

test();
