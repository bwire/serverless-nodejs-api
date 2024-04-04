const { z } = require('zod');

async function validateLead(postData) {
  const lead = z.object({
    email: z.string().email(),
  });

  let hasError = false;
  let validData = {};
  let message = '';

  try {
    validData = lead.parse(postData);
  } catch (e) {
    hasError = true;
    message = 'Invalid email';
  }

  return {
    data: validData,
    hasError,
    message,
  };
}

module.exports.validateLead = validateLead;
