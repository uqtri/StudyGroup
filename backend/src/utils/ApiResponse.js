export class ApiResponse {
  static success(res, { message = 'Operation successful', data = null, statusCode = 200 }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, { message = 'Something went wrong', errors = [], statusCode = 500 }) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
