import { Footer } from '@/components';
import { authAPI } from '@/services/auth';
import { LockOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
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

const ForgotPasswordMessage: React.FC<{
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

const ForgotPassword: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('email');
  const [step, setStep] = useState<number>(1); // 1: 发送验证码, 2: 重置密码
  const [resetToken, setResetToken] = useState<string>('');
  const { styles } = useStyles();
  const intl = useIntl();

  const handleSendCode = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await authAPI.sendResetCode({
        type: type,
        contact: type === 'email' ? values.email : values.phone,
      });

      if (response.success) {
        message.success('验证码发送成功！');
        setResetToken(response.data.token);
        setStep(2);
      } else {
        message.error(response.message || '发送失败');
      }
    } catch (error: any) {
      console.error('Send code error:', error);
      message.error(error.message || '发送失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await authAPI.resetPassword({
        token: resetToken,
        code: values.captcha,
        newPassword: values.password,
      });

      if (response.success) {
        message.success('密码重置成功！');
        history.push('/user/login');
      } else {
        message.error(response.message || '重置失败');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      message.error(error.message || '重置失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.forgotPassword',
            defaultMessage: '忘记密码',
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
          subTitle={step === 1 ? '找回密码' : '重置密码'}
          submitter={{
            searchConfig: {
              submitText: step === 1 ? '发送验证码' : '重置密码',
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
            if (step === 1) {
              await handleSendCode(values);
            } else {
              await handleResetPassword(values);
            }
          }}
        >
          {step === 1 && (
            <>
              <Tabs
                activeKey={type}
                onChange={setType}
                centered
                items={[
                  {
                    key: 'email',
                    label: intl.formatMessage({
                      id: 'pages.forgotPassword.email.tab',
                      defaultMessage: '邮箱找回',
                    }),
                  },
                  {
                    key: 'phone',
                    label: intl.formatMessage({
                      id: 'pages.forgotPassword.phone.tab',
                      defaultMessage: '手机找回',
                    }),
                  },
                ]}
              />

              {type === 'email' && (
                <ProFormText
                  name="email"
                  fieldProps={{
                    size: 'large',
                    prefix: <MailOutlined />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.forgotPassword.email.placeholder',
                    defaultMessage: '请输入邮箱',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.forgotPassword.email.required"
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
              )}

              {type === 'phone' && (
                <ProFormText
                  name="phone"
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined />,
                  }}
                  placeholder={intl.formatMessage({
                    id: 'pages.forgotPassword.phone.placeholder',
                    defaultMessage: '请输入手机号',
                  })}
                  rules={[
                    {
                      required: true,
                      message: (
                        <FormattedMessage
                          id="pages.forgotPassword.phone.required"
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
              )}
            </>
          )}

          {step === 2 && (
            <>
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.forgotPassword.captcha.placeholder',
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
                    id: 'pages.forgotPassword.getVerificationCode',
                    defaultMessage: '重新发送',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.forgotPassword.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async () => {
                  // 重新发送验证码
                  message.success('验证码发送成功！');
                }}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.forgotPassword.password.placeholder',
                  defaultMessage: '新密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.forgotPassword.password.required"
                        defaultMessage="请输入新密码！"
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
                  id: 'pages.forgotPassword.confirmPassword.placeholder',
                  defaultMessage: '确认新密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.forgotPassword.confirmPassword.required"
                        defaultMessage="请确认新密码！"
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
            </>
          )}
        </LoginForm>
      </div>
      <div
        style={{
          textAlign: 'center',
          padding: '24px 0',
        }}
      >
        <a
          onClick={() => {
            history.push('/user/login');
          }}
        >
          返回登录
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
