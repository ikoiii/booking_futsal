// Authentication configuration

export const authConfig = {
  // Session configuration
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key-here',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400'), // 24 hours

  // Password configuration
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),

  // JWT configuration (if using JWT)
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-here',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Rate limiting
  loginAttempts: parseInt(process.env.LOGIN_ATTEMPTS || '5'),
  lockoutTime: parseInt(process.env.LOCKOUT_TIME || '900000'), // 15 minutes

  // Validation
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneRegex: /^[+]?[0-9]{10,15}$/,
  minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH || '8')
}