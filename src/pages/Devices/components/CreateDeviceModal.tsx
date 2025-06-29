import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, message, Row, Col } from 'antd';
import { deviceAPI, circleAPI } from '@/services/api';
import type { Circle, Location } from '@/services/api';
import { deviceNameRules, deviceSerialRules, descriptionRules, requiredRules } from '@/utils/validation';
import { requestWrapper } from '@/utils/request';

const { Option } = Select;
const { TextArea } = Input;

interface CreateDeviceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateDeviceModal: React.FC<CreateDeviceModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // 获取守护圈列表
  const fetchCircles = async () => {
    try {
      const response = await circleAPI.getCircles({ page: 1, pageSize: 100 });
      if (response.success) {
        setCircles(response.data.list);
      }
    } catch (error) {
      console.error('获取守护圈列表失败:', error);
    }
  };

  // 获取位置列表
  const fetchLocations = async () => {
    try {
      // 这里应该调用位置API，暂时使用模拟数据
      const mockLocations: Location[] = [
        { id: 1, name: '大门入口', description: '主要入口' },
        { id: 2, name: '停车场', description: '地下停车场' },
        { id: 3, name: '办公区A', description: 'A区办公室' },
        { id: 4, name: '办公区B', description: 'B区办公室' },
        { id: 5, name: '会议室', description: '大会议室' },
        { id: 6, name: '楼梯间', description: '安全通道' },
      ];
      setLocations(mockLocations);
    } catch (error) {
      console.error('获取位置列表失败:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchCircles();
      fetchLocations();
    }
  }, [visible]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      await requestWrapper(
        () => deviceAPI.createDevice({
          name: values.name,
          deviceId: values.deviceId,
          type: values.type,
          model: values.model || '',
          manufacturer: values.manufacturer || '',
          description: values.description || '',
          locationId: values.locationId,
          circleId: values.circleId,
          enabled: values.enabled ?? true,
          config: {
            ip: values.ip || '',
            port: values.port || 0,
            username: values.username || '',
            password: values.password || '',
            ...values.config,
          },
        }),
        {
          successMessage: '设备创建成功！',
          showSuccessMessage: true,
          onSuccess: () => {
            form.resetFields();
            onSuccess();
          },
        }
      );
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误，不需要处理
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="添加设备"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          enabled: true,
          port: 80,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="设备名称"
              rules={deviceNameRules}
            >
              <Input placeholder="请输入设备名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="deviceId"
              label="设备ID"
              rules={deviceSerialRules}
            >
              <Input placeholder="请输入设备唯一标识" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="设备类型"
              rules={requiredRules('设备类型')}
            >
              <Select placeholder="请选择设备类型">
                <Option value="camera">摄像头</Option>
                <Option value="sensor">传感器</Option>
                <Option value="alarm">报警器</Option>
                <Option value="fire_detector">火灾探测器</Option>
                <Option value="access_control">门禁系统</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="model"
              label="设备型号"
              rules={[{ max: 50, message: '设备型号不能超过50个字符' }]}
            >
              <Input placeholder="请输入设备型号" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="manufacturer"
              label="制造商"
              rules={[{ max: 50, message: '制造商不能超过50个字符' }]}
            >
              <Input placeholder="请输入制造商" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="enabled" label="启用状态" valuePropName="checked">
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="locationId"
              label="安装位置"
              rules={requiredRules('安装位置')}
            >
              <Select placeholder="请选择安装位置">
                {locations.map((location) => (
                  <Option key={location.id} value={location.id}>
                    {location.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="circleId"
              label="所属守护圈"
              rules={requiredRules('所属守护圈')}
            >
              <Select placeholder="请选择所属守护圈">
                {circles.map((circle) => (
                  <Option key={circle.id} value={circle.id}>
                    {circle.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="设备描述"
          rules={descriptionRules}
        >
          <TextArea rows={3} placeholder="请输入设备描述" showCount maxLength={500} />
        </Form.Item>

        {/* 网络配置 */}
        <div style={{ marginBottom: 16, fontWeight: 'bold', color: '#1890ff' }}>网络配置</div>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ip"
              label="IP地址"
              rules={[
                { required: true, message: '请输入IP地址' },
                {
                  pattern:
                    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  message: '请输入有效的IP地址',
                },
              ]}
            >
              <Input placeholder="192.168.1.100" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="port"
              label="端口"
              rules={[
                { required: true, message: '请输入端口' },
                { type: 'number', min: 1, max: 65535, message: '端口范围1-65535' },
              ]}
            >
              <InputNumber placeholder="80" style={{ width: '100%' }} min={1} max={65535} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ max: 50, message: '用户名不能超过50个字符' }]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ max: 50, message: '密码不能超过50个字符' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateDeviceModal;
