import React from 'react';
import { Spin, Card } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  spinning?: boolean;
  tip?: string;
  size?: 'small' | 'default' | 'large';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  spinning = true,
  tip = '加载中...',
  size = 'default',
  children,
  style,
  className,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 24 : size === 'small' ? 14 : 18 }} spin />;

  if (children) {
    return (
      <Spin spinning={spinning} tip={tip} indicator={antIcon} size={size}>
        {children}
      </Spin>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        ...style,
      }}
    >
      <Spin spinning={spinning} tip={tip} indicator={antIcon} size={size} />
    </div>
  );
};

// 页面级加载组件
export const PageLoading: React.FC<{ tip?: string }> = ({ tip = '页面加载中...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
      }}
    >
      <Spin size="large" tip={tip} />
    </div>
  );
};

// 卡片加载组件
export const CardLoading: React.FC<{ title?: string; tip?: string }> = ({ 
  title = '加载中', 
  tip = '正在获取数据...' 
}) => {
  return (
    <Card title={title} style={{ minHeight: 200 }}>
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin tip={tip} />
      </div>
    </Card>
  );
};

export default Loading;