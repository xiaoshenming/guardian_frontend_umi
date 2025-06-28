import { request } from '@umijs/max';

// 基础响应类型
interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: number;
}

// 用户相关类型
interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user' | 'guardian';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginParams {
  identifier: string; // 用户名、邮箱或手机号
  password: string;
  remember?: boolean;
}

interface RegisterParams {
  username: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

// 守护圈相关类型
interface Circle {
  id: string;
  name: string;
  description?: string;
  inviteCode: string;
  creatorId: string;
  memberCount: number;
  deviceCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateCircleParams {
  name: string;
  description?: string;
}

interface CircleMember {
  id: string;
  userId: string;
  circleId: string;
  role: 'admin' | 'member' | 'guardian';
  user: User;
  joinedAt: string;
}

// 设备相关类型
interface Device {
  id: string;
  name: string;
  type: 'smartphone' | 'smartwatch' | 'tracker';
  model?: string;
  circleId: string;
  userId: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  battery?: number;
  createdAt: string;
  updatedAt: string;
}

interface BindDeviceParams {
  circleId: string;
  deviceCode: string;
  deviceName?: string;
}

// 事件相关类型
interface Event {
  id: string;
  type: 'location' | 'battery' | 'emergency' | 'offline';
  level: 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  deviceId: string;
  circleId: string;
  userId: string;
  data?: any;
  handled: boolean;
  createdAt: string;
  updatedAt: string;
}

// 认证相关API
export const authAPI = {
  // 用户登录
  login: (params: LoginParams) => {
    return request<BaseResponse<{ user: User; token: string }>>('/api/auth/login', {
      method: 'POST',
      data: params,
    });
  },

  // 用户注册
  register: (params: RegisterParams) => {
    return request<BaseResponse<{ user: User; token: string }>>('/api/auth/register', {
      method: 'POST',
      data: params,
    });
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return request<BaseResponse<User>>('/api/user/info', {
      method: 'GET',
    });
  },

  // 获取权限码
  getPermissions: () => {
    return request<BaseResponse<{ permissions: string[] }>>('/api/auth/permissions', {
      method: 'GET',
    });
  },

  // 退出登录
  logout: () => {
    return request<BaseResponse>('/api/auth/logout', {
      method: 'POST',
    });
  },
};

// 守护圈相关API
export const circleAPI = {
  // 获取用户守护圈列表
  getCircles: () => {
    return request<BaseResponse<Circle[]>>('/api/circle/list', {
      method: 'GET',
    });
  },

  // 创建守护圈
  createCircle: (params: CreateCircleParams) => {
    return request<BaseResponse<Circle>>('/api/circle/create', {
      method: 'POST',
      data: params,
    });
  },

  // 通过邀请码加入守护圈
  joinCircle: (inviteCode: string) => {
    return request<BaseResponse<Circle>>('/api/circle/join', {
      method: 'POST',
      data: { inviteCode },
    });
  },

  // 获取守护圈详情
  getCircleDetail: (circleId: string) => {
    return request<BaseResponse<Circle>>(`/api/circle/${circleId}`, {
      method: 'GET',
    });
  },

  // 获取守护圈成员列表
  getCircleMembers: (circleId: string) => {
    return request<BaseResponse<CircleMember[]>>(`/api/circle/${circleId}/members`, {
      method: 'GET',
    });
  },

  // 更新守护圈信息
  updateCircle: (circleId: string, params: Partial<CreateCircleParams>) => {
    return request<BaseResponse<Circle>>(`/api/circle/${circleId}`, {
      method: 'PUT',
      data: params,
    });
  },

  // 删除守护圈
  deleteCircle: (circleId: string) => {
    return request<BaseResponse>(`/api/circle/${circleId}`, {
      method: 'DELETE',
    });
  },
};

// 设备相关API
export const deviceAPI = {
  // 绑定设备到守护圈
  bindDevice: (params: BindDeviceParams) => {
    return request<BaseResponse<Device>>('/api/device/bind', {
      method: 'POST',
      data: params,
    });
  },

  // 获取守护圈设备列表
  getCircleDevices: (circleId: string) => {
    return request<BaseResponse<Device[]>>(`/api/device/circle/${circleId}`, {
      method: 'GET',
    });
  },

  // 获取设备详情
  getDeviceDetail: (deviceId: string) => {
    return request<BaseResponse<Device>>(`/api/device/${deviceId}`, {
      method: 'GET',
    });
  },

  // 更新设备信息
  updateDevice: (deviceId: string, params: Partial<Device>) => {
    return request<BaseResponse<Device>>(`/api/device/${deviceId}`, {
      method: 'PUT',
      data: params,
    });
  },

  // 解绑设备
  unbindDevice: (deviceId: string) => {
    return request<BaseResponse>(`/api/device/${deviceId}`, {
      method: 'DELETE',
    });
  },
};

// 事件相关API
export const eventAPI = {
  // 获取事件列表
  getEvents: (params?: {
    circleId?: string;
    deviceId?: string;
    type?: string;
    level?: string;
    page?: number;
    pageSize?: number;
  }) => {
    return request<BaseResponse<{ events: Event[]; total: number }>>('/api/event/list', {
      method: 'GET',
      params,
    });
  },

  // 获取事件详情
  getEventDetail: (eventId: string) => {
    return request<BaseResponse<Event>>(`/api/event/${eventId}`, {
      method: 'GET',
    });
  },

  // 标记事件为已处理
  handleEvent: (eventId: string) => {
    return request<BaseResponse>(`/api/event/${eventId}/handle`, {
      method: 'POST',
    });
  },

  // 获取未处理告警数量
  getUnhandledCount: () => {
    return request<BaseResponse<{ count: number }>>('/api/event/unhandled-count', {
      method: 'GET',
    });
  },
};

// 用户相关API
export const userAPI = {
  // 更新用户信息
  updateProfile: (params: Partial<User>) => {
    return request<BaseResponse<User>>('/api/user/profile', {
      method: 'PUT',
      data: params,
    });
  },

  // 修改密码
  changePassword: (params: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return request<BaseResponse>('/api/user/change-password', {
      method: 'POST',
      data: params,
    });
  },

  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request<BaseResponse<{ url: string }>>('/api/user/avatar', {
      method: 'POST',
      data: formData,
    });
  },
};

// 统计分析API
export const analyticsAPI = {
  // 获取仪表板统计数据
  getDashboardStats: () => {
    return request<
      BaseResponse<{
        totalCircles: number;
        totalDevices: number;
        onlineDevices: number;
        todayEvents: number;
        recentEvents: Event[];
      }>
    >('/api/analytics/dashboard', {
      method: 'GET',
    });
  },

  // 获取设备状态统计
  getDeviceStats: (circleId?: string) => {
    return request<
      BaseResponse<{
        online: number;
        offline: number;
        warning: number;
        batteryLow: number;
      }>
    >('/api/analytics/device-stats', {
      method: 'GET',
      params: { circleId },
    });
  },

  // 获取事件趋势数据
  getEventTrends: (params: { circleId?: string; days?: number }) => {
    return request<
      BaseResponse<{
        dates: string[];
        counts: number[];
        types: Record<string, number[]>;
      }>
    >('/api/analytics/event-trends', {
      method: 'GET',
      params,
    });
  },
};

// 管理员API
export const adminAPI = {
  // 获取所有用户
  getUsers: (params?: { page?: number; pageSize?: number; keyword?: string }) => {
    return request<BaseResponse<{ users: User[]; total: number }>>('/api/admin/users', {
      method: 'GET',
      params,
    });
  },

  // 更新用户角色
  updateUserRole: (userId: string, role: string) => {
    return request<BaseResponse>(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      data: { role },
    });
  },

  // 禁用/启用用户
  toggleUserStatus: (userId: string, enabled: boolean) => {
    return request<BaseResponse>(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      data: { enabled },
    });
  },

  // 获取系统日志
  getSystemLogs: (params?: {
    page?: number;
    pageSize?: number;
    level?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return request<
      BaseResponse<{
        logs: Array<{
          id: string;
          level: string;
          message: string;
          timestamp: string;
          userId?: string;
          ip?: string;
        }>;
        total: number;
      }>
    >('/api/admin/logs', {
      method: 'GET',
      params,
    });
  },
};

// 导出所有API
export default {
  auth: authAPI,
  circle: circleAPI,
  device: deviceAPI,
  event: eventAPI,
  user: userAPI,
  analytics: analyticsAPI,
  admin: adminAPI,
};

// 导出类型
export type {
  BaseResponse,
  User,
  LoginParams,
  RegisterParams,
  Circle,
  CreateCircleParams,
  CircleMember,
  Device,
  BindDeviceParams,
  Event,
};
