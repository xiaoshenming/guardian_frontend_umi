import { request } from '@umijs/max';
import { ApiResponse } from './auth';

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  realName?: string;
  avatar?: string;
  role: 'admin' | 'user' | 'operator';
  status: 'active' | 'inactive' | 'banned';
  lastLoginTime?: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    location?: string;
    bio?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
}

// 系统设置类型
export interface SystemSettings {
  basic: {
    systemName: string;
    systemDescription: string;
    systemLogo?: string;
    timezone: string;
    language: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'auto';
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
      expirationDays: number;
    };
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableTwoFactor: boolean;
    ipWhitelist: string[];
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    smtpSecure: boolean;
    fromEmail: string;
    fromName: string;
  };
  sms: {
    provider: string;
    apiKey: string;
    apiSecret: string;
    signature: string;
  };
  database: {
    autoBackup: boolean;
    backupInterval: number;
    retentionDays: number;
    maintenanceWindow: string;
  };
  monitoring: {
    cpuThreshold: number;
    memoryThreshold: number;
    diskThreshold: number;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    logRetentionDays: number;
  };
}

// 系统日志类型
export interface SystemLog {
  id: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  module: string;
  message: string;
  details?: any;
  userId?: number;
  username?: string;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

// 事件日志类型
export interface EventLog {
  id: number;
  eventId: number;
  action: string;
  operator: string;
  operatorId: number;
  details: string;
  timestamp: string;
}

// 守护圈类型（简化版，用于下拉选择等）
export interface Circle {
  id: number;
  name: string;
  description?: string;
  type: 'family' | 'friends' | 'work' | 'community';
  privacy: 'public' | 'private';
  memberCount: number;
  maxMembers: number;
  createdAt: string;
}

// 位置类型
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
}

// 分析数据类型
export interface AnalyticsData {
  overview: {
    totalEvents: number;
    totalDevices: number;
    totalCircles: number;
    activeUsers: number;
    todayEvents: number;
    weeklyGrowth: number;
    monthlyGrowth: number;
    yearlyGrowth: number;
  };
  eventTrends: {
    date: string;
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  }[];
  deviceDistribution: {
    online: number;
    offline: number;
    error: number;
    maintenance: number;
  };
  userActivity: {
    date: string;
    activeUsers: number;
    newUsers: number;
    loginCount: number;
  }[];
  apiStats: {
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
    topEndpoints: {
      endpoint: string;
      calls: number;
      avgTime: number;
    }[];
  };
  performanceMetrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    uptime: number;
    responseTime: number;
  };
  securityThreats: {
    totalThreats: number;
    blockedAttacks: number;
    suspiciousIPs: number;
    threatTypes: {
      type: string;
      count: number;
      severity: string;
    }[];
  };
  topEventTypes: {
    type: string;
    count: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  activeDevices: {
    deviceId: number;
    deviceName: string;
    eventCount: number;
    uptime: number;
    lastActive: string;
  }[];
  systemHealth: {
    overall: 'healthy' | 'warning' | 'critical';
    services: {
      name: string;
      status: 'running' | 'stopped' | 'error';
      uptime: number;
      lastCheck: string;
    }[];
    alerts: {
      level: 'info' | 'warning' | 'error';
      message: string;
      timestamp: string;
    }[];
  };
}

// 守护圈相关接口
export interface GuardianCircle {
  id: number;
  name: string;
  description?: string;
  type: 'family' | 'community' | 'enterprise';
  status: 'active' | 'inactive';
  memberCount: number;
  deviceCount: number;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  settings: {
    autoAlert: boolean;
    alertThreshold: number;
    emergencyContacts: string[];
  };
}

// 守护圈成员接口
export interface CircleMember {
  id: number;
  circleId: number;
  userId: number;
  role: 'admin' | 'guardian' | 'member';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
    profile?: {
      nickname?: string;
      realName?: string;
    };
  };
}

// 设备接口
export interface Device {
  id: number;
  name: string;
  type: 'camera' | 'sensor' | 'alarm' | 'lock' | 'other';
  model: string;
  serialNumber: string;
  status: 'online' | 'offline' | 'error';
  circleId: number;
  location: {
    name: string;
    coordinates?: [number, number]; // [lat, lng]
  };
  settings: Record<string, any>;
  lastHeartbeat: string;
  createdAt: string;
  updatedAt: string;
}

