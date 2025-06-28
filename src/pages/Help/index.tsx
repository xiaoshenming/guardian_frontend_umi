import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Collapse,
  Typography,
  Space,
  Button,
  Tabs,
  List,
  Avatar,
  Tag,
  Divider,
  Steps,
  Alert,
  Image,
  Anchor,
  BackTop,
} from 'antd';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  VideoCameraOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';

const { Search } = Input;
const { Panel } = Collapse;
const { Title, Paragraph, Text, Link } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

const Help: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('guide');

  // 常见问题数据
  const faqData = [
    {
      id: '1',
      category: '登录问题',
      question: '忘记密码怎么办？',
      answer:
        '您可以通过以下方式重置密码：\n1. 在登录页面点击"忘记密码"\n2. 输入您的用户名或邮箱\n3. 系统会发送重置链接到您的邮箱\n4. 点击链接设置新密码',
      tags: ['密码', '登录', '重置'],
    },
    {
      id: '2',
      category: '设备管理',
      question: '如何添加新设备？',
      answer:
        '添加新设备的步骤：\n1. 进入设备管理页面\n2. 点击"添加设备"按钮\n3. 填写设备基本信息\n4. 配置网络参数\n5. 选择所属守护圈\n6. 保存设备信息',
      tags: ['设备', '添加', '配置'],
    },
    {
      id: '3',
      category: '事件处理',
      question: '如何处理安全事件？',
      answer:
        '处理安全事件的流程：\n1. 在事件列表中选择待处理事件\n2. 点击"处理"按钮\n3. 填写处理说明\n4. 选择处理结果\n5. 提交处理记录',
      tags: ['事件', '处理', '安全'],
    },
    {
      id: '4',
      category: '用户管理',
      question: '如何修改用户权限？',
      answer:
        '修改用户权限需要管理员权限：\n1. 进入用户管理页面\n2. 找到目标用户\n3. 点击"编辑"按钮\n4. 修改用户角色\n5. 保存更改',
      tags: ['用户', '权限', '角色'],
    },
    {
      id: '5',
      category: '系统设置',
      question: '如何配置邮件通知？',
      answer:
        '配置邮件通知的步骤：\n1. 进入系统设置页面\n2. 切换到"通知设置"标签\n3. 启用邮件通知\n4. 配置SMTP服务器信息\n5. 测试邮件发送\n6. 保存设置',
      tags: ['邮件', '通知', '配置'],
    },
  ];

  // 用户手册数据
  const guideData = [
    {
      title: '快速开始',
      description: '了解系统基本功能和操作流程',
      icon: <RightOutlined />,
      content: ['系统概述', '登录和注销', '界面介绍', '基本操作'],
    },
    {
      title: '守护圈管理',
      description: '创建和管理安全守护圈',
      icon: <CheckCircleOutlined />,
      content: ['创建守护圈', '配置守护圈参数', '添加设备到守护圈', '监控守护圈状态'],
    },
    {
      title: '设备管理',
      description: '添加、配置和监控安全设备',
      icon: <ExclamationCircleOutlined />,
      content: ['设备类型介绍', '添加新设备', '设备配置', '设备状态监控'],
    },
    {
      title: '事件处理',
      description: '处理和分析安全事件',
      icon: <InfoCircleOutlined />,
      content: ['事件类型说明', '事件处理流程', '事件分析方法', '报告生成'],
    },
    {
      title: '用户管理',
      description: '管理系统用户和权限',
      icon: <BulbOutlined />,
      content: ['用户角色说明', '添加新用户', '权限配置', '用户状态管理'],
    },
    {
      title: '系统设置',
      description: '配置系统参数和偏好设置',
      icon: <CheckCircleOutlined />,
      content: ['基本设置', '安全设置', '通知设置', '数据设置'],
    },
  ];

  // 视频教程数据
  const videoData = [
    {
      id: '1',
      title: '系统介绍和快速开始',
      duration: '10:30',
      thumbnail: '/images/video1.jpg',
      description: '介绍Guardian安全管理系统的主要功能和基本操作',
    },
    {
      id: '2',
      title: '守护圈创建和配置',
      duration: '15:20',
      thumbnail: '/images/video2.jpg',
      description: '详细演示如何创建和配置安全守护圈',
    },
    {
      id: '3',
      title: '设备管理完整流程',
      duration: '20:15',
      thumbnail: '/images/video3.jpg',
      description: '从添加设备到监控设备状态的完整操作流程',
    },
    {
      id: '4',
      title: '安全事件处理实战',
      duration: '18:45',
      thumbnail: '/images/video4.jpg',
      description: '实际案例演示安全事件的处理和分析方法',
    },
  ];

  // 下载资源数据
  const downloadData = [
    {
      name: 'Guardian用户手册',
      type: 'PDF',
      size: '2.5MB',
      version: 'v1.0',
      description: '完整的用户操作手册',
    },
    {
      name: '快速开始指南',
      type: 'PDF',
      size: '1.2MB',
      version: 'v1.0',
      description: '新用户快速上手指南',
    },
    {
      name: 'API接口文档',
      type: 'PDF',
      size: '3.8MB',
      version: 'v1.0',
      description: '系统API接口详细文档',
    },
    {
      name: '设备配置模板',
      type: 'Excel',
      size: '0.5MB',
      version: 'v1.0',
      description: '设备批量导入配置模板',
    },
  ];

  // 过滤FAQ数据
  const filteredFaq = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchKeyword.toLowerCase())),
  );

  return (
    <PageContainer title="帮助中心" subTitle="用户手册、常见问题和系统文档">
      <Row gutter={[16, 16]}>
        {/* 搜索栏 */}
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Title level={2}>有什么可以帮助您的？</Title>
              <Search
                placeholder="搜索帮助内容、常见问题..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                style={{ maxWidth: 600, margin: '20px 0' }}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          </Card>
        </Col>

        {/* 主要内容 */}
        <Col span={24}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {/* 用户手册 */}
              <TabPane
                tab={
                  <span>
                    <BookOutlined />
                    用户手册
                  </span>
                }
                key="guide"
              >
                <Row gutter={[16, 16]}>
                  {guideData.map((guide, index) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                      <Card hoverable style={{ height: '100%' }} bodyStyle={{ padding: '20px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                          <Avatar
                            size={48}
                            icon={guide.icon}
                            style={{ backgroundColor: '#1890ff' }}
                          />
                        </div>
                        <Title level={4} style={{ textAlign: 'center', marginBottom: '8px' }}>
                          {guide.title}
                        </Title>
                        <Paragraph
                          type="secondary"
                          style={{ textAlign: 'center', marginBottom: '16px' }}
                        >
                          {guide.description}
                        </Paragraph>
                        <List
                          size="small"
                          dataSource={guide.content}
                          renderItem={(item) => (
                            <List.Item>
                              <Link>{item}</Link>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Divider />

                {/* 快速开始步骤 */}
                <Title level={3}>快速开始</Title>
                <Steps direction="vertical" size="small">
                  <Step
                    title="登录系统"
                    description="使用管理员提供的账号密码登录系统"
                    icon={<CheckCircleOutlined />}
                  />
                  <Step
                    title="创建守护圈"
                    description="根据实际需求创建安全守护圈"
                    icon={<CheckCircleOutlined />}
                  />
                  <Step
                    title="添加设备"
                    description="将安全设备添加到对应的守护圈中"
                    icon={<CheckCircleOutlined />}
                  />
                  <Step
                    title="配置参数"
                    description="配置设备参数和告警规则"
                    icon={<CheckCircleOutlined />}
                  />
                  <Step
                    title="开始监控"
                    description="系统开始实时监控安全状态"
                    icon={<CheckCircleOutlined />}
                  />
                </Steps>
              </TabPane>

              {/* 常见问题 */}
              <TabPane
                tab={
                  <span>
                    <QuestionCircleOutlined />
                    常见问题
                  </span>
                }
                key="faq"
              >
                <Alert
                  message="提示"
                  description="如果您没有找到想要的答案，请联系技术支持团队。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Collapse>
                  {filteredFaq.map((faq) => (
                    <Panel
                      header={
                        <Space>
                          <Tag color="blue">{faq.category}</Tag>
                          <Text strong>{faq.question}</Text>
                        </Space>
                      }
                      key={faq.id}
                    >
                      <div style={{ marginBottom: 16 }}>
                        <Paragraph>
                          {faq.answer.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                          ))}
                        </Paragraph>
                      </div>
                      <div>
                        <Text type="secondary">标签：</Text>
                        {faq.tags.map((tag) => (
                          <Tag key={tag} size="small">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Panel>
                  ))}
                </Collapse>

                {filteredFaq.length === 0 && searchKeyword && (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">没有找到相关问题，请尝试其他关键词</Text>
                  </div>
                )}
              </TabPane>

              {/* 视频教程 */}
              <TabPane
                tab={
                  <span>
                    <VideoCameraOutlined />
                    视频教程
                  </span>
                }
                key="video"
              >
                <Row gutter={[16, 16]}>
                  {videoData.map((video) => (
                    <Col xs={24} sm={12} lg={6} key={video.id}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ position: 'relative' }}>
                            <Image
                              alt={video.title}
                              src={video.thumbnail}
                              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                              preview={false}
                              style={{ height: 120, objectFit: 'cover' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: 'white',
                                fontSize: '24px',
                              }}
                            >
                              <VideoCameraOutlined />
                            </div>
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: 4,
                                fontSize: '12px',
                              }}
                            >
                              {video.duration}
                            </div>
                          </div>
                        }
                      >
                        <Card.Meta title={video.title} description={video.description} />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              {/* 下载中心 */}
              <TabPane
                tab={
                  <span>
                    <DownloadOutlined />
                    下载中心
                  </span>
                }
                key="download"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={downloadData}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button type="primary" icon={<DownloadOutlined />}>
                          下载
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            style={{
                              backgroundColor: item.type === 'PDF' ? '#ff4d4f' : '#52c41a',
                            }}
                          >
                            {item.type}
                          </Avatar>
                        }
                        title={item.name}
                        description={
                          <Space>
                            <Text type="secondary">{item.description}</Text>
                            <Tag>{item.size}</Tag>
                            <Tag color="blue">{item.version}</Tag>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* 联系支持 */}
        <Col span={24}>
          <Card title="联系技术支持">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <PhoneOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                  <div>
                    <Text strong>电话支持</Text>
                    <br />
                    <Text type="secondary">400-123-4567</Text>
                    <br />
                    <Text type="secondary">工作日 9:00-18:00</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <MailOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                  <div>
                    <Text strong>邮件支持</Text>
                    <br />
                    <Text type="secondary">support@guardian.com</Text>
                    <br />
                    <Text type="secondary">24小时内回复</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <GlobalOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                  <div>
                    <Text strong>在线文档</Text>
                    <br />
                    <Link href="https://docs.guardian.com" target="_blank">
                      docs.guardian.com
                    </Link>
                    <br />
                    <Text type="secondary">详细技术文档</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <BackTop />
    </PageContainer>
  );
};

export default Help;
