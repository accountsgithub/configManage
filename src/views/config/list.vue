<template>
  <el-row class="main" v-loading="pageLoading">
    <div class="title-div-style">
      <!--操作栏-->
      <div class="project-list-style">
        <div class="list-title-style">
          <span>{{$t('list.project_info')}}<el-tag v-if="unPushCount > 0" size="medium" style="margin-left:20px;">{{$t('common.modify')}}{{unPushCount}}</el-tag></span>
        </div>
        <div>
          <el-button class="tableLastButtonStyleB icon iconfont icon-ic-release" type="primary" @click="onConfigPushMethod">{{$t('list.push')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-new" type="primary" @click="addVersionMethod">{{$t('common.addVersion')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-new" type="primary" @click="onFilesClick">{{$t('list.addFile_button')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-import" type="primary" @click="expoFiles">{{$t('list.expo_config')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-export" type="primary" @click="exportFiles">{{$t('list.export_config')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-import" type="primary" @click="importFiles">{{$t('list.import_config')}}</el-button>
        </div>
      </div>
      <!--项目详细信息-->
      <div class="project-info-style">
        <span class="project-detail-style">{{$t('list.project_info')}}： <span>{{projectDetail.name}}</span></span>
        <span class="project-detail-style">{{$t('index.unique_identification')}}： <span>{{projectDetail.mark}}</span></span>
        <span class="project-detail-style">{{$t('list.project_leader')}}： <span>{{projectDetail.creatorName}}</span></span>
        <span class="project-detail-style">{{$t('list.push_time')}}： <span>{{timestampToTimeFun(updateTime)}}</span></span>
        <div class="project-version-style">
          <span>{{$t('list.version')}}：</span>
          <el-select v-model="ActiveVersion.version" @change="versionChangeMethod" v-loading="versionLoading">
            <el-option v-for="item in list_version"
                       :key="item.id"
                       :value="item.version"
                       :label="item.version">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="content-style">
      <!--折叠窗体-->
      <el-collapse v-model="activeName" accordion @change="changeTagMethod">
        <el-collapse-item v-for="item in projectConfigList" :title="item.name" :name="item.id">
          <!--折叠窗体标题信息-->
          <template slot="title">
            <div>
              <!--编辑路径-->
              <span>{{item.name}}</span><span v-if="item.profileType!='bootstrap'" style="font-size: 12px;margin-left: 4.2%">{{$t('list.project_path')}}：{{item.path}}</span>
              <!--<i class="icon iconfont icon-ic-edit edit-icon-style" @click="editPathMethod(item.id, item.path)" @click.stop=""></i>-->
              <!--tag操作栏-->
              <div class="config-file-title" @click.stop="">
                <el-button v-if="tabName == 'json' && activeName == item.id" class="tableLastButtonStyleB" type="primary" @click="addConfigMethod(item.id)">{{$t('list.addConfig_button')}}</el-button>
                <el-button :class="{tableLastButtonStyleW: true, tableLastButtonStyleWLast: tabName != 'json'}" type="primary" @click="editConfigFileMethod(item)">{{$t('list.editConfigFile_title')}}</el-button>
                <el-button class="tableLastButtonStyleW" type="primary" @click="deleteConfigFile(item.id)">{{$t('common.delete')}}</el-button>
                <el-input v-if="tabName == 'json' && activeName == item.id" v-model="formInline.f_like_configKey" :placeholder="$t('list.searchFrom_place')" suffix-icon="el-icon-search" class="search-config-style"></el-input>
              </div>
            </div>
          </template>
          <!--配置项列表-->
          <div :class="{'content-div-style': true, 'table-sort-style': isTagChange}" v-loading="listLoading">
            <!--tab标签-->
            <el-tabs v-model="tabName" @tab-click="tabClickMethod">
              <el-tab-pane label="json" name="json">
                <div class="table-div-style">
                  <el-table class="table-sort-style" :data="configDetailList" ref="configTable" :stripe="true" style="width: 100%" @sort-change="handleSortChange" :border="false">
                  <el-table-column :label="$t('list.pushStatus_label')" prop="publish" min-width="180" align="center" class="fontBlod fontSizeBtB12">
                    <template slot-scope="scope">
                      <div slot="reference" :class="{'push-status': true, 'y-push-status': scope.row.publish==1}">
                        <el-tag size="medium">{{conPushStatus(scope.row.publish)}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Key" prop="configKey" sortable="custom" min-width="180" align="left" class="fontBlod fontSizeBtB12">
                    <template slot-scope="scope">
                      <div slot="reference" :class="{'key-status': true, 'd-key-status': scope.row.operation==3, 'm-key-status': scope.row.operation==2}">
                        <el-popover v-if="scope.row.configKey.length>20" trigger="hover" placement="top">
                          <p class="popover-style">{{ scope.row.configKey }}</p>
                          <div slot="reference">
                            <span size="medium">{{ scope.row.configKey.substring(0,20) }}…</span>
                            <el-tag v-if="scope.row.publish == 0" size="medium" style="margin-left: 10px;">{{conKeyStatus(scope.row.operation)}}</el-tag>
                          </div>
                        </el-popover>
                        <div v-else >
                          <span class="overKeyWidth">{{ scope.row.configKey }}</span>
                          <el-tag v-if="scope.row.publish == 0" size="medium" style="margin-left: 10px;">{{conKeyStatus(scope.row.operation)}}</el-tag>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Value" min-width="180" align="left">
                    <template slot-scope="scope">
                      <el-popover v-if="scope.row.configValue.length>26" trigger="hover" placement="top">
                        <p class="popover-style">{{ scope.row.configValue }}</p>
                        <div slot="reference" class="value-tag-style">
                          <el-tag size="medium">{{ scope.row.configValue.substring(0,26) }}…</el-tag>
                        </div>
                      </el-popover>
                      <div v-else slot="reference" class="value-tag-style">
                        <el-tag size="medium">{{ scope.row.configValue }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('list.modify_time')" prop="updateTime" sortable="custom" min-width="180" align="center">
                    <template slot-scope="scope">
                      <span size="medium">{{ timestampToTimeFun(scope.row.updateTime) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('list.remarks')" prop="remark" min-width="180" align="center">
                    <template slot-scope="scope">
                      <span class="overRemarkWidth">{{scope.row.remark}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('common.deal')"  min-width="200" align="center">
                    <template slot-scope="scope">
                      <a class="tableActionStyle" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</a>
                      <a class="tableActionStyle" style="padding-left: 10px" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</a>
                    </template>
                  </el-table-column>
                </el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane label="text" name="text">
                <!--<div>
                  <el-form :inline="true" :model="ruleTextAddForm" ref="ruleTextAddForm">
                    <el-input class="textDivStyle" :disabled="disTextEdit"
                              type="textarea"
                              :autosize="{ minRows: 10, maxRows: 10}"
                              v-model="ruleTextAddForm.configValue" auto-complete="off"  maxlength="4096">
                    </el-input>
                    <el-button class="float-right buttonStyle fontSizeBtB12" :class="{disStyle:saveButton}" icon="el-icon-edit" type="primary" @click="textEdit" style="margin-right: 22px;">{{$t('list.text_edit')}}</el-button>
                    <el-button class="float-right buttonStyle fontSizeBtW12" :class="{disStyle:!saveButton}" icon="el-icon-upload" type="primary" @click="textSave" style="margin-right: 22px;">{{$t('list.text_save')}}</el-button>
                  </el-form>
                </div>-->
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!--配置项dialog-->
    <el-dialog
      :title="configSaveForm.id==''?$t('list.add_config'):$t('list.edit_config')"
      :visible.sync="dialogEditVisible"
      @close="resetForm('configSaveForm')"
      width="50%">
      <el-form :model="configSaveForm" :rules="saveFormRules" ref="configSaveForm" label-width="100px" class="dialogStyle">
        <el-form-item label="Key" prop="configKey">
          <el-input v-model="configSaveForm.configKey"  auto-complete="off" maxlength="253"></el-input>
        </el-form-item>
        <el-form-item label="Value" prop="configValue">
          <el-input type="textarea" v-model="configSaveForm.configValue"  rows="5" maxlength="4096"></el-input>
        </el-form-item>
        <el-form-item :label="$t('list.remarks')" prop="remark">
          <el-input type="textarea"
                    v-model="configSaveForm.remark"
                    :autosize="{ minRows: 4, maxRows: 4}" maxlength="4096">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('configSaveForm')" class="dialogButtonB">{{$t('common.modify_now')}}</el-button>
        <el-button @click="dialogEditVisible=false" class="dialogButtonW">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--添加文件弹框-->
    <el-dialog
      :title="saveConfigFile.id==''?$t('tags.add_file'):$t('list.editConfigFile_title')"
      :visible.sync="dialogAddVisible" @close="resetForm('saveConfigFile')"
      width="60%">
      <el-form :model="saveConfigFile" :rules="addFormRulesTag" ref="saveConfigFile" label-width="100px" class="dialogStyle">
        <el-form-item :label="$t('tags.file_name')" prop="name">
          <el-input v-model="saveConfigFile.name" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
        <el-form-item v-if="saveConfigFile.profileType!='bootstrap'" :label="$t('tags.file_path')" prop="path">
          <el-input v-model="saveConfigFile.path" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button class="dialogButtonB" type="primary" @click="submitFileForm('saveConfigFile')">{{$t('common.create_now')}}</el-button>
          <el-button class="dialogButtonW" @click="dialogAddVisible=false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--导入配置-->
    <el-dialog
      :title="$t('list.expo_config')"
      :visible.sync="dialogExpoVisible" @close="dialogExpoClose"
      :before-close="beforeClose"
      width="60%">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action='url'
        :data="expofiledata"
        :default-file-list="defaultUploadList"
        :file-list="fileList"
        :on-success="handleSuccess"
        :limit="1"
        :format="['properties','yaml','yml']"
        :on-exceed="onexceed"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">{{$t('list.select_files')}}</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">{{$t('list.upload_server')}}</el-button>
        <div slot="tip" class="el-upload__tip">{{$t('message.list_config_content')}}</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogExpoClose">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--迁入配置-->
    <el-dialog
      :title="$t('list.import_config')"
      :visible.sync="dialogImportVisible"
      @close="dialogExpoClose"
      :before-close="beforeClose"
      width="60%">
      <el-upload
        class="upload-demo"
        ref="upload2"
        :action='url2'
        :data="expofiledata"
        :default-file-list="defaultUploadList"
        :file-list="fileList"
        :on-success="handleSuccess"
        :limit="1"
        :format="['json']"
        :on-exceed="onexceed"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">{{$t('list.select_files')}}</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">{{$t('list.upload_server')}}</el-button>
        <div slot="tip" class="el-upload__tip">{{$t('message.list_config_content_2')}}</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogExpoClose">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--添加版本号弹框-->
    <el-dialog
      :title="$t('tags.add_version')"
      :visible.sync="dialogAddVersionVisible" @close="resetForm('ruleAddVersionFormTag')"
      width="60%">
      <el-form :model="ruleAddVersionFormTag" :rules="addVersionRulesTag" ref="ruleAddVersionFormTag" label-width="100px" class="dialogStyle">
        <el-form-item :label="$t('tags.select_version')" prop="version">
          <el-input v-model="ruleAddVersionFormTag.version" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tags.remark')" prop="remark">
          <el-input v-model="ruleAddVersionFormTag.remark" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button class="dialogButtonB" type="primary" @click="submitVersionForm('ruleAddVersionFormTag')">{{$t('common.create_now')}}</el-button>
          <el-button class="dialogButtonW" @click="dialogAddVersionVisible=false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import util from '../../utils/util.js'
  import {ORDER_TYPE} from '@/constants'
  export default {
    name: 'indexList',
    data () {
      return {
        // tab标记
        tabName: 'json',
        // 编辑的路径数据
        savePathData: '',
        // 编辑路径dialog状态
        dialogEditPathVisible: false,
        // tag是否切换
        isTagChange: false,
        // 未发布数据个数
        unPushCount: 0,
        // 离开页面提示信息
        leavePage_message: this.$t('message.leavePage_message'),
        projectConfigList: [],
        configDetailList: [],
        // 配置项dialog状态
        dialogEditVisible: false,
        dialogAddVisible: false, // 新增配置
        dialogImportVisible: false, // 迁入dialog
        dialogExpoVisible: false, // 导入配置
        dialogAddVersionVisible: false, // 添加版本号
        profiledata: {
          f_eq_projectId: this.$route.params.mark,
          f_eq_version: '',
          paging: false
        },
        updateTime: 0, // 发布时间
        pageLoading: false, // 主页面加载遮罩
        listLoading: false, // 配置项页面加载遮罩
        versionLoading: false, // 版本号加载遮罩
        activeName: '',
        formInline: {
          paging: false,
          f_eq_projectId: this.$route.params.mark,
          f_like_configKey: '',
          'f_eq_profile.id': '',
          'orderType': 0
        },
        // 新增/编辑配置
        configSaveForm: {
          id: '',
          projectId: this.$route.params.mark,
          configKey: '',
          configValue: '',
          profileId: '',
          remark: '',
          version:''
        },
        // 版本号数据集
        list_version: [],
        ActiveVersion: {
          version: ''
        },
        // 文件新增/编辑
        saveConfigFile: {
          id: '',
          name: '',
          path: '',
          projectId: this.$route.params.mark,
          version: '',
          profileType: '' // 类型
        },
        // 项目详细信息
        projectDetail: {
          name: '',
          mark: '',
          createTime: 0,
          creatorName: ''
        },
        // 添加版本号
        ruleAddVersionFormTag: {
          id: '',
          projectId: this.$route.params.mark,
          version: '',
          active: '0',
          remark: ''
        },
        // 导入begin
        defaultUploadList: [],
        fileList: [],
        url: this.g_Config.BASE_URL + '/files/config_file_import',
        url2: this.g_Config.BASE_URL + '/configs/import',
        expofiledata: {
          projectId: this.$route.params.mark,
          version: ''
        },
        // 导入end
      }
    },
    mounted () {
      // 查询修改个数
      this.getUnPushCountMethod()
      // 版本号查询
      this.getVersionList()
      // 配置项查询
      this.getProjectDetailMethod()
      // 发布时间查询
      this.getpublish()
    },
    beforeDestroy () {
      debugger
      if (this.unPushCount > 0) {
        this.$message({
          type: 'warning',
          message: this.leavePage_message
        })
      }
    },
    computed: {
      // 添加配置文件验证
      addFormRulesTag () {
        return {
          name: [
            {required: true, message: this.$t('message.file_name'), trigger: 'change'}
          ]
        }
      },
      // 添加版本号验证
      addVersionRulesTag () {
        return {
          version: [
            { required: true, validator: this.validateMark, trigger: 'blur' }
          ]
        }
      },
      // 配置项保存验证
      saveFormRules () {
        return {
          configKey: [
            {required: true, message: this.$t('message.checkConfigKey'), trigger: 'blur'}
          ],
          configValue:
            [
              {required: true, message: this.$t('message.value'), trigger: 'blur'}
            ]
        }
      }
    },
    methods: {
      ...mapActions([
        'getprofiles',
        'getProjectsConfigList',
        'getdelConfig',
        'getProjectsShow',
        'getversion',
        'getpushConfig',
        'getpublishtime',
        'getdelprofiles',
        'getAddConfig',
        'getaddversions',
        'getUnPushCountApi',
        'geteditConfig',
        'getaddprofiles',
        'geteditprofiles'
      ]),
      // tab切换
      tabClickMethod (val) {
        if (val.name == 'json') {
          this.getConfingListMethod('no')
        } else if (val.name == 'text') {

        }
      },
      // 获取未发布数据个数方法
      getUnPushCountMethod () {
        let params = Object.assign({projectId: this.formInline.f_eq_projectId, version: this.ActiveVersion.version})
        this.getUnPushCountApi(params).then(res => {
          if (res.data && res.data.result) {
            this.unPushCount = res.data.result
          } else {
            this.unPushCount = 0
          }
        })
      },
      // 发布状态展示转换
      conPushStatus (val) {
        let pushStatus = ['未发布', '已发布']
        return pushStatus[0] // val
      },
      // key状态展示转换
      conKeyStatus (val) {
        let pushStatus = ['新', '删', '改']
        return pushStatus[0] // val - 1
      },
      // 编辑路径方法 temp
      editPathMethod (val, path) {
        this.editTagMark = val
        this.savePathData = path
      },
      // 版本号切换方法
      versionChangeMethod () {
        this.getConfigFileMethod()
      },
      // 添加版本号
      addVersionMethod () {
        this.dialogAddVersionVisible = true
      },
      // 保存版本号
      submitVersionForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = Object.assign(this.ruleAddVersionFormTag)
            this.getaddversions(params).then(res => {
              if (res.data.code == '0' && res.data.status == 200) {
                this.$message({
                  type: 'success',
                  message: this.$t('message.add_success')
                })
                this.getVersionListBack()
                this.$refs[name].resetFields()
                this.dialogAddVersionVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: res.message || this.$t('message.add_error')
                })
              }
            })
          }
        })
      },
      // 新增配置项
      addConfigMethod (val) {
        this.configSaveForm.id = ''
        this.configSaveForm.profileId = val
        this.configSaveForm.version = this.ActiveVersion.version
        this.dialogEditVisible = true
      },
      // 配置项查询排序
      handleSortChange({prop, order}) {
        this.isTagChange = false
        if (prop === 'configKey') {
          if (order === 'descending') {
            this.formInline.orderType = 2
          } else {
            this.formInline.orderType = 1
          }
        }else if (prop === 'updateTime') {
          if (order === 'descending') {
            this.formInline.orderType = 4
          } else {
            this.formInline.orderType = 3
          }
        }
        this.getConfingListMethod('no')
      },
      // 删除配置文件
      deleteConfigFile (val) {
        this.$confirm(this.$t('message.delete_file_content'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.ensure'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
          center: true
        }).then(() => {
          let params = Object.assign({id: val})
          this.getdelprofiles(params).then(res => {
            if (res.data.code  == '0' && res.data.status == 200) {
              this.$message({
                type: 'success',
                message: this.$t('message.delete_success')
              })
              this.getConfigFileMethod()
            } else {
              this.$message({
                type: 'error',
                message: res.data.message || this.$t('message.delete_error')
              })
            }
          })
        })
      },
      // 新增版本号数据回显
      getVersionListBack () {
        this.versionLoading = true
        let params = Object.assign({projectId: this.profiledata.f_eq_projectId})
        this.getversion(params).then(res => {
            if (res.data.result && res.data.result.length > 0) {
              this.list_version = res.data.result
              this.list_version.map(item => {
                if (item.active == 1) {
                  this.ActiveVersion.version =item.version
                }
              })
            } else {
              this.list_version = []
              this.ActiveVersion.version = ''
            }
          this.versionLoading = false
        })
      },
      // 获取版本号数据集
      getVersionList () {
        this.pageLoading = true
        let params = Object.assign({projectId: this.profiledata.f_eq_projectId})
        this.getversion(params).then(res => {
          if (res.data.result && res.data.result.length > 0) {
            this.list_version = res.data.result
            this.list_version.map(item => {
              if (item.active == 1) {
                this.ActiveVersion.version =item.version
              }
            })
          } else {
            this.list_version = []
            this.ActiveVersion.version = ''
          }
          this.getConfigFileMethod()
        })
      },
      // 获取项目详细信息方法
      getProjectDetailMethod () {
        let params = Object.assign({id: this.$route.params.id})
        this.getProjectsShow(params).then(res => {
          if (res.data && res.data.result) {
            this.projectDetail.name = res.data.result.name
            this.projectDetail.mark = res.data.result.mark
            this.projectDetail.createTime = res.data.result.createTime
            this.projectDetail.creatorName = res.data.result.creatorName
          } else {
            this.projectDetail.name = ''
            this.projectDetail.mark = ''
            this.projectDetail.createTime = 0
            this.projectDetail.creatorName = ''
          }
        })
      },
      // 获取配置文件方法
      getConfigFileMethod () {
        // 查询修改个数
        this.getUnPushCountMethod()
        this.profiledata.f_eq_version= this.ActiveVersion.version
        let params = Object.assign(this.profiledata)
        this.pageLoading = false
        this.getprofiles(params).then(res => {
          this.pageLoading = false
          if (res.data.result && res.data.result.data.length > 0) {
            this.activeName = res.data.result.data[0].id
            this.projectConfigList = res.data.result.data
            this.changeTagMethod(this.activeName)
          } else {
            this.activeName = ''
            this.projectConfigList = []
          }
        })
      },
      // 发布方法
      onConfigPushMethod () {
        let params = Object.assign({projectId: this.$route.params.mark, version: this.ActiveVersion.version})
        this.getpushConfig(params).then(res => {
          if(res.data.status == 200 && res.data.code == 0){
            this.$message({
              message: this.$t('message.push_success'),
              type: 'success'
            })
            this.getConfingListMethod()
          }else{
            if(res.data.status == 1005){
              this.$message({
                message: res.message || this.$t('message.NO_CONFIGS_TO_PUBLISH'),
                type: 'error'
              })
            }
          }
          this.getpublish()
        })
      },
      // 获取发布时间
      getpublish () {
        let para = Object.assign({projectId: this.$route.params.mark, version: this.ActiveVersion.version})
        this.getpublishtime(para).then(res => {
          this.updateTime = res.data.result
        })
      },
      // 导入begin
      // 迁入方法
      importFiles() {
        this.expofiledata.version = this.ActiveVersion.version
        this.dialogImportVisible = true
      },
      // 迁出方法
      exportFiles() {
        window.open(this.g_Config.BASE_URL+`/configs/export/${this.ruleAddForm.projectId}/${this.ActiveVersion.version}`)
      },
      // 导入配置
      expoFiles() {
        this.expofiledata.version = this.ActiveVersion.version
        this.dialogExpoVisible = true
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      submitUpload2 () {
        this.$refs.upload2.submit()
      },
      // 导入dialog关闭方法
      dialogExpoClose () {
        this.dialogExpoVisible = false
        this.dialogImportVisible = false
        this.defaultUploadList = []
        this.fileList = []
      },
      // 导入dialog关闭前方法
      beforeClose (done) {
        this.defaultUploadList = []
        this.fileList = []
        done()
      },
      // 导入成功回调函数
      handleSuccess (file) {
        if (file.status == '200') {
          if(file.code == 0){
            this.$message({
              message: this.$t('message.success'),
              type: 'success'
            })
          }else {
            this.$message({
              message: file.message || this.$t('message.fail'),
              type: 'error'
            })
          }
        }else if(file.status == 1001 || file.status == 1002){
          this.$message.error(this.$t('message.fail'))
        }else if(file.status == 1004){
          this.$message.error(this.$t('message.duplicated_profile'))
        }else if(file.status == 1005){
          this.$message.error(this.$t('message.NO_CONFIGS_TO_PUBLISH'))
        }else if(file.status == 1003){
          this.$message.error(this.$t('message.INVALID_CONFIG_FILE_KEY'))
        }else{
          this.$message.error(this.$t('message.fail'))
        }
        this.dialogExpoVisible = false
        this.dialogImportVisible = false
        this.getConfigFileMethod()
        this.defaultUploadList = []
        this.fileList = []
      },
      onexceed (files, fileList) {
        this.$message({
          message: this.$t('message.only_upload_file'),
          type: 'warning'
        })
      },
      // 导入end
      // 配置项查询方法
      getConfingListMethod (searchCount) {
        if (searchCount != 'no') {
          // 查询修改个数
          this.getUnPushCountMethod()
        }
        this.listLoading = true
        let params = Object.assign(this.formInline)
        this.getProjectsConfigList(params).then(res => {
          this.listLoading = false
          if (res.data.result && res.data.result.data.length > 0) {
            this.configDetailList = res.data.result.data
          } else {
            this.configDetailList = []
          }
        })
      },
      // tag改变方法
      changeTagMethod (val) {
        this.isTagChange = true
        this.formInline['f_eq_profile.id'] = val
        this.formInline.orderType = 0
        this.getConfingListMethod('no')
      },
      // 新增配置文件
      onFilesClick () {
        this.dialogAddVisible = true
      },
      // 列表时间格式化方法
      timestampToTimeFun (val) {
        if (val) {
          return util.timestampToTime(val)
        } else {
          return '---'
        }
      },
      // dialog初始化方法
      resetForm (name) {
        if (this.$refs[name]) {
          this.$refs[name].resetFields()
        }
        this[name].id = ''
        this[name].projectId = this.$route.params.mark
        this.saveConfigFile.profileType = '' // 类型

        this[name].version = ''
        this.configSaveForm.configKey = ''
        this.configSaveForm.configValue = ''
        this.configSaveForm.profileId = ''
        this.configSaveForm.remark = ''

        this.saveConfigFile.name = ''
        this.saveConfigFile.path = ''
      },
      // 编辑配置项方法
      handleEdit (index, row) {
        // 修改数据赋值
        this.configSaveForm = Object.assign(this.configSaveForm, row)
        this.dialogEditVisible = true
      },
      // 删除配置项方法
      handleDelete (index, row) {
        this.$confirm(this.$t('message.delete_config_content'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.ensure'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
          center: true
        }).then(() => {
          this.getdelConfig(row).then(res => {
            if (res.data.code == '0' && res.data.status == 200) {
              this.$message({
                type: 'success',
                message: this.$t('message.delete_success')
              })
              this.getConfingListMethod()
            } else {
              this.$message({
                type: 'error',
                message: res.message || this.$t('message.delete_error')
              })
            }
          })
        }).catch((err) => {
          this.$message({
            type: 'error',
            message: err.message || this.$t('message.delete_error')
          })
        })
      },
      // 编辑配置文件
      editConfigFileMethod (val) {
        /* this.saveConfigFile.id = val.id
        this.saveConfigFile.name = val.name
        this.saveConfigFile.path = val.path
        this.saveConfigFile.projectId = val.projectId
        this.saveConfigFile.version = val.version
        this.saveConfigFile.profileType = val.profileType */
        this.saveConfigFile = Object.assign(this.saveConfigFile, val)
        this.dialogAddVisible = true
      },
      // 保存配置文件
      submitFileForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.saveConfigFile.id == '') {
              this.saveConfigFile.version = this.ActiveVersion.version
              let params = Object.assign(this.saveConfigFile)
              this.getaddprofiles(params).then(res => {
                if (res.data.code == '0' && res.data.status == 200) {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.add_success')
                  })
                  this.dialogAddVisible = false
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.message || this.$t('message.add_error')
                  })
                  this.dialogAddVisible = false
                }
              })
            } else {
              let params = Object.assign({
                id: this.saveConfigFile.id,
                name: this.saveConfigFile.name,
                projectId: this.saveConfigFile.projectId,
                path: this.saveConfigFile.profileType == 'bootstrap' ? undefined : this.saveConfigFile.projectId,
                version: this.ActiveVersion.version
              })
              this.geteditprofiles(params).then(res => {
                if (res.data.code == '0' && res.data.status == 200) {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.edit_success')
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.message || this.$t('message.edit_error')
                  })
                }
              })
            }
          }
        })
      },
      // 保存配置项
      submitForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.configSaveForm.id == '') {
              let params = Object.assign(this.configSaveForm)
              this.getAddConfig(params).then(res => {
                if(res.data.status == 200 && res.data.code == 0){
                  this.$message({
                    type: 'success',
                    message: this.$t('message.add_success')
                  })
                  if (this.configSaveForm.profileId == this.formInline['f_eq_profile.id']) {
                    this.getConfingListMethod()
                  } else {
                    // 查询修改个数
                    this.getUnPushCountMethod()
                  }
                  if (this.$refs[name]) {
                    this.$refs[name].resetFields()
                  }
                  this.dialogEditVisible = false
                }else{
                  if(res.data.status == 1001){
                    this.$message({
                      type: 'error',
                      message: res.message || this.$t('message.duplicated_profile')
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.message || this.$t('message.add_error')
                    })
                  }
                }
              })
            } else {
              this.configSaveForm.version = this.ActiveVersion.version
              let params = Object.assign(this.configSaveForm)
              this.geteditConfig(params).then(res => {
                if(res.data.status == 200 && res.data.code == 0){
                  this.$message({
                    type: 'success',
                    message: this.$t('message.edit_success')
                  })
                  this.getConfingListMethod()
                  if (this.$refs[name]) {
                    this.$refs[name].resetFields()
                  }
                  this.dialogEditVisible = false
                }else{
                  if(res.data.status == 1001){
                    this.$message({
                      type: 'error',
                      message: res.message || this.$t('message.duplicated_profile')
                    })
                  } else {
                    this.$message({
                      type: 'error',
                      message: res.message || this.$t('message.edit_error')
                    })
                  }
                }
              })
            }
          }
        })
      },
      // 添加版本号验证
      validateMark (rule, value, callback) {
        let myreg1 = /^\d+(\.\d+)*/
        if (!myreg1.test(value) && value != '') {
          callback(new Error(this.$t('message.enterVersion')))
        } else if (value === '') {
          callback(new Error(this.$t('message.version')))
        } else {
          callback()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  // 主体区域样式
  .content-style {
    background-color: #ffffff;
    flex: 1;
    margin: 0 10px 10px 10px;
    /deep/.el-collapse-item__header{
      padding-left: 1.5%;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #4A525E;
      letter-spacing: 0;
    }
  }
  // 主题区域div样式
  .content-div-style {
    margin: 0 1.5%;
    overflow-y: auto;
    height: 400px;
    /deep/ .el-tabs__content {
      margin-top: 0;
    }
  }
  .main {
    background-color: #f0f4f8;
    height: 100vh - 6.5;
    display: flex;
    flex-direction: column;
  }
  // 列表头样式
  .title-div-style {
    background-color: #ffffff;
    height: 110px;
    margin: 10px;
  }
  // 项目信息标题样式
  .list-title-style {
    margin-left: 1.5%;
    margin-top: 14px;
    /deep/ .el-tag--medium {
      height: 20px;
      line-height: 18px;
    }
    /deep/ .el-tag {
      border-radius: 100px;
      background-color: #FF9A39;
      border: 1px solid #FF9A39;
      color: #ffffff;
    }
  }
  // 列表标题样式
  .project-list-style {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #4A525E;
    letter-spacing: 0;
    border-bottom: solid 1px #EDEFF4;
    min-height: 46px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .project-list-style > div:nth-last-child(1){
    margin-top: 6px;
  }
    // 项目信息摘要样式
  .project-info-style {
    min-height: 85px;
    padding-top: 24px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #4A525E;
    letter-spacing: 0;
  }
  .tableLastButtonStyleB {
    margin: 0 20px 0 0;
  }
  .tableLastButtonStyleW {
    margin: 0 10px 0 0;
  }
  .tableLastButtonStyleWLast {
    margin: 0 20px 0 0;
  }
  // 发布icon样式
  .icon-ic-release:before {
    margin-right: -10px;
    margin-left: -10px;
  }
  // 新增配置ions样式
  .icon-ic-new:before {
    margin-right: 5px;
  }
  // 导入ions样式
  .icon-ic-import:before {
    margin-right: 5px;
  }
  // 导出ions样式
  .icon-ic-export:before {
    margin-right: 5px;
  }
  // 项目详细信息样式
  .project-detail-style {
    margin-top: 2px;
    margin-left: 1.5%;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #7E828C;
    letter-spacing: 0;
    text-align: right;
  }
  .project-detail-style > span {
    color: #333333;
  }
  // 版本号搜索样式
  .project-version-style {
    margin-top: -8px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #7E828C;
    letter-spacing: 0;
    text-align: right;
  }
  // 版本号下拉框样式
  .project-version-style {
    /deep/.el-input__inner {
      height: 32px;
      width: 150px;
    }
    /deep/.el-input__icon {
      line-height: 32px;
    }
  }
  // 配置文件tag操作栏样式
  .config-file-title {
    margin-top: -40px;
    /deep/.el-input__inner {
      height: 32px;
      width: 200px;
      margin-top: -5px;
    }
  }
  // 发布状态tag样式
  .push-status {
    /deep/ .el-tag--medium {
      height: 24px;
      line-height: 22px;
    }
    /deep/ .el-tag {
      border-radius: 100px;
      background-color: #ffffff;
      width: 60px;
      border: 1px solid #FF9A39;
      color: #FF9A39;
    }
  }
  .y-push-status {
    /deep/ .el-tag {
      border: 1px solid #C8C8C8;
      color: #C8C8C8;
    }
  }
  // key状态样式
  .key-status {
    /deep/ .el-tag--medium {
      height: 20px;
      line-height: 20px;
    }
    /deep/ .el-tag {
      border-radius: 0;
      background-color: #ffffff;
      width: 20px;
      padding: 0 3px;
      border: 1px solid #64C42D;
      color: #64C42D;
    }
  }
  .d-key-status {
    /deep/ .el-tag {
      border: 1px solid #F76B68;
      color: #F76B68;
    }
  }
  .m-key-status {
    /deep/ .el-tag {
      border: 1px solid #358FEB;
      color: #358FEB;
    }
  }
  // 列表value字段tag样式
  .value-tag-style {
    /deep/ .el-tag {
      background-color: #ffffff;
      border: 1px solid #DFE6ED;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #626469;
      letter-spacing: 0.86px;
    }
    /deep/ .el-tag:hover {
      background: #ECF5FF;
      border: 1px solid #CAE4FF;
      color: #409EFF;
    }
  }
  // popover样式
  .popover-style {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #409EFF;
  }
  // 配置项搜索框样式
  .search-config-style {
    width: 200px;
    float: right;
    line-height: 32px;
    margin-right: 10px;
    /deep/.el-input__icon {
      line-height: 32px;
    }
  }
  /deep/ .table-sort-style {
    .el-table .descending .sort-caret.descending {
      border-top-color: #c0c4cc;
    }
    .el-table .ascending .sort-caret.ascending {
      border-bottom-color: #c0c4cc;
    }
  }
  // 标记标签样式
  .edit-icon-style {
    margin-left: 10px;
    font-size: 12px;
    color: #016AD5;
  }
  // 表格样式
  /deep/ .table-div-style {
    .el-table {
      font-size: 12px;
    }
    .el-table th {
      background-color:  #F9FBFD;
      line-height: 36px;
      padding: 0;
    }
  }
</style>
