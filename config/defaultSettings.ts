import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name Guardian智能守护系统默认配置
 * @description 系统布局和主题的默认配置
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  // 导航主题：亮色主题
  navTheme: 'light',
  // 主色调：Guardian蓝
  colorPrimary: '#1890ff',
  // 布局模式：混合布局（顶部+侧边）
  layout: 'mix',
  // 内容区域宽度：流式布局
  contentWidth: 'Fluid',
  // 固定头部
  fixedHeader: true,
  // 固定侧边栏
  fixSiderbar: true,
  // 色弱模式
  colorWeak: false,
  // 应用标题
  title: 'Guardian智能守护系统',
  // 启用PWA
  pwa: true,
  // 应用Logo - 使用盾牌图标表示守护
  logo: '/logo.svg',
  // 自定义图标字体
  iconfontUrl: '',
  // 主题token配置
  token: {
    // 头部高度
    header: {
      heightLayoutHeader: 56,
    },
    // 侧边栏配置
    sider: {
      colorMenuBackground: '#fff',
      colorMenuItemDivider: '#f0f0f0',
    },
    // 页面容器配置
    pageContainer: {
      paddingInlinePageContainerContent: 24,
      paddingBlockPageContainerContent: 16,
    },
  },
};

export default Settings;
