/**
 * Request logging middleware
 */

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log request
  console.log(`→ ${req.method} ${req.path}`);

  // Log response after it's sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusSymbol = status >= 400 ? '✗' : '✓';
    
    console.log(`${statusSymbol} ${req.method} ${req.path} - ${status} (${duration}ms)`);
  });

  next();
};
