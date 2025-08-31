import rateLimit from 'express-rate-limit';

export default rateLimit({
    windowMs: 60 * 1000,
    max: 250,
    message: { message: 'Too many requests, try again later.' }
});
