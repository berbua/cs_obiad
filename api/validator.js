const validator = require('validator');

// Sanitize input - remove HTML tags and dangerous characters
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Strip HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script-like content
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

// Validate signup data
function validateSignup(data) {
  const errors = [];
  
  // Nick validation
  if (!data.nick || typeof data.nick !== 'string') {
    errors.push('Nick jest wymagany');
  } else {
    const sanitizedNick = sanitizeInput(data.nick);
    if (sanitizedNick.length < 2) {
      errors.push('Nick musi mieć minimum 2 znaki');
    }
    if (sanitizedNick.length > 50) {
      errors.push('Nick może mieć maksymalnie 50 znaków');
    }
    data.nick = sanitizedNick;
  }
  
  // Time validation (optional)
  if (data.time && typeof data.time === 'string') {
    const sanitizedTime = sanitizeInput(data.time);
    if (sanitizedTime.length > 20) {
      errors.push('Godzina może mieć maksymalnie 20 znaków');
    }
    data.time = sanitizedTime;
  } else {
    data.time = '';
  }
  
  // Comment validation (optional)
  if (data.comment && typeof data.comment === 'string') {
    const sanitizedComment = sanitizeInput(data.comment);
    if (sanitizedComment.length > 200) {
      errors.push('Komentarz może mieć maksymalnie 200 znaków');
    }
    data.comment = sanitizedComment;
  } else {
    data.comment = '';
  }
  
  // Mood icon validation
  const allowedIcons = ['🍕', '🥗', '🌯', '🍔', '🍜', '🍝', '🍱', '🥙'];
  if (!data.moodIcon || !allowedIcons.includes(data.moodIcon)) {
    data.moodIcon = '🍕'; // Default
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data
  };
}

// Validate guestbook entry
function validateGuestbookEntry(data) {
  const errors = [];
  
  // Nick validation
  if (!data.nick || typeof data.nick !== 'string') {
    errors.push('Nick jest wymagany');
  } else {
    const sanitizedNick = sanitizeInput(data.nick);
    if (sanitizedNick.length < 2) {
      errors.push('Nick musi mieć minimum 2 znaki');
    }
    if (sanitizedNick.length > 50) {
      errors.push('Nick może mieć maksymalnie 50 znaków');
    }
    data.nick = sanitizedNick;
  }
  
  // Comment validation
  if (!data.comment || typeof data.comment !== 'string') {
    errors.push('Komentarz jest wymagany');
  } else {
    const sanitizedComment = sanitizeInput(data.comment);
    if (sanitizedComment.length < 3) {
      errors.push('Komentarz musi mieć minimum 3 znaki');
    }
    if (sanitizedComment.length > 500) {
      errors.push('Komentarz może mieć maksymalnie 500 znaków');
    }
    data.comment = sanitizedComment;
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data
  };
}

// Validate like request
function validateLikeRequest(data) {
  const errors = [];
  
  if (!data.id || typeof data.id !== 'number') {
    errors.push('Nieprawidłowe ID wpisu');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data
  };
}

module.exports = {
  sanitizeInput,
  validateSignup,
  validateGuestbookEntry,
  validateLikeRequest
};
