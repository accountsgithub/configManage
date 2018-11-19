<template>
  <el-row class="main" v-loading="pageLoading">
    <div class="title-div-style">
      <div class="project-list-style">
        <div class="list-title-style">
          <span>{{$t('list.project_info')}}</span>
        </div>
        <div>
          <el-button class="tableLastButtonStyleB icon iconfont icon-ic-release" type="primary" @click="onConfigPushClick">{{$t('list.push')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-new" type="primary" @click="onFilesClick">{{$t('list.addFile_button')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-import" type="primary" @click="expoFiles">{{$t('list.expo_config')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-export" type="primary" @click="exportFiles">{{$t('list.export_config')}}</el-button>
          <el-button class="tableLastButtonStyleW icon iconfont icon-ic-import" type="primary" @click="importFiles">{{$t('list.import_config')}}</el-button>
        </div>
      </div>
      <div class="project-info-style">
        <span class="project-detail-style">{{$t('list.project_info')}}： <span>{{projectDetail.name}}</span></span>
        <span class="project-detail-style">{{$t('index.unique_identification')}}： <span>{{projectDetail.mark}}</span></span>
        <span class="project-detail-style">{{$t('list.project_leader')}}： <span>{{projectDetail.creatorName}}</span></span>
        <span class="project-detail-style">{{$t('list.puth_time')}}： <span>{{timestampToTimeFun(projectDetail.createTime)}}</span></span>
        <div class="project-version-style">
          <span>{{$t('list.version')}}：</span>
          <el-select v-model="ActiveVersion.version">
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
      <el-collapse v-model="activeName" accordion @change="changeTagMethod">
        <el-collapse-item v-for="item in projectConfigList" :title="item.name" :name="item.id">
          <template slot="title">
            <span>{{item.name}}</span><span style="font-size: 12px;margin-left: 4.2%">{{$t('list.project_path')}}：{{item.path}}</span>
          </template>
          <div class="content-div-style" v-loading="listLoading">
            <el-table :data="configDetailList" style="width: 100%" :border="false" >
              <el-table-column label="Key" prop="configKey" sortable="custom" min-width="180" align="center" class="fontBlod fontSizeBtB12">
                <template slot-scope="scope">
                  <span style="margin-left: 10px" class="overKeyWidth">{{ scope.row.configKey }}</span>
                  <i class="icon iconfont icon-ic-edit"></i>
                  <!--<el-input :placeholder="$t('list.searchFrom_place')"></el-input>-->
                </template>
              </el-table-column>
              <el-table-column label="Value" min-width="180" align="center">
                <template slot-scope="scope">
                  <el-tag size="medium">{{ scope.row.configValue }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('list.modify_time')" prop="updateTime" sortable="custom" min-width="180" align="center">
                <template slot-scope="scope">
                  <el-tag size="medium">{{ timestampToTimeFun(scope.row.updateTime) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column :label="$t('list.remarks')" min-width="180" align="center">
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
        </el-collapse-item>
      </el-collapse>
    </div>

    <!--修改配置-->
    <el-dialog
      :title="$t('list.edit_config')"
      :visible.sync="dialogEditVisible" @close="resetForm('ruleEditForm')"
      width="50%">
      <el-form :model="ruleEditForm" :rules="editFormRules" ref="ruleEditForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="Key" prop="configKey">
          <el-input v-model="ruleEditForm.configKey"  auto-complete="off" maxlength="253"></el-input>
        </el-form-item>
        <el-form-item label="Value" prop="configValue">
          <el-input type="textarea" v-model="ruleEditForm.configValue"  rows="5" maxlength="4096"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.file')" prop="profileId">
          <el-select v-model="ruleEditForm.profileId" :disabled=true>
            <el-option v-for="(item,index) in projectConfigList"
                       :key="index"
                       :value="item.id"
                       :label="item.name">
              {{item.name}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('list.remarks')" prop="remark">
          <el-input type="textarea"
                    v-model="ruleEditForm.remark"
                    :autosize="{ minRows: 4, maxRows: 4}" maxlength="4096">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleEditForm')" class="dialogButtonB">{{$t('common.modify_now')}}</el-button>
        <el-button @click="dialogEditVisible=false" class="dialogButtonW">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--添加文件弹框-->
    <el-dialog
      :title="$t('tags.add_file')"
      :visible.sync="dialogAddVisible" @close="resetForm('ruleAddFormTag')"
      width="60%">
      <el-form :model="ruleAddFormTag" :rules="addFormRulesTag" ref="ruleAddFormTag" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('tags.file_name')" prop="name">
          <el-input v-model="ruleAddFormTag.name" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
        <el-form-item :class="{disStyle:disAddFilePath}" :label="$t('tags.file_path')" prop="path">
          <el-input v-model="ruleAddFormTag.path" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button class="dialogButtonB" type="primary" @click="submitForm('ruleAddFormTag')">{{$t('common.create_now')}}</el-button>
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
        :on-preview="handlePreview"
        :on-remove="handleRemove"
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
      :visible.sync="dialogImportVisible" @close="dialogExpoClose"
      :before-close="beforeClose"
      width="60%">
      <el-upload
        class="upload-demo"
        ref="upload2"
        :action='url2'
        :data="expofiledata"
        :default-file-list="defaultUploadList"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
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
    <!--    &lt;!&ndash;添加配置&ndash;&gt;
        <el-dialog
          :title="$t('list.add_config')"
          :visible.sync="dialogAddVisible" @close="resetForm('ruleAddForm')" @open="openAddForm"
          width="60%">
          <el-form :model="ruleAddForm" :rules="addFormRules" ref="ruleAddForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="Key" prop="configKey" class="fontSize12">
              <el-input v-model="ruleAddForm.configKey" auto-complete="off" maxlength="253"></el-input>
            </el-form-item>
            <el-form-item label="Value" prop="configValue">
              <el-input type="textarea" v-model="ruleAddForm.configValue" rows="5" maxlength="4096"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.file')" prop="profileId">
              <el-select v-model="ruleAddForm.profileId" :disabled=true>
                <el-option v-for="(item,index) in list_files" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('list.remarks')" prop="remark">
              <el-input type="textarea"
                        v-model="ruleAddForm.remark"
                        :autosize="{ minRows: 4, maxRows: 4}" maxlength="4096">
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleAddForm')" class="dialogButtonB">{{$t('common.create_now')}}</el-button>
            <el-button @click="dialogAddVisible=false" class="dialogButtonW">{{$t('common.cancel')}}</el-button>
          </span>
        </el-dialog>

        &lt;!&ndash;修改配置&ndash;&gt;
        <el-dialog
          :title="$t('list.edit_config')"
          :visible.sync="dialogEditVisible" @close="resetForm('ruleEditForm')"
          width="60%">
          <el-form :model="ruleEditForm" :rules="editFormRules" ref="ruleEditForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="Key" prop="configKey">
              <el-input v-model="ruleEditForm.configKey"  auto-complete="off" maxlength="253"></el-input>
            </el-form-item>
            <el-form-item label="Value" prop="configValue">
              <el-input type="textarea" v-model="ruleEditForm.configValue"  rows="5" maxlength="4096"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.file')" prop="profileId">
              <el-select v-model="ruleEditForm.profileId" :disabled=true>
                <el-option v-for="(item,index) in list_files" :key="index" :value="item.id" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('list.remarks')" prop="remark">
              <el-input type="textarea"
                        v-model="ruleEditForm.remark"
                        :autosize="{ minRows: 4, maxRows: 4}" maxlength="4096">
              </el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleEditForm')" class="dialogButtonB">{{$t('common.modify_now')}}</el-button>
            <el-button @click="dialogEditVisible=false" class="dialogButtonW">{{$t('common.cancel')}}</el-button>
          </span>
        </el-dialog>

        &lt;!&ndash;秘钥验证弹窗&ndash;&gt;
        <el-dialog
          :title="$t('list.validate_key')"
          :visible.sync="dialogValidateKeyVisible" @close="resetKeyForm('ruleKeyForm')"
          width="30%">
          <el-form :model="ruleKeyForm" :rules="keyFormRules" ref="ruleKeyForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="唯一标识:" class="fontSize12">
              <el-input v-model="ruleKeyForm.mark" auto-complete="off"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="请输入秘钥:" class="fontSize12" prop="key">
              <el-input v-model="ruleKeyForm.key" auto-complete="off" maxlength="253" type="password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleShow('ruleKeyForm')" class="dialogButtonB">{{$t('common.ensure')}}</el-button>
            <el-button @click="resetKeyForm('ruleKeyForm')" class="dialogButtonW">{{$t('common.cancel')}}</el-button>
          </span>
        </el-dialog>

        &lt;!&ndash;导入配置&ndash;&gt;
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
            :on-preview="handlePreview"
            :on-remove="handleRemove"
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
        &lt;!&ndash;迁入配置&ndash;&gt;
        <el-dialog
          :title="$t('list.import_config')"
          :visible.sync="dialogImportVisible" @close="dialogExpoClose"
          :before-close="beforeClose"
          width="60%">
          <el-upload
            class="upload-demo"
            ref="upload2"
            :action='url2'
            :data="expofiledata"
            :default-file-list="defaultUploadList"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
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
        </el-dialog>-->
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
        projectConfigList: [],
        configDetailList: [],
        dialogAddVisible: false, // 新增配置
        dialogImportVisible: false, // 迁入dialog
        dialogExpoVisible: false, // 导入配置
        profiledata: {
          f_eq_projectId: this.$route.params.mark,
          f_eq_version: '',
          paging: false
        },
        pageLoading: false,
        listLoading: false,
        dialogEditVisible: false,
        activeName: '',
        formInline: {
          f_eq_projectId: '',
          f_eq_groupId: '',
          f_like_configKey: '',
          'f_eq_profile.id': '',
          'orderType': 0
        },
        // 新增/编辑配置
        ruleEditForm: {
          projectId: this.$route.params.mark,
          configKey: '',
          configValue: '',
          groupId: '',
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
        ruleAddFormTag: {
          id: '',
          name: '',
          path: '',
          projectId: this.$route.params.mark,
          version: ''
        },
        // 项目详细信息
        projectDetail: {
          name: '',
          mark: '',
          createTime: 0,
          creatorName: ''
        }
      }
    },
    mounted () {
      this.getVersionList()
      this.getProjectDetailMethod()
    },
    computed: {
      addFormRulesTag () {
        return {
          name: [
            {required: true, message: this.$t('message.file_name'), trigger: 'change'}
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
        'getversion'
      ]),
      // 获取版本号数据集
      getVersionList () {
        let paramts = Object.assign({projectId: this.profiledata.f_eq_projectId})
        debugger
        this.getversion(paramts).then(res => {
          if (res.data.result && res.data.result.length > 0) {
            this.list_version = res.data.result
            this.list_version.map(item => {
              if (item.active == 1) {
                this.ActiveVersion.version =item.id
              }
            })
          } else {
            this.list_version = []
            this.ActiveVersion.version = ''
          }
          this.getProjectConfigMethod()
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
      // 获取tag方法
      getProjectConfigMethod () {
        this.pageLoading = true
        this.profiledata.f_eq_version= this.ActiveVersion.version
        let params = Object.assign(this.profiledata)
        this.pageLoading = false
        this.getprofiles(params).then(res => {
          this.pageLoading = false
          if (res.data.result && res.data.result.data.length > 0) {
            this.activeName = res.data.result.data[0].id
            this.projectConfigList = res.data.result.data
            this.changeTagMethod()
          } else {
            this.activeName = ''
            this.projectConfigList = []
          }
        })
      },
      // tag改变方法
      changeTagMethod (val) {
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
      // 新增配置
      onFilesClick () {
        this.dialogAddVisible = true
      },
      // 迁入方法
      importFiles() {
        this.dialogImportVisible = true
      },
      // 迁出方法
      exportFiles() {
        window.open(this.g_Config.BASE_URL+`/configs/export/${   this.ruleAddForm.projectId  }/${  this.ActiveVersion.version}`)
      },
      // 导入配置
      expoFiles() {
        this.dialogExpoVisible = true
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
      },
      // 编辑配置方法
      handleEdit (index, row) {
        // 修改数据赋值
        this.ruleEditForm = Object.assign(this.ruleEditForm, row)
        this.ruleEditForm.groupId = parseInt(row.groupId)
        this.ruleEditForm.version = row.version
        this.dialogEditVisible = true
      },
      // 删除配置方法
      handleDelete (index, row) {
        this.$confirm(this.$t('message.delete_config_content'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.ensure'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
          center: true
        }).then(() => {
          this.getdelConfig(row).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('message.delete_success')
            })
            this.changeTagMethod()
          })
        }).catch(() => {

        })
      },
      // 保存配置
      submitForm (name) {
        this.ruleAddForm.version = this.ActiveVersion.version
        this.ruleEditForm.version = this.ActiveVersion.version
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'ruleAddForm') {
              let params = Object.assign(this.ruleAddForm)
              this.getAddConfig(params).then(res => {
                if(res.data.status == 200 && res.data.code == 0){
                  this.$message({
                    type: 'success',
                    message: this.$t('message.add_success')
                  })
                }else{
                  if(res.data.status == 1001){
                    this.$message.error(this.$t('message.duplicated_profile'))
                  }
                }
                this.getConfigList()
                if (this.$refs[name]) {
                  this.$refs[name].resetFields()
                }
                this.dialogAddVisible = false
              })
            } else if (name === 'ruleEditForm') {
              let params = Object.assign(this.ruleEditForm)
              this.geteditConfig(params).then(res => {
                if(res.data.status == 200 && res.data.code == 0){
                  this.$message({
                    type: 'success',
                    message: this.$t('message.edit_success')
                  })
                }else{
                  if(res.data.status == 1001){
                    this.$message.error(this.$t('message.duplicated_profile'))
                  }
                }
                this.getConfigList()
                if (this.$refs[name]) {
                  this.$refs[name].resetFields()
                }
                this.dialogEditVisible = false
              })
            }
          }
        })
      },
      // 配置保存验证
      editFormRules () {
        return {
          configKey: [
            {required: true, validator: this.checkConfigKey, trigger: 'blur'}
          ],
          configValue:
            [
              {required: true, message: this.$t('message.value'), trigger: 'blur'}
            ],
          profileId:
            [
              {required: true, message: this.$t('message.file'), trigger: 'blur'}
            ]
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
  //
  .list-title-style {
    margin-left: 1.5%;
    margin-top: 14px;
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
    margin: 0 20px 0 10px;
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
  .project-version-style {
    /deep/.el-input__inner {
      height: 32px;
      width: 150px;
    }
    /deep/.el-input__icon {
      line-height: 32px;
    }
  }
</style>
