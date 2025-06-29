// 通用表单验证规则

// 邮箱验证
export const emailRules = [
  { required: true, message: '请输入邮箱地址' },
  { type: 'email' as const, message: '请输入有效的邮箱地址' },
];

// 密码验证
export const passwordRules = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码至少6位字符' },
  { max: 20, message: '密码最多20位字符' },
  {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    message: '密码必须包含大小写字母和数字',
  },
];

// 手机号验证
export const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
];

// 用户名验证
export const usernameRules = [
  { required: true, message: '请输入用户名' },
  { min: 2, message: '用户名至少2位字符' },
  { max: 20, message: '用户名最多20位字符' },
  {
    pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
    message: '用户名只能包含字母、数字、下划线和中文',
  },
];

// 守护圈名称验证
export const circleNameRules = [
  { required: true, message: '请输入守护圈名称' },
  { min: 2, message: '守护圈名称至少2位字符' },
  { max: 50, message: '守护圈名称最多50位字符' },
];

// 设备名称验证
export const deviceNameRules = [
  { required: true, message: '请输入设备名称' },
  { min: 2, message: '设备名称至少2位字符' },
  { max: 30, message: '设备名称最多30位字符' },
];

// 设备序列号验证
export const deviceSnRules = [
  { required: true, message: '请输入设备序列号' },
  { min: 8, message: '设备序列号至少8位字符' },
  { max: 32, message: '设备序列号最多32位字符' },
  {
    pattern: /^[A-Z0-9]+$/,
    message: '设备序列号只能包含大写字母和数字',
  },
];

// 描述验证
export const descriptionRules = [
  { max: 500, message: '描述最多500位字符' },
];

// 必填项验证
export const requiredRule = { required: true, message: '此项为必填项' };

// 自定义验证函数
export const createCustomValidator = (validator: (value: any) => Promise<void> | void) => {
  return {
    validator: async (_: any, value: any) => {
      try {
        await validator(value);
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : '验证失败');
      }
    },
  };
};

// 确认密码验证
export const createConfirmPasswordRule = (passwordField: string) => {
  return {
    validator: async (_: any, value: any) => {
      const form = _.field?.form;
      if (!form) return;
      
      const password = form.getFieldValue(passwordField);
      if (value && password !== value) {
        throw new Error('两次输入的密码不一致');
      }
    },
  };
};

// 数字范围验证
export const createNumberRangeRule = (min: number, max: number, message?: string) => {
  return {
    type: 'number' as const,
    min,
    max,
    message: message || `请输入${min}-${max}之间的数字`,
  };
};

// URL验证
export const urlRules = [
  {
    type: 'url' as const,
    message: '请输入有效的URL地址',
  },
];

// IP地址验证
export const ipRules = [
  {
    pattern: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    message: '请输入有效的IP地址',
  },
];

// 端口号验证
export const portRules = [
  {
    type: 'number' as const,
    min: 1,
    max: 65535,
    message: '请输入有效的端口号(1-65535)',
  },
];