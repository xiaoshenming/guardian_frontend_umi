import React from 'react';
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  content: string;
  type?: 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  title,
  content,
  type = 'warning',
  confirmText = '确定',
  cancelText = '取消',
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <DeleteOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getButtonType = () => {
    return type === 'danger' ? 'primary' : 'primary';
  };

  const getButtonDanger = () => {
    return type === 'danger';
  };

  return (
    <Modal
      title={
        <Space>
          {getIcon()}
          {title}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>,
        <Button
          key="confirm"
          type={getButtonType()}
          danger={getButtonDanger()}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>,
      ]}
      closable={!loading}
      maskClosable={!loading}
    >
      <div style={{ padding: '16px 0' }}>
        {content}
      </div>
    </Modal>
  );
};

// 快捷方法
export const showDeleteConfirm = ({
  title = '确认删除',
  content,
  onConfirm,
}: {
  title?: string;
  content: string;
  onConfirm: () => Promise<void> | void;
}) => {
  Modal.confirm({
    title,
    content,
    icon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
    okText: '删除',
    okType: 'primary',
    okButtonProps: { danger: true },
    cancelText: '取消',
    onOk: onConfirm,
  });
};

export const showWarningConfirm = ({
  title = '确认操作',
  content,
  onConfirm,
}: {
  title?: string;
  content: string;
  onConfirm: () => Promise<void> | void;
}) => {
  Modal.confirm({
    title,
    content,
    icon: <WarningOutlined style={{ color: '#faad14' }} />,
    okText: '确定',
    cancelText: '取消',
    onOk: onConfirm,
  });
};

export default ConfirmDialog;