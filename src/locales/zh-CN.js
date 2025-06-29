export default {
  // 通用
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '新增',
    search: '搜索',
    reset: '重置',
    refresh: '刷新',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    loading: '加载中...',
    noData: '暂无数据',
    success: '操作成功',
    error: '操作失败',
    warning: '警告',
    info: '提示',
    noTitle: '无标题',
    export: '导出',
    batchDelete: '批量删除'
  },

  // 导航
  nav: {
    dashboard: '仪表盘',
    system: '系统管理',
    user: '用户管理',
    role: '角色管理',
    menu: '菜单管理',
    profile: '个人中心',
    logout: '退出登录'
  },

  // 设置
  settings: {
    title: '全局设置',
    theme: '主题设置',
    themeMode: '主题模式',
    light: '亮色',
    dark: '暗色',
    primaryColor: '主题色',
    compactMode: '紧凑模式',
    layout: '布局设置',
    sidebarCollapse: '侧边栏折叠',
    breadcrumb: '面包屑导航',
    tagsView: '标签栏',
    watermark: '水印设置',
    watermarkEnabled: '启用水印',
    watermarkText: '水印文字',
    watermarkFontSize: '字体大小',
    watermarkColor: '水印颜色',
    watermarkRotate: '旋转角度',
    page: '页面设置',
    pageTransition: '页面切换动画',
    fade: '淡入淡出',
    slide: '滑动',
    zoom: '缩放',
    none: '无动画',
    fullscreen: '全屏模式',
    enterFullscreen: '进入全屏',
    exitFullscreen: '退出全屏',
    language: '语言设置',
    languageName: '语言',
    resetSettings: '重置设置',
    resetConfirm: '确定要重置所有设置到默认值吗？'
  },

  // 用户管理
  user: {
    title: '用户管理',
    userId: '用户编号',
    username: '用户名',
    nickname: '昵称',
    email: '邮箱',
    phone: '手机号',
    status: '状态',
    statusNormal: '正常',
    statusDisabled: '停用',
    createTime: '创建时间',
    lastLoginTime: '最后登录时间',
    actions: '操作',
    addUser: '新增用户',
    editUser: '编辑用户',
    deleteUser: '删除用户',
    deleteConfirm: '确定要删除该用户吗？',
    password: '密码',
    confirmPassword: '确认密码',
    role: '角色',
    department: '部门',
    sex: '性别',
    male: '男',
    female: '女',
    unknown: '未知',
    remark: '备注',
    setRole: '设置角色',
    batchDelete: '批量删除'
  },

  // 角色管理
  role: {
    title: '角色管理',
    roleName: '角色名称',
    roleCode: '角色编码',
    description: '描述',
    status: '状态',
    statusNormal: '正常',
    statusDisabled: '停用',
    createTime: '创建时间',
    actions: '操作',
    addRole: '新增角色',
    editRole: '编辑角色',
    deleteRole: '删除角色',
    deleteConfirm: '确定要删除该角色吗？',
    permissions: '权限设置'
  },

  // 菜单管理
  menu: {
    title: '菜单管理',
    menuName: '菜单名称',
    icon: '图标',
    orderNum: '排序',
    perms: '权限标识',
    component: '组件路径',
    status: '状态',
    statusNormal: '正常',
    statusDisabled: '停用',
    path: '路由地址',
    parentMenu: '上级菜单',
    menuType: '菜单类型',
    menuTypeDir: '目录',
    menuTypeMenu: '菜单',
    menuTypeButton: '按钮',
    actions: '操作',
    addMenu: '新增菜单',
    editMenu: '编辑菜单',
    deleteMenu: '删除菜单',
    deleteConfirm: '确定要删除该菜单吗？',
    hasChildren: '存在子菜单，不允许删除'
  },

  // 仪表盘
  dashboard: {
    title: '仪表盘',
    welcome: '欢迎使用',
    totalUsers: '总用户数',
    totalOrders: '总订单数',
    totalRevenue: '总收入',
    totalProducts: '总产品数',
    salesTrend: '销售趋势',
    thisWeek: '本周',
    thisMonth: '本月',
    thisYear: '本年',
    recentOrders: '最近订单',
    orderNumber: '订单号',
    customer: '客户',
    amount: '金额',
    status: '状态',
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消',
    paid: '待支付'
  },

  // 登录
  login: {
    title: '登录',
    username: '用户名',
    password: '密码',
    rememberMe: '记住我',
    login: '登录',
    forgotPassword: '忘记密码？',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码'
  },

  // 错误页面
  error: {
    404: {
      title: '页面不存在',
      subtitle: '抱歉，您访问的页面不存在',
      backHome: '返回首页'
    },
    403: {
      title: '访问被拒绝',
      subtitle: '抱歉，您没有权限访问此页面',
      backHome: '返回首页'
    },
    500: {
      title: '服务器错误',
      subtitle: '抱歉，服务器出现了问题',
      backHome: '返回首页'
    }
  },

  // 表格
  table: {
    index: '序号',
    actions: '操作',
    columnSettings: '列设置',
    noSelectedRows: '请选择要操作的记录',
    batchDeleteConfirm: '确定要删除选中的记录吗？',
    deleteConfirm: '确定要删除该记录吗？'
  }
} 