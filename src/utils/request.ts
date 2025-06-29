import { message } from 'antd';
import { history } from '@umijs/max';

// API响应接口
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  error: string | null;
}

// 错误类型
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// 统一的错误处理
export const handleApiError = (error: any, showMessage = true): ApiError => {
  let apiError: ApiError;

  if (error?.response) {
    // HTTP错误响应
    const { status, data } = error.response;
    apiError = {
      code: status,
      message: data?.message || getHttpErrorMessage(status),
      details: data,
    };
  } else if (error?.code && error?.message) {
    // API业务错误
    apiError = {
      code: error.code,
      message: error.message,
      details: error,
    };
  } else {
    // 网络错误或其他错误
    apiError = {
      code: 0,
      message: error?.message || '网络连接失败，请检查网络设置',
      details: error,
    };
  }

  // 特殊状态码处理
  if (apiError.code === 401) {
    // 未授权，跳转到登录页
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    history.push('/user/login');
    if (showMessage) {
      message.error('登录已过期，请重新登录');
    }
    return apiError;
  }

  if (apiError.code === 403) {
    if (showMessage) {
      message.error('权限不足，无法执行此操作');
    }
    return apiError;
  }

  if (apiError.code === 429) {
    if (showMessage) {
      message.warning('操作过于频繁，请稍后再试');
    }
    return apiError;
  }

  // 显示错误消息
  if (showMessage && apiError.message) {
    message.error(apiError.message);
  }

  return apiError;
};

// HTTP状态码对应的错误消息
const getHttpErrorMessage = (status: number): string => {
  const messages: Record<number, string> = {
    400: '请求参数错误',
    401: '未授权访问',
    403: '权限不足',
    404: '请求的资源不存在',
    405: '请求方法不允许',
    408: '请求超时',
    409: '请求冲突',
    422: '请求参数验证失败',
    429: '请求过于频繁',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时',
  };

  return messages[status] || `请求失败 (${status})`;
};

// 统一的成功处理
export const handleApiSuccess = <T>(
  response: ApiResponse<T>,
  successMessage?: string,
  showMessage = false
): T => {
  if (response.code === 200) {
    if (showMessage && successMessage) {
      message.success(successMessage);
    }
    return response.data;
  } else {
    // 业务错误
    throw {
      code: response.code,
      message: response.message || '操作失败',
      details: response,
    };
  }
};

// 请求包装器
export const requestWrapper = async <T>(
  requestFn: () => Promise<ApiResponse<T>>,
  options: {
    successMessage?: string;
    showSuccessMessage?: boolean;
    showErrorMessage?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: ApiError) => void;
  } = {}
): Promise<T | null> => {
  const {
    successMessage,
    showSuccessMessage = false,
    showErrorMessage = true,
    onSuccess,
    onError,
  } = options;

  try {
    const response = await requestFn();
    const data = handleApiSuccess(response, successMessage, showSuccessMessage);
    onSuccess?.(data);
    return data;
  } catch (error) {
    const apiError = handleApiError(error, showErrorMessage);
    onError?.(apiError);
    return null;
  }
};

// 批量操作包装器
export const batchRequestWrapper = async <T>(
  requests: Array<() => Promise<ApiResponse<T>>>,
  options: {
    successMessage?: string;
    showProgress?: boolean;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<{ success: T[]; errors: ApiError[] }> => {
  const { successMessage, onProgress } = options;
  const success: T[] = [];
  const errors: ApiError[] = [];

  for (let i = 0; i < requests.length; i++) {
    try {
      const response = await requests[i]();
      const data = handleApiSuccess(response);
      success.push(data);
    } catch (error) {
      const apiError = handleApiError(error, false);
      errors.push(apiError);
    }

    onProgress?.(i + 1, requests.length);
  }

  if (successMessage && success.length > 0) {
    message.success(`${successMessage}，成功处理 ${success.length} 项`);
  }

  if (errors.length > 0) {
    message.error(`操作完成，但有 ${errors.length} 项失败`);
  }

  return { success, errors };
};

// 重试包装器
export const retryRequestWrapper = async <T>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await requestFn();
      return handleApiSuccess(response);
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries) {
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};