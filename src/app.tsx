import { LinkOutlined, BellOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { Badge, message } from 'antd';
import React from 'react';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { authAPI, eventAPI } from './services/guardian/api';
import type { UserInfo } from './services/auth';
import { AvatarDropdown, AvatarName, Footer, Question, SelectLang } from './components';
import '@ant-design/v5-patch-for-react-19';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserInfo;
  loading?: boolean;
  unhandledEventCount?: number;
  fetchUserInfo?: () => Promise<UserInfo | undefined>;
  fetchUnhandledCount?: () => Promise<number>;
}> {
  const fetchUserInfo = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      console.log('app.tsx fetchUserInfo响应:', response);
      if (response.data) {
        return response.data;
      }
      console.log('fetchUserInfo: 响应不成功或无数据');
      return undefined;
    } catch (error: any) {
      console.error('获取用户信息失败:', error);
      // 检查是否是认证错误（401或403）
      if (error.info?.errorCode === 401 || error.info?.errorCode === 403) {
        console.log('认证失败，跳转到登录页');
        // 如果token无效，跳转到登录页
        if (!location.pathname.startsWith('/user')) {
          history.push(loginPath);
        }
      }
      return undefined;
    }
  };

  const fetchUnhandledCount = async () => {
    try {
      const response = await eventAPI.getUnhandledCount();
      if (response.success && response.data) {
        return response.data.count;
      }
    } catch (error) {
      console.error('获取未处理事件数量失败:', error);
    }
    return 0;
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (!location.pathname.startsWith('/user')) {
    const currentUser = await fetchUserInfo();
    const unhandledEventCount = currentUser ? await fetchUnhandledCount() : 0;
    return {
      fetchUserInfo,
      fetchUnhandledCount,
      currentUser,
      unhandledEventCount,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    fetchUnhandledCount,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [
      // 未处理事件通知
      <Badge
        key="notifications"
        count={initialState?.unhandledEventCount || 0}
        size="small"
        style={{ marginRight: 8 }}
      >
        <BellOutlined
          style={{ fontSize: 16, cursor: 'pointer' }}
          onClick={() => {
            history.push('/events/alerts');
          }}
        />
      </Badge>,
      <Question key="doc" />,
      <SelectLang key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.currentUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.username || 'Guardian',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      console.log('页面变化:', location.pathname, '当前用户:', initialState?.currentUser);
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !location.pathname.startsWith('/user')) {
        console.log('用户未登录，重定向到登录页');
        history.push(loginPath);
      }
    },
    // Guardian系统的背景图片
    bgLayoutImgList: [
      {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iMTAwIiBmaWxsPSIjZjBmOWZmIiBmaWxsLW9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjcwIiBmaWxsPSIjZTZmNGZmIiBmaWxsLW9wYWNpdHk9IjAuNCIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSIjZGFlOGZmIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMDAgMjBMMTgwIDEwMEwxMDAgMTgwTDIwIDEwMFoiIGZpbGw9IiNmZmY3ZWQiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CjxwYXRoIGQ9Ik0xMDAgNDBMMTYwIDEwMEwxMDAgMTYwTDQwIDEwMFoiIGZpbGw9IiNmZWY0ZTciIGZpbGwtb3BhY2l0eT0iMC40Ii8+CjwvdXZnPg==',
        bottom: -68,
        right: -45,
        height: '303px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

// 权限定义已移至 src/access.ts

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
