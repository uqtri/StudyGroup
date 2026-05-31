import { authService } from './auth.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { validate } from '../../utils/validationHandler.js';

export const authController = {
  register: async (req, res) => {
    validate(req);
    const result = await authService.register(req.body);
    ApiResponse.success(res, {
      message: 'Registration successful',
      data: result,
      statusCode: 201,
    });
  },

  login: async (req, res) => {
    validate(req);
    const result = await authService.login(req.body);
    ApiResponse.success(res, { message: 'Login successful', data: result });
  },

  me: async (req, res) => {
    const user = await authService.getProfile(req.user.id);
    ApiResponse.success(res, { message: 'Profile retrieved', data: user });
  },

  refresh: async (req, res) => {
    validate(req);
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    const result = await authService.refresh(token);
    ApiResponse.success(res, { message: 'Token refreshed', data: result });
  },

  logout: async (req, res) => {
    const token = req.body.refreshToken || req.cookies?.refreshToken;
    await authService.logout(token, req.user?.id);
    ApiResponse.success(res, { message: 'Logged out successfully', data: null });
  },
};
