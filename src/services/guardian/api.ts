import { request } from '@umijs/max';

// 基础响应类型
interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
  error: any;
}

// 用户相关类型
interface User {
  id: number;
  uid?: number;
  username: string;
  email: string;
  phone_number?: string;
  role: number; // 0-无权, 1-普通用户, 2-管理员, 3-超管
  avatar_url?: string;
  gender?: string;
  status?: string;
  last_login_time?: string;
  create_time: string;
  update_time?: string;
}

interface LoginParams {
  name: string; // 用户名、邮箱或手机号
  password: string;
  deviceType?: string;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  code: string; // 验证码
}

// 守护圈相关类型
interface Circle {
  id: number;
  circle_name: string;
  description?: string;
  circle_code: string;
  creator_uid: number;
  creator_name?: string;
  member_role?: number; // 0:圈主/管理员, 1:普通成员/监护人, 2:被关怀者
  member_alias?: string;
  alert_level?: number; // 1:所有, 2:高危, 0:不接收
  create_time: string;
  update_time?: string;
}

interface CreateCircleParams {
  circleName: string;
  description?: string;
}

interface CircleMember {
  id: number;
  circle_id: number;
  uid: number;
  member_role: number;
  member_alias?: string;
  alert_level: number;
  username?: string;
  email?: string;
  avatar_url?: string;
  create_time: string;
}

// 设备相关类型
interface Device {
  id: number;
  device_sn: string;
  device_name: string;
  device_model: string;
  circle_id: number;
  bound_by_uid: number;
  device_status: number; // 0:未激活, 1:在线, 2:离线, 3:故障
  firmware_version?: string;
  config?: any;
  last_heartbeat?: string;
  create_time: string;
  update_time?: string;
  circle_name?: string;
}

interface BindDeviceParams {
  circleId: number;
  deviceSn: string;
  deviceName?: string;
}

// 事件相关类型
interface Event {
  id: number;
  device_id: number;
  circle_id: number;
  event_type: string; // fall_detection, gesture_wave等
  event_data?: any;
  event_time: string;
  create_time: string;
  device_name?: string;
  circle_name?: string;
}

// 告警相关类型
interface Alert {
  id: number;
  event_id: number;
  circle_id: number;
  alert_level: number; // 1:紧急, 2:重要, 3:普通
  alert_content: string;
  status: number; // 0:待处理, 1:已通知, 2:已确认, 3:已忽略
  acknowledged_by_uid?: number;
  acknowledged_time?: string;
  create_time: string;
  device_name?: string;
  circle_name?: string;
}

// 统计数据类型
interface DashboardStats {
  totalCircles: number;
  totalDevices: number;
  onlineDevices: number;
  urgentAlerts: number;
  todayEvents: number;
}

interface DeviceStats {
  online: number;
  offline: number;
  error: number;
  unactivated: number;
}

