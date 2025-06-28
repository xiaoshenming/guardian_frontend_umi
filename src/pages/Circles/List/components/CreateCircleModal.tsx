import React, { useState } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, message, Space, Typography } from 'antd';
import { HomeOutlined, BankOutlined, ShopOutlined } from '@ant-design/icons';
import { circleAPI } from '@/services/api';
import type { GuardianCircle } from '@/services/api';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface CreateCircleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateCircleModal: React.FC<CreateCircleModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const circleData = {
        circleName: values.name,
        description: values.description,
      };

      const response = await circleAPI.createCircle(circleData);

      if (response.success) {
        message.success('守护圈创建成功！');
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || '创建失败');
      }
    } catch (error: any) {
      console.error('Create circle error:', error);
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(error.message || '创建失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 守护圈类型选项
  const circleTypeOptions = [
    {
      value: 'family',
      label: '家庭守护圈',
      icon: <HomeOutlined />,
      description: '适用于家庭成员之间的安全守护',
    },
    {
      value: 'community',
      label: '社区守护圈',
      icon: <BankOutlined />,
      description: '适用于社区、小区等区域性安全管理',
    },
    {
      value: 'enterprise',
      label: '企业守护圈',
      icon: <ShopOutlined />,
      description: '适用于企业、机构等组织安全管理',
    },
  ];

  return (
    <Modal
      title="创建守护圈"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'family',
          autoAlert: true,
          alertThreshold: 5,
        }}
      >
        <Form.Item
          name="name"
          label="守护圈名称"
          rules={[
            { required: true, message: '请输入守护圈名称' },
            { min: 2, message: '名称至少2个字符' },
            { max: 50, message: '名称最多50个字符' },
          ]}
        >
          <Input placeholder="请输入守护圈名称" />
        </Form.Item>

        <Form.Item
          name="type"
          label="守护圈类型"
          rules={[{ required: true, message: '请选择守护圈类型' }]}
        >
          <Select placeholder="请选择守护圈类型">
            {circleTypeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                <Space>
                  {option.icon}
                  <div>
                    <div>{option.label}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {option.description}
                    </Text>
                  </div>
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ max: 200, message: '描述最多200个字符' }]}
        >
          <TextArea rows={3} placeholder="请输入守护圈描述（可选）" showCount maxLength={200} />
        </Form.Item>

        <Form.Item
          name="autoAlert"
          label="自动报警"
          valuePropName="checked"
          extra="开启后，系统将自动处理和推送安全事件"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name="alertThreshold"
          label="报警阈值"
          rules={[
            { required: true, message: '请设置报警阈值' },
            { type: 'number', min: 1, max: 10, message: '阈值范围为1-10' },
          ]}
          extra="当事件等级达到此阈值时触发报警"
        >
          <InputNumber min={1} max={10} placeholder="请输入报警阈值" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="emergencyContacts"
          label="紧急联系人"
          extra="紧急情况下的联系人邮箱，多个邮箱用逗号分隔"
        >
          <TextArea rows={2} placeholder="请输入紧急联系人邮箱，多个邮箱用逗号分隔" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCircleModal;
