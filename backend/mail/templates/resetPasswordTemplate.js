const resetPasswordTemplate = (otp, firstName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
    <h2>Password Reset Request, ${firstName}</h2>
    <p>We received a request to reset your EventSphere password. Please use the following OTP to proceed:</p>
    <h3 style="background: #f0f0f0; padding: 10px; text-align: center;">${otp}</h3>
    <p>This OTP is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  </div>
`;

module.exports = resetPasswordTemplate;