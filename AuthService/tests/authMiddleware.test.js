const authenticateAPIToken = require('../middleware/ApiMiddleware');

describe('authenticateAPIToken', () => {
  it('should return 401 status with error message if no API key provided', () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authenticateAPIToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - No valid token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 status with error message if API key is invalid', () => {
    const req = { headers: { apikey: 'invalid-api-key' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const originalEnv = process.env.GATEWAY_TOKEN;
    process.env.GATEWAY_TOKEN = 'valid-api-key';

    authenticateAPIToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized - Invalid API key' });
    expect(next).not.toHaveBeenCalled();

    // Restore process.env.GATEWAY_TOKEN
    process.env.GATEWAY_TOKEN = originalEnv;
  });

  it('should call next if API key is valid', () => {
    const req = { headers: { apikey: 'valid-api-key' } };
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const originalEnv = process.env.GATEWAY_TOKEN;
    process.env.GATEWAY_TOKEN = 'valid-api-key';

    authenticateAPIToken(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();

    process.env.GATEWAY_TOKEN = originalEnv;
  });
});
