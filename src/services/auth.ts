import { request } from '@umijs/max';

// 登录参数接口
export interface LoginParams {
  identifier: string; // 用户名/邮箱/手机号
  password: string;
  remember?: boolean;
  type?: string;
}

// 注册参数接口
export interface RegisterParams {
  username: string;
  email: string;
  phone: string;
  password: string;
  captcha: string;
}

// 重置密码参数接口
export interface ResetPasswordParams {
  token: string;
  code: string;
  newPassword: string;
}

// 发送重置码参数接口
export interface SendResetCodeParams {
  type: 'email' | 'phone';
  contact: string;
}

// 用户信息接口
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  permissions: string[];
  profile?: {
    nickname?: string;
    realName?: string;
    department?: string;
    position?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 登录响应接口
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: UserInfo;
  expiresIn: number;
}

// 认证API服务
export const authAPI = {
  // 用户登录
  login: async (params: LoginParams): Promise<ApiResponse<LoginResponse>> => {
    return request('/api/auth/login', {
      method: 'POST',
      data: params,
    });
  },

  // 用户注册
  register: async (params: RegisterParams): Promise<ApiResponse<UserInfo>> => {
    return request('/api/auth/register', {
      method: 'POST',
      data: params,
    });
  },

  // 用户登出
  logout: async (): Promise<ApiResponse> => {
    return request('/api/auth/logout', {
      method: 'POST',
    });
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<ApiResponse<UserInfo>> => {
    return request('/api/auth/me', {
      method: 'GET',
    });
  },

  // 刷新Token
  refreshToken: async (
    refreshToken: string,
  ): Promise<ApiResponse<{ token: string; expiresIn: number }>> => {
    return request('/api/auth/refresh', {
      method: 'POST',
      data: { refreshToken },
    });
  },

  // 发送重置密码验证码
  sendResetCode: async (params: SendResetCodeParams): Promise<ApiResponse<{ token: string }>> => {
    return request('/api/auth/send-reset-code', {
      method: 'POST',
      data: params,
    });
  },

  // 重置密码
  resetPassword: async (params: ResetPasswordParams): Promise<ApiResponse> => {
    return request('/api/auth/reset-password', {
      method: 'POST',
      data: params,
    });
  },

  // 修改密码
  changePassword: async (params: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    return request('/api/auth/change-password', {
      method: 'POST',
      data: params,
    });
  },

  // 验证Token有效性
  validateToken: async (): Promise<ApiResponse<{ valid: boolean }>> => {
    return request('/api/auth/validate', {
      method: 'GET',
    });
  },

  // 发送邮箱验证码
  sendEmailCode: async (email: string): Promise<ApiResponse> => {
    return request('/api/auth/send-email-code', {
      method: 'POST',
      data: { email },
    });
  },

  // 发送手机验证码
  sendSmsCode: async (phone: string): Promise<ApiResponse> => {
    return request('/api/auth/send-sms-code', {
      method: 'POST',
      data: { phone },
    });
  },

  // 验证邮箱
  verifyEmail: async (params: { email: string; code: string }): Promise<ApiResponse> => {
    return request('/api/auth/verify-email', {
      method: 'POST',
      data: params,
    });
  },

  // 验证手机号
  verifyPhone: async (params: { phone: string; code: string }): Promise<ApiResponse> => {
    return request('/api/auth/verify-phone', {
      method: 'POST',
      data: params,
    });
  },
};

// 导出类型
export type {
  LoginParams,
  RegisterParams,
  ResetPasswordParams,
  SendResetCodeParams,
  UserInfo,
  ApiResponse,
  LoginResponse,
};
