import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Row,
  Col,
  Space,
  Divider,
  Switch,
  InputNumber,
} from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;
const { TextArea } = Input;

interface CreateCircleForm {
  name: string;
  description: string;
  type: 'family' | 'friends' | 'work' | 'community';
  privacy: 'public' | 'private' | 'invite_only';
  maxMembers: number;
  allowInvite: boolean;
  requireApproval: boolean;
  location?: string;
  tags?: string[];
}

const CreateCircle: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = async (values: CreateCircleForm) => {
    setLoading(true);
    try {
      // TODO: 调用创建守护圈的API
      console.log('创建守护圈:', values);
      message.success('守护圈创建成功！');
      history.push('/circles/list');
    } catch (error) {
      message.error('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => history.back()}>
              返回
            </Button>
            <Divider type="vertical" />
            创建守护圈
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: 'family',
            privacy: 'private',
            maxMembers: 50,
            allowInvite: true,
            requireApproval: false,
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="守护圈名称"
                rules={[
                  { required: true, message: '请输入守护圈名称' },
                  { min: 2, max: 50, message: '名称长度应在2-50个字符之间' },
                ]}
              >
                <Input placeholder="请输入守护圈名称" />
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
                rules={[
                  { required: true, message: '请输入守护圈描述' },
                  { max: 500, message: '描述不能超过500个字符' },
                ]}
              >
                <TextArea rows={4} placeholder="请描述这个守护圈的用途和特点" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="守护圈类型"
                    rules={[{ required: true, message: '请选择守护圈类型' }]}
                  >
                    <Select placeholder="选择类型">
                      <Option value="family">家庭圈</Option>
                      <Option value="friends">朋友圈</Option>
                      <Option value="work">工作圈</Option>
                      <Option value="community">社区圈</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="privacy"
                    label="隐私设置"
                    rules={[{ required: true, message: '请选择隐私设置' }]}
                  >
                    <Select placeholder="选择隐私级别">
                      <Option value="public">公开</Option>
                      <Option value="private">私密</Option>
                      <Option value="invite_only">仅邀请</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="maxMembers"
                label="最大成员数"
                rules={[
                  { required: true, message: '请设置最大成员数' },
                  { type: 'number', min: 2, max: 1000, message: '成员数应在2-1000之间' },
                ]}
              >
                <InputNumber
                  min={2}
                  max={1000}
                  style={{ width: '100%' }}
                  placeholder="设置最大成员数"
                />
              </Form.Item>

              <Form.Item name="location" label="位置（可选）">
                <Input placeholder="请输入位置信息" />
              </Form.Item>

              <Form.Item name="tags" label="标签（可选）">
                <Select mode="tags" placeholder="添加标签，按回车确认" style={{ width: '100%' }}>
                  <Option value="安全">安全</Option>
                  <Option value="健康">健康</Option>
                  <Option value="学习">学习</Option>
                  <Option value="娱乐">娱乐</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="守护圈头像">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>

              <Card title="高级设置" size="small">
                <Form.Item name="allowInvite" label="允许成员邀请他人" valuePropName="checked">
                  <Switch />
                </Form.Item>

                <Form.Item name="requireApproval" label="加入需要审批" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                创建守护圈
              </Button>
              <Button onClick={() => history.back()}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCircle;
