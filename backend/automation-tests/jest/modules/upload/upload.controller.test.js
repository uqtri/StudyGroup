import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../../src/utils/cloudinary.js', () => ({
  isCloudinaryConfigured: jest.fn(),
  getUploadSignature: jest.fn()
}));

const { isCloudinaryConfigured, getUploadSignature } = await import('../../utils/cloudinary.js');
const uploadRoutes = (await import('../../../../src/modules/upload/upload.routes.js')).default;
const { prisma } = await import('../../config/prisma.js');
const { signAccessToken } = await import('../../utils/jwt.js');

const app = express();
app.use(express.json());
app.use('/upload', uploadRoutes);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
});

jest.spyOn(prisma.user, 'findFirst');

const TEST_UUID = '123e4567-e89b-12d3-a456-426614174000';
const generateTestToken = () => signAccessToken({ userId: TEST_UUID, email: 'test@example.com' });

const mockAuth = () => {
  prisma.user.findFirst.mockResolvedValue({
    id: TEST_UUID, email: 'test@example.com', status: 'ACTIVE', roles: []
  });
};

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'test_secret';
  process.env.JWT_ACCESS_EXPIRES_IN = '1h';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Upload Controller', () => {
  describe('GET /upload/cloudinary-signature', () => {
    /* UTCIDs: UTCID02, UTCID01, UTCID05 */

    it('UTCID02 - should throw if cloudinary not configured', async () => {
      mockAuth();
      isCloudinaryConfigured.mockReturnValue(false);
      
      const res = await request(app)
        .get('/upload/cloudinary-signature')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(503);
      expect(res.body.message).toBe('Cloudinary is not configured');
    });

    it('UTCID01 - should return signature if configured', async () => {
      mockAuth();
      isCloudinaryConfigured.mockReturnValue(true);
      getUploadSignature.mockReturnValue({ signature: '123', timestamp: 123 });
      
      const res = await request(app)
        .get('/upload/cloudinary-signature')
        .set('Authorization', `Bearer ${generateTestToken()}`);
        
      expect(res.status).toBe(200);
      expect(res.body.data.signature).toBe('123');
    });

    it('UTCID05 - should return 500 when getUploadSignature throws', async () => {
      mockAuth();
      isCloudinaryConfigured.mockReturnValue(true);
      getUploadSignature.mockImplementation(() => { throw new Error('Signature error'); });

      const res = await request(app)
        .get('/upload/cloudinary-signature')
        .set('Authorization', `Bearer ${generateTestToken()}`);

      expect(res.status).toBe(500);
    });
  });
});