interface EventTrends {
  dates: string[];
  counts: number[];
  types: Record<string, number[]>;
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
    return request<BaseResponse<{ userId: number; loginId: number }>>('/api/auth/register', {
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
    return request<BaseResponse<string[]>>('/api/auth/codes', {
      method: 'GET',
    });
  },

  // 退出登录
  logout: () => {
    return request<BaseResponse>('/api/auth/logout', {
      method: 'POST',
    });
  },

  // 发送验证码
  sendVerificationCode: (email: string) => {
    return request<BaseResponse>('/api/email/send', {
      method: 'POST',
      data: { email, type: 1 },
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
    return request<BaseResponse<{ circleId: number; circleName: string; circleCode: string; description?: string }>>('/api/circle/create', {
      method: 'POST',
      data: params,
    });
  },

  // 通过邀请码加入守护圈
  joinCircle: (circleCode: string, memberAlias?: string) => {
    return request<BaseResponse<{ circleId: number; circleName: string }>>('/api/circle/join', {
      method: 'POST',
      data: { circleCode, memberAlias },
    });
  },

  // 获取守护圈详情
  getCircleDetail: (circleId: number) => {
    return request<BaseResponse<Circle>>(`/api/circle/${circleId}`, {
      method: 'GET',
    });
  },

  // 获取守护圈成员列表
  getCircleMembers: (circleId: number) => {
    return request<BaseResponse<CircleMember[]>>(`/api/circle/${circleId}/members`, {
      method: 'GET',
    });
  },

  // 更新守护圈信息
  updateCircle: (circleId: number, params: { circleName?: string; description?: string }) => {
    return request<BaseResponse<Circle>>(`/api/circle/${circleId}`, {
      method: 'PUT',
      data: params,
    });
  },

  // 删除守护圈
  deleteCircle: (circleId: number) => {
    return request<BaseResponse>(`/api/circle/${circleId}`, {
      method: 'DELETE',
    });
  },

  // 移除成员
  removeMember: (circleId: number, memberId: number) => {
    return request<BaseResponse>(`/api/circle/${circleId}/members/${memberId}`, {
      method: 'DELETE',
    });
  },

  // 更新成员角色
  updateMemberRole: (circleId: number, memberId: number, memberRole: number, alertLevel?: number) => {
    return request<BaseResponse>(`/api/circle/${circleId}/members/${memberId}`, {
      method: 'PUT',
      data: { memberRole, alertLevel },
    });
  },
};

// 设备相关API
export const deviceAPI = {
  // 绑定设备
  bindDevice: (params: BindDeviceParams) => {
    return request<BaseResponse<{ deviceId: number; deviceName: string; deviceType: string }>>('/api/device/bind', {
      method: 'POST',
      data: params,
    });
  },

  // 获取守护圈设备列表
  getDevices: (circleId: number) => {
    return request<BaseResponse<Device[]>>(`/api/device/list/${circleId}`, {
      method: 'GET',
    });
  },

  // 获取设备详情
  getDeviceDetail: (deviceId: number) => {
    return request<BaseResponse<Device>>(`/api/device/${deviceId}`, {
      method: 'GET',
    });
  },

  // 更新设备信息
  updateDevice: (deviceId: number, params: { deviceName?: string; deviceAlias?: string; location?: string; alertLevel?: number }) => {
    return request<BaseResponse<Device>>(`/api/device/${deviceId}`, {
      method: 'PUT',
      data: params,
    });
  },

  // 解绑设备
  unbindDevice: (deviceId: number) => {
    return request<BaseResponse>(`/api/device/${deviceId}`, {
      method: 'DELETE',
    });
  },

  // 获取设备实时数据
  getDeviceRealtime: (deviceId: number) => {
    return request<BaseResponse<any>>(`/api/device/${deviceId}/realtime`, {
      method: 'GET',
    });
  },

  // 获取设备历史数据
  getDeviceHistory: (deviceId: number, startTime?: string, endTime?: string) => {
    return request<BaseResponse<any[]>>(`/api/device/${deviceId}/history`, {
      method: 'GET',
      params: { startTime, endTime },
    });
  },
};

// 事件相关API
export const eventAPI = {
  // 事件相关API已迁移到 services/api.ts 中的 eventAPI
};

// 用户相关API
export const userAPI = {
  // 更新用户信息
  updateProfile: (params: { username?: string; email?: string; phone?: string; realName?: string; avatar?: string }) => {
    return request<BaseResponse<User>>('/api/user/profile', {
      method: 'PUT',
      data: params,
    });
  },

  // 修改密码
  changePassword: (params: { oldPassword: string; newPassword: string; verificationCode?: string }) => {
    return request<BaseResponse>('/api/user/password', {
      method: 'PUT',
      data: params,
    });
  },

  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return request<BaseResponse<{ avatarUrl: string }>>('/api/user/avatar', {
      method: 'POST',
      data: formData,
    });
  },

  // 获取用户详情
  getUserDetail: (userId: number) => {
    return request<BaseResponse<User>>(`/api/user/${userId}`, {
      method: 'GET',
    });
  },

  // 重置密码
  resetPassword: (params: { email: string; verificationCode: string; newPassword: string }) => {
    return request<BaseResponse>('/api/user/reset-password', {
      method: 'POST',
      data: params,
    });
  },
};

// 仪表板相关API
export const dashboardAPI = {
  // 获取仪表板统计数据
  getStats: (circleId?: number) => {
    return request<BaseResponse<DashboardStats>>('/api/dashboard/stats', {
      method: 'GET',
      params: { circleId },
    });
  },

  // 获取实时数据
  getRealtime: (circleId?: number) => {
    return request<BaseResponse<any>>('/api/dashboard/realtime', {
      method: 'GET',
      params: { circleId },
    });
  },
};

// 分析统计相关API
export const analyticsAPI = {
  // 获取设备状态统计
  getDeviceStats: (circleId?: number, timeRange?: string) => {
    return request<BaseResponse<DeviceStats>>('/api/analytics/device-stats', {
      method: 'GET',
      params: { circleId, timeRange },
    });
  },

  // 获取事件趋势数据
  getEventTrends: (params?: { startDate?: string; endDate?: string; circleId?: number; granularity?: string }) => {
    return request<BaseResponse<EventTrends>>('/api/analytics/event-trends', {
      method: 'GET',
      params,
    });
  },

  // 获取用户活跃度统计
  getUserActivity: (circleId?: number, timeRange?: string) => {
    return request<BaseResponse<any>>('/api/analytics/user-activity', {
      method: 'GET',
      params: { circleId, timeRange },
    });
  },

  // 获取设备健康度报告
  getDeviceHealth: (circleId?: number) => {
    return request<BaseResponse<any>>('/api/analytics/device-health', {
      method: 'GET',
      params: { circleId },
    });
  },
};

// 管理员API
export const adminAPI = {
  // 获取所有用户
  getAllUsers: (params?: { page?: number; limit?: number; keyword?: string; role?: number; status?: number }) => {
    return request<BaseResponse<{ users: User[]; total: number; page: number; limit: number }>>('/api/admin/users', {
      method: 'GET',
      params,
    });
  },

  // 更新用户角色
  updateUserRole: (userId: number, role: number) => {
    return request<BaseResponse>(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      data: { role },
    });
  },

  // 禁用/启用用户
  toggleUserStatus: (userId: number, status: number) => {
    return request<BaseResponse>(`/api/admin/users/${userId}/status`, {
      method: 'PUT',
      data: { status },
    });
  },

  // 获取系统日志
  getSystemLogs: (params?: { page?: number; limit?: number; level?: string; startTime?: string; endTime?: string }) => {
    return request<BaseResponse<{ logs: any[]; total: number; page: number; limit: number }>>('/api/admin/logs', {
      method: 'GET',
      params,
    });
  },

  // 获取系统统计
  getSystemStats: () => {
    return request<BaseResponse<any>>('/api/admin/stats', {
      method: 'GET',
    });
  },

  // 删除用户
  deleteUser: (userId: number) => {
    return request<BaseResponse>(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // 重置用户密码
  resetUserPassword: (userId: number, newPassword: string) => {
    return request<BaseResponse>(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST',
      data: { newPassword },
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
  dashboard: dashboardAPI,
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
