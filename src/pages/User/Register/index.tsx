import { Footer } from '@/components';
import { authAPI } from '@/services/auth';
import { LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, Helmet, history, SelectLang, useIntl } from '@umijs/max';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTg5MEZGO3N0b3Atb3BhY2l0eTowLjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzAwN0FGRjtzdG9wLW9wYWNpdHk6MC4wNSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZGllbnQpIiAvPgo8L3N2Zz4=')",
      backgroundSize: '100% 100%',
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      top: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    content: {
      flex: 1,
      padding: '32px 0',
    },
  };
});

const RegisterMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Register: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('account');
  const { styles } = useStyles();
  const intl = useIntl();

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const registerData = {
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        captcha: values.captcha,
      };

      const response = await authAPI.register(registerData);

      if (response.code === 200) {
        message.success('注册成功！');
        history.push('/user/login');
      } else {
        message.error(response.message || '注册失败');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      message.error(error.message || '注册失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.register',
            defaultMessage: '注册页',
          })}
          - Guardian智能守护系统
        </title>
      </Helmet>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Guardian智能守护系统"
          subTitle={intl.formatMessage({
            id: 'pages.layouts.userLayout.title',
            defaultMessage: '智能守护的守护者，守护核心的人',
          })}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.register.accountRegister.tab',
                  defaultMessage: '账户注册',
                }),
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.username.placeholder',
                  defaultMessage: '用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                  {
                    min: 3,
                    message: '用户名至少3个字符',
                  },
                  {
                    max: 20,
                    message: '用户名最多20个字符',
                  },
                ]}
              />
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.email.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.email.required"
                        defaultMessage="请输入邮箱!"
                      />
                    ),
                  },
                  {
                    type: 'email',
                    message: '请输入有效的邮箱地址',
                  },
                ]}
              />
              <ProFormText
                name="phone"
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.phone.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.phone.required"
                        defaultMessage="请输入手机号!"
                      />
                    ),
                  },
                  {
                    pattern: /^1[3-9]\d{9}$/,
                    message: '请输入有效的手机号',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                  {
                    min: 6,
                    message: '密码至少6个字符',
                  },
                ]}
              />
              <ProFormText.Password
                name="confirmPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.confirmPassword.placeholder',
                  defaultMessage: '确认密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.confirmPassword.required"
                        defaultMessage="请确认密码！"
                      />
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.register.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.register.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async () => {
                  // 这里应该调用发送验证码的API
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="agreement">
              我已阅读并同意
              <a
                onClick={() => {
                  // 打开用户协议
                }}
              >
                《用户协议》
              </a>
              和
              <a
                onClick={() => {
                  // 打开隐私政策
                }}
              >
                《隐私政策》
              </a>
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <div
        style={{
          textAlign: 'center',
          padding: '24px 0',
        }}
      >
        已有账号？
        <a
          onClick={() => {
            history.push('/user/login');
          }}
        >
          立即登录
        </a>
      </div>
    </div>
  );
};

export default Register;
