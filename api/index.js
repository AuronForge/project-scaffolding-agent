/**
 * Root redirect to API documentation
 * Endpoint: GET /api
 */
export default function handler(req, res) {
  // Redirect to API documentation
  res.setHeader('Location', '/api/v1/api-docs');
  res.status(302).end();
}
