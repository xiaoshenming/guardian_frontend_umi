/**
 * @name Guardian智能守护系统代理配置
 * @description 配置开发环境下的API代理，将前端请求代理到Guardian后端服务
 * @doc https://umijs.org/docs/guides/proxy
 */
export default {
  /**
   * @name 开发环境代理配置
   * @description 将前端API请求代理到Guardian后端服务
   */
  dev: {
    '/api/': {
      // Guardian后端服务地址
      target: 'http://localhost:10018',
      // 允许跨域
      changeOrigin: true,
      // 保持原始路径
      pathRewrite: { '^': '' },
      // 支持websocket
      ws: true,
      // 请求头配置
      headers: {
        Connection: 'keep-alive',
      },
      // 日志级别
      logLevel: 'debug',
    },
    // WebSocket代理配置（用于实时通信）
    '/socket.io/': {
      target: 'http://localhost:10018',
      changeOrigin: true,
      ws: true,
      pathRewrite: { '^': '' },
    },
  },
  /**
   * @name 测试环境代理配置
   */
  test: {
    '/api/': {
      target: 'http://test-guardian-api.example.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  /**
   * @name 预发布环境代理配置
   */
  pre: {
    '/api/': {
      target: 'http://pre-guardian-api.example.com',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