// 事件接口
export interface SecurityEvent {
  id: number;
  type: 'intrusion' | 'fire' | 'emergency' | 'device_offline' | 'other';
  level: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'processing' | 'resolved' | 'ignored';
  title: string;
  description: string;
  deviceId?: number;
  circleId: number;
  location?: {
    name: string;
    coordinates?: [number, number];
  };
  evidence: {
    images?: string[];
    videos?: string[];
    audio?: string[];
    data?: Record<string, any>;
  };
  handledBy?: number;
  handledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 统计数据接口
export interface DashboardStats {
  totalCircles: number;
  totalDevices: number;
  totalEvents: number;
  pendingEvents: number;
  onlineDevices: number;
  offlineDevices: number;
  recentEvents: SecurityEvent[];
  deviceStatusChart: {
    online: number;
    offline: number;
    error: number;
  };
  eventTrendChart: {
    date: string;
    count: number;
    level: string;
  }[];
}

// 守护圈API
export const circleAPI = {
  // 获取守护圈列表
  getCircles: async (params?: {
    page?: number;
    pageSize?: number;
    type?: string;
    status?: string;
    keyword?: string;
  }): Promise<ApiResponse<{ list: GuardianCircle[]; total: number }>> => {
    return request('/api/circle/list', {
      method: 'GET',
      params,
    });
  },

  // 获取守护圈详情
  getCircle: async (id: number): Promise<ApiResponse<GuardianCircle>> => {
    return request(`/api/circle/${id}`, {
      method: 'GET',
    });
  },

  // 创建守护圈
  createCircle: async (data: Partial<GuardianCircle>): Promise<ApiResponse<GuardianCircle>> => {
    return request('/api/circle/create', {
      method: 'POST',
      data,
    });
  },

  // 更新守护圈
  updateCircle: async (
    id: number,
    data: Partial<CreateCircleParams>,
  ): Promise<ApiResponse<GuardianCircle>> => {
    return request(`/api/circle/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除守护圈
  deleteCircle: async (id: number): Promise<ApiResponse> => {
    return request(`/api/circle/${id}`, {
      method: 'DELETE',
    });
  },

  // 获取守护圈成员
  getCircleMembers: async (circleId: number): Promise<ApiResponse<CircleMember[]>> => {
    return request(`/api/circle/${circleId}/members`, {
      method: 'GET',
    });
  },

  // 邀请成员 - 通过邀请码加入
  joinCircle: async (data: { circleCode: string; memberAlias?: string }): Promise<ApiResponse> => {
    return request('/api/circle/join', {
      method: 'POST',
      data,
    });
  },

  // 移除成员
  removeMember: async (circleId: number, memberId: number): Promise<ApiResponse> => {
    return request(`/api/circle/${circleId}/members/${memberId}`, {
      method: 'DELETE',
    });
  },
};

// 设备API
export const deviceAPI = {
  // 获取设备列表
  getDevices: async (params?: {
    page?: number;
    pageSize?: number;
    circleId?: number;
    type?: string;
    status?: string;
    keyword?: string;
  }): Promise<ApiResponse<{ list: Device[]; total: number }>> => {
    return request('/api/devices', {
      method: 'GET',
      params,
    });
  },

  // 获取设备详情
  getDevice: async (id: number): Promise<ApiResponse<Device>> => {
    return request(`/api/devices/${id}`, {
      method: 'GET',
    });
  },

  // 添加设备
  createDevice: async (data: Partial<Device>): Promise<ApiResponse<Device>> => {
    return request('/api/devices', {
      method: 'POST',
      data,
    });
  },

  // 更新设备
  updateDevice: async (id: number, data: Partial<Device>): Promise<ApiResponse<Device>> => {
    return request(`/api/devices/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除设备
  deleteDevice: async (id: number): Promise<ApiResponse> => {
    return request(`/api/devices/${id}`, {
      method: 'DELETE',
    });
  },

  // 设备控制
  controlDevice: async (id: number, action: string, params?: any): Promise<ApiResponse> => {
    return request(`/api/devices/${id}/control`, {
      method: 'POST',
      data: { action, params },
    });
  },

  // 获取设备状态
  getDeviceStatus: async (id: number): Promise<ApiResponse<{ status: string; data: any }>> => {
    return request(`/api/devices/${id}/status`, {
      method: 'GET',
    });
  },
};

// 事件API
export const eventAPI = {
  // 获取事件列表
  getEvents: async (params?: {
    page?: number;
    pageSize?: number;
    circleId?: number;
    type?: string;
    level?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    keyword?: string;
  }): Promise<ApiResponse<{ list: SecurityEvent[]; total: number }>> => {
    return request('/api/events', {
      method: 'GET',
      params,
    });
  },

  // 获取事件详情
  getEvent: async (id: number): Promise<ApiResponse<SecurityEvent>> => {
    return request(`/api/events/${id}`, {
      method: 'GET',
    });
  },

  // 处理事件
  handleEvent: async (
    id: number,
    data: {
      status: string;
      note?: string;
    },
  ): Promise<ApiResponse> => {
    return request(`/api/events/${id}/handle`, {
      method: 'POST',
      data,
    });
  },

  // 获取未处理事件数量
  getPendingCount: async (): Promise<ApiResponse<{ count: number }>> => {
    return request('/api/events/pending-count', {
      method: 'GET',
    });
  },

  // 批量处理事件
  batchHandle: async (
    ids: number[],
    data: {
      status: string;
      note?: string;
    },
  ): Promise<ApiResponse> => {
    return request('/api/events/batch-handle', {
      method: 'POST',
      data: { ids, ...data },
    });
  },
};

// 仪表板API
export const dashboardAPI = {
  // 获取仪表板统计数据
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return request('/api/dashboard/stats', {
      method: 'GET',
    });
  },

  // 获取实时数据
  getRealTimeData: async (): Promise<
    ApiResponse<{
      onlineDevices: number;
      recentEvents: SecurityEvent[];
      systemStatus: string;
    }>
  > => {
    return request('/api/dashboard/realtime', {
      method: 'GET',
    });
  },
};

// 系统API
export const systemAPI = {
  // 获取系统配置
  getConfig: async (): Promise<ApiResponse<Record<string, any>>> => {
    return request('/api/system/config', {
      method: 'GET',
    });
  },

  // 更新系统配置
  updateConfig: async (data: Record<string, any>): Promise<ApiResponse> => {
    return request('/api/system/config', {
      method: 'PUT',
      data,
    });
  },

  // 获取系统日志
  getLogs: async (params?: {
    page?: number;
    pageSize?: number;
    level?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ list: any[]; total: number }>> => {
    return request('/api/system/logs', {
      method: 'GET',
      params,
    });
  },

  // 系统健康检查
  healthCheck: async (): Promise<
    ApiResponse<{
      status: string;
      services: Record<string, string>;
      uptime: number;
    }>
  > => {
    return request('/api/system/health', {
      method: 'GET',
    });
  },
};

// 文件上传API
export const uploadAPI = {
  // 上传文件
  uploadFile: async (
    file: File,
    type?: string,
  ): Promise<ApiResponse<{ url: string; filename: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) {
      formData.append('type', type);
    }

    return request('/api/upload', {
      method: 'POST',
      data: formData,
    });
  },

  // 上传头像
  uploadAvatar: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return request('/api/upload/avatar', {
      method: 'POST',
      data: formData,
    });
  },
};

// 数据分析API
export const analyticsAPI = {
  // 获取完整分析数据
  getAnalyticsData: async (params?: {
    startTime?: string;
    endTime?: string;
  }): Promise<ApiResponse<AnalyticsData>> => {
    return request('/api/analytics/data', {
      method: 'GET',
      params,
    });
  },

  // 获取概览统计
  getOverviewStats: async (): Promise<
    ApiResponse<{
      totalEvents: number;
      totalDevices: number;
      totalCircles: number;
      activeUsers: number;
      todayEvents: number;
      weeklyGrowth: number;
      monthlyGrowth: number;
      yearlyGrowth: number;
    }>
  > => {
    return request('/api/analytics/overview', {
      method: 'GET',
    });
  },

  // 获取事件趋势数据
  getEventTrends: async (params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<
    ApiResponse<
      {
        date: string;
        total: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
      }[]
    >
  > => {
    return request('/api/analytics/event-trends', {
      method: 'GET',
      params,
    });
  },

  // 获取设备状态分布
  getDeviceDistribution: async (): Promise<
    ApiResponse<{
      online: number;
      offline: number;
      error: number;
      maintenance: number;
    }>
  > => {
    return request('/api/analytics/device-distribution', {
      method: 'GET',
    });
  },

  // 获取用户活跃度
  getUserActivity: async (params?: {
    period?: 'day' | 'week' | 'month';
  }): Promise<
    ApiResponse<
      {
        date: string;
        activeUsers: number;
        newUsers: number;
        loginCount: number;
      }[]
    >
  > => {
    return request('/api/analytics/user-activity', {
      method: 'GET',
      params,
    });
  },

  // 获取API调用统计
  getApiStats: async (): Promise<
    ApiResponse<{
      totalCalls: number;
      successRate: number;
      avgResponseTime: number;
      topEndpoints: {
        endpoint: string;
        calls: number;
        avgTime: number;
      }[];
    }>
  > => {
    return request('/api/analytics/api-stats', {
      method: 'GET',
    });
  },

  // 获取系统性能指标
  getPerformanceMetrics: async (): Promise<
    ApiResponse<{
      cpu: number;
      memory: number;
      disk: number;
      network: number;
      uptime: number;
      responseTime: number;
    }>
  > => {
    return request('/api/analytics/performance', {
      method: 'GET',
    });
  },

  // 获取安全威胁分析
  getSecurityThreats: async (): Promise<
    ApiResponse<{
      totalThreats: number;
      blockedAttacks: number;
      suspiciousIPs: number;
      threatTypes: {
        type: string;
        count: number;
        severity: string;
      }[];
    }>
  > => {
    return request('/api/analytics/security-threats', {
      method: 'GET',
    });
  },

  // 获取热门事件类型
  getTopEventTypes: async (params?: {
    limit?: number;
    period?: 'day' | 'week' | 'month';
  }): Promise<
    ApiResponse<
      {
        type: string;
        count: number;
        percentage: number;
        trend: 'up' | 'down' | 'stable';
      }[]
    >
  > => {
    return request('/api/analytics/top-event-types', {
      method: 'GET',
      params,
    });
  },

  // 获取活跃设备排行
  getActiveDevices: async (params?: {
    limit?: number;
    period?: 'day' | 'week' | 'month';
  }): Promise<
    ApiResponse<
      {
        deviceId: number;
        deviceName: string;
        eventCount: number;
        uptime: number;
        lastActive: string;
      }[]
    >
  > => {
    return request('/api/analytics/active-devices', {
      method: 'GET',
      params,
    });
  },

  // 获取系统健康状态
  getSystemHealth: async (): Promise<
    ApiResponse<{
      overall: 'healthy' | 'warning' | 'critical';
      services: {
        name: string;
        status: 'running' | 'stopped' | 'error';
        uptime: number;
        lastCheck: string;
      }[];
      alerts: {
        level: 'info' | 'warning' | 'error';
        message: string;
        timestamp: string;
      }[];
    }>
  > => {
    return request('/api/analytics/system-health', {
      method: 'GET',
    });
  },

  // 导出报告
  exportReport: async (params: {
    type: 'overview' | 'events' | 'devices' | 'security';
    format: 'pdf' | 'excel' | 'csv';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ downloadUrl: string }>> => {
    return request('/api/analytics/export', {
      method: 'POST',
      data: params,
    });
  },
};

// 用户管理API
export const userAPI = {
  // 获取用户列表
  getUsers: async (params?: {
    page?: number;
    pageSize?: number;
    role?: string;
    status?: string;
    keyword?: string;
  }): Promise<ApiResponse<{ list: any[]; total: number }>> => {
    return request('/api/users', {
      method: 'GET',
      params,
    });
  },

  // 获取用户详情
  getUser: async (id: number): Promise<ApiResponse<any>> => {
    return request(`/api/users/${id}`, {
      method: 'GET',
    });
  },

  // 创建用户
  createUser: async (data: any): Promise<ApiResponse<any>> => {
    return request('/api/users', {
      method: 'POST',
      data,
    });
  },

  // 更新用户
  updateUser: async (id: number, data: any): Promise<ApiResponse<any>> => {
    return request(`/api/users/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除用户
  deleteUser: async (id: number): Promise<ApiResponse> => {
    return request(`/api/users/${id}`, {
      method: 'DELETE',
    });
  },

  // 重置密码
  resetPassword: async (id: number): Promise<ApiResponse<{ tempPassword: string }>> => {
    return request(`/api/users/${id}/reset-password`, {
      method: 'POST',
    });
  },

  // 启用/禁用用户
  toggleUserStatus: async (id: number, status: 'active' | 'inactive'): Promise<ApiResponse> => {
    return request(`/api/users/${id}/status`, {
      method: 'PUT',
      data: { status },
    });
  },
};

// 导出所有API
export default {
  circle: circleAPI,
  device: deviceAPI,
  event: eventAPI,
  dashboard: dashboardAPI,
  system: systemAPI,
  upload: uploadAPI,
  analytics: analyticsAPI,
  user: userAPI,
};
