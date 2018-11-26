export default {
  route: {
    project: '项目展示',
    homePage: '首页',
    configPage: '统一配置',
    listPage: '详细信息'
  },
  common: {
    title: 'KEDACOM微服务',
    search: '搜索',
    deal: '操作',
    add: '添加文件',
    addVersion:'添加版本',
    show: '查看',
    help: '帮助',
    admin: '管理员',
    modify: '修改',
    delete: '删除',
    edit: '编辑',
    file: '文件夹',
    reset: '重置',
    ensure: '确定',
    cancel: '取消',
    prompt: '提示',
    create_now: '保存',
    modify_now: '保存',
    logout: '退出',
    modifyPassword: '修改密码'
  },
  index: {
    product_name: '项目名称',
    unique_identification: '唯一标识',
    creator_name: '创建人'
  },
  list: {
    validate_key: '验证秘钥',
    push: '发布',
    expo_config: '导入配置',
    export_config: '迁出', // 变更4
    import_config: '迁入', // 变更4
    addFile_button: '新增配置文件', // 变更4
    addConfig_button: '新增配置项', // 变更4
    searchFrom_place: '请输入key', // 变更4
    uploadPath_place: '请输入路径', // 变更4
    project_info: '项目信息',
    project_type: '类型',
    project_path: '路径',
    push_time: '发布时间', // 变更4
    create_time: '创建时间',
    modify_time: '修改时间',
    project_leader: '项目负责人',
    toggle_group: '分组',
    keyword: '关键词',
    new_config: '新建',
    remarks: '备注',
    add_config: '添加配置',
    edit_config: '修改配置',
    select_files: '选取文件',
    upload_server: '上传到服务器',
    config_info: '项目配置',
    text_edit: '编辑',
    text_save: '保存',
    delete_config: '删除文件',
    config_Search: '请输入关键词',
    listName: '列表',
    version: '版本号',
    submit_button: '提交', // 变更4
    pushStatus_label: '发布状态',
    oldPW_label: '旧密码', // 变更4
    newPW_label: '新密码', // 变更4
    surlyPW_label: '旧密码', // 变更4
    pwsame_message: '密码不一致', // 变更4
    surlyPW_validate: '确认密码不能为空', // 变更4
    newPW_validate: '新密码不能为空', // 变更4
    oldPW_validate: '旧密码不能为空', // 变更4
    editConfigFile_title: '编辑配置文件', // 变更4
    upload_message: '将文件拖到此处，或', // 变更4
    upload_messageButton: '点击上传', // 变更4
    path_message: '提示【上传前端配置文件请正确填写路径信息，上传后端文件无需填写路径】', // 变更4
    originPush_label: '发布的值', // 变更4
    unPush_label: '未发布的值' // 变更4
  },
  tags: {
    file_name: '文件名',
    file_type: '类型',
    file_path: '路径',
    add_file: '添加新文件',
    edit_file: '修改文件',
    select_type: '请选择类型',
    add_version: '添加版本号',
    select_version: '版本号',
    remark: '备注'
  },
  message: {
    product_name: '请输入项目名称',
    unique_identification: '请输入唯一标识',
    creator_name: '请输入创建人',
    toggle_group: '请选择分组',
    keyword: '请输入关键词',
    checkConfigKey: '键不能为空',
    validateKey: '秘钥不能为空',
    value: '值不能为空',
    file: '请选择文件夹',
    lang: '请选择语言',
    selectFile: '请选择文件', // 变更4
    dialog_UploadTypeMessage: '只能上传 properties / yaml / yml / json / js 文件', // 变更4
    dialog_UploadSizeMessage: '文件不可超过10MB', // 变更4
    list_config_content: '只能上传 properties / yaml / yml / json / js 文件，且不超过10MB',
    list_config_content_2: '只能上传json 文件，且不超过10MB',
    dialog_UploadTypeMessage_2: '只能上传json 文件',
    delete_config_content: '此操作将删除这项配置, 是否继续?',
    delete_file_content: '此操作将永久删除该文件, 是否继续?',
    legal_key: '请输入合法的Key',
    only_upload_file: '只能上传一个文件',
    success: '上传成功',
    push_success: '发布成功',
    badKey: '错误秘钥',
    add_success: '添加成功',
    add_error: '添加失败', // 变更4
    edit_success: '修改成功', // 变更4
    edit_error: '修改失败', // 变更4
    delete_success: '删除成功',
    delete_error: '删除失败',
    fail: '上传失败',
    file_name: '文件名不能为空',
    profileType: '类型不能为空',
    path: '路径不能为空',
    version: '版本号不能为空',
    enterVersion: '请输入正确的版本号。(以数字开头，只能包含数字和" . ", 如 1 或 1.0 或 1.0.0 或 1.0.0.0 )',
    duplicated_profile:'重复的配置文件',
    NO_CONFIGS_TO_PUBLISH:'没有需要发布的配置',
    INVALID_CONFIG_FILE_KEY:'无效的配置文件',
    placeholder_projectMark: '请输入项目标识', // 变更4
    placeholder_projectKey: '请输入项目密钥', // 变更4
    login_button: '登陆', // 变更4
    remainPW_label: '记住密码', // 变更4
    validate_projectMark: '项目标识不可为空', // 变更4
    validate_projectKey: '项目密钥不可为空', // 变更4
    loginSuccess_message: '登录成功', // 变更4
    valueError_message: '标识或密钥输入错误', // 变更4
    leavePage_message: '当前有未发布配置项，请确认是否进行发布', // 变更4
    validateJson_message: '输入的json格式不正确', // 变更4
    system_title: '统一配置中心' // 变更4
  }
}
