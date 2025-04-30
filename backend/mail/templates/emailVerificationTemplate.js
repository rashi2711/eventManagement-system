const emailVerificationTemplate = (otp, firstName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
    <h2>Welcome to EventSphere, ${firstName}!</h2>
    <p>Please verify your email address by entering the following OTP:</p>
    <h3 style="background: #f0f0f0; padding: 10px; text-align: center;">${otp}</h3>
    <p>This OTP is valid for 10 minutes.</p>
    <p>Thank you for joining EventSphere!</p>
  </div>
`;

module.exports = emailVerificationTemplate;