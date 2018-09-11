<template>
  <section class="main">
    <div class="content-header">
      <div class="titleDiv">
        <div class="titleSpan">
          <span class="fontBlod fontSize14">{{$t('list.project_info')}}</span>
        </div>
      </div>
      <div class="lineStyle"></div>
      <div class="infoDiv fontSize12">
        <el-row class="infoRow">
          <el-col :span="4"><span class="fontSizeTitle12">{{$t('list.project_info')}}: </span><span class="fontSize12">{{projectName}}</span></el-col>
          <el-col :span="4"><span class="fontSizeTitle12">{{$t('index.unique_identification')}}: </span><span class="fontSize12">{{ruleAddForm.projectId}}</span></el-col>
          <el-col :span="4"><span class="fontSizeTitle12">{{$t('list.project_leader')}}: </span><span class="fontSize12">{{creatorName}}</span></el-col>
          <el-col :span="4"><span class="fontSizeTitle12">{{$t('list.puth_time')}}: </span><span class="fontSize12">{{ timestampToTimeFun(updateTime)}}</span></el-col>
          <el-col :span="4">
            <span class="fontSizeTitle12">{{$t('list.version')}}:</span>
            <el-select v-model="ActiveVersion.version" class="selectStyle" @change="getSelectVersion" >
              <el-option v-for="item in list_version" :key="item.id" :value="item.version" :label="item.version">
              </el-option>
            </el-select>
          </el-col>
          <el-button class="float-left fontSizeBtW12 addVersionButton" type="primary" icon="el-icon-plus" @click="onVersionClick">{{$t('common.addVersion')}}</el-button>
          <el-button class="float-left fontSizeBtW12 addVersionButton" type="primary" icon="el-icon-plus" @click="exportFiles">{{$t('list.export_config')}}</el-button>
          <el-button class="float-right fontSizeBtB12" type="primary" @click="importFiles" :class="{disStyle:disExportButton}">{{$t('list.import_config')}}</el-button>
        </el-row>
      </div>
    </div>
    <div class="content-table">
    <el-row class="titleLeft" style="padding-right: 22px;">
      <span class="fontBlod fontSize14">{{title}}</span>
      <el-button class="float-right fontSizeBtW12 addProfileButton" type="primary" icon="el-icon-plus" @click="onFilesClick">{{$t('common.add')}}</el-button>
      <el-button class="float-right fontSizeBtW12" type="primary" icon="el-icon-upload" @click="onConfigPushClick">{{$t('list.push')}}</el-button>
      <el-button class="float-right fontSizeBtB12" type="primary" @click="expoFiles">{{$t('list.expo_config')}}</el-button>

    </el-row>
        <!--表单-->

      <!--添加tags-->
      <el-row style="margin-left: 10px">
        <!--////-->
        <vue-tages ref="vueTags" :initValue.sync ="initValue" :source.sync="list_files" :confirm.sync="ruleKeyForm.confirm" :fileName.sync="fileName" :chooseVersion.sync="ActiveVersion.version" @getSelectVersion="getSelectVersion" @ontagclick="tagClick" @onChangeTagClick="onchangetag" @onChangeVersionClick="onchangeversion"></vue-tages>
      </el-row>

      <!--添加tags-->
      <el-row class="configRow">
        <el-col :span="6" :class="{disStyle:disTypeValue}"><span class="fontSizeTitle12">{{$t('list.project_type')}}: </span><span class="fontSize12">{{tabCheckType}}</span></el-col>
        <el-col :span="6" :class="{disStyle:disPathValue}" class="overListPathWidth"><span class="fontSizeTitle12">{{$t('list.project_path')}}: </span><span class="fontSize12">{{tabCheckPath}}</span></el-col>
        <el-button class="float-right fontSizeBtB12" :class="{disStyle:!tablaDivDefault}" icon="el-icon-edit" type="primary" @click="onConfigEdit">{{$t('list.text_edit')}}</el-button>
        <el-button class="float-right fontSizeBtB12" style="width: 97px" :class="{disStyle:!tablaDivDefault}" icon="el-icon-delete" type="primary" @click="delConfig">{{$t('list.delete_config')}}</el-button>
      </el-row>
      <div class="lineStyle"></div>
      <div :class="{disStyle:!disTextDiv}">
        <el-form :inline="true" :model="ruleTextAddForm" ref="ruleTextAddForm">
          <el-input class="textDivStyle" :disabled="disTextEdit"
                    type="textarea"
                    :autosize="{ minRows: 10, maxRows: 10}"
                    v-model="ruleTextAddForm.configValue" auto-complete="off"  maxlength="4096">
          </el-input>
          <el-button class="float-right buttonStyle fontSizeBtB12" :class="{disStyle:saveButton}" icon="el-icon-edit" type="primary" @click="textEdit" style="margin-right: 22px;">{{$t('list.text_edit')}}</el-button>
          <el-button class="float-right buttonStyle fontSizeBtW12" :class="{disStyle:!saveButton}" icon="el-icon-upload" type="primary" @click="textSave" style="margin-right: 22px;">{{$t('list.text_save')}}</el-button>
        </el-form>
      </div>
        <div :class="[{disStyle:disTextDiv},{disStyle:!tablaDivDefault}]">
          <el-form :inline="true" :model="formInline" class="text-right form-top">
            <span class="fontSize12 overListNameWidth" style="float: left;margin-top: 10px;font-weight: bold">{{this.ConfigData.name}}{{$t('list.listName')}}</span>
            <el-form-item prop="f_like_configKey">
              <el-input v-model="formInline.f_like_configKey" :placeholder="configSearch"  maxlength="4096"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="buttonConfigList" icon="el-icon-search" class="fontSizeBtB12">{{$t('common.search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onNewConfig" icon="el-icon-plus" class="fontSizeBtB12">{{$t('list.new_config')}}</el-button>
            </el-form-item>
          </el-form>
          <el-row class="line"></el-row>
          <el-table :data="index_configList" @sort-change="handleSortChange" style="width: 100%" border >
            <el-table-column label="Key" prop="configKey" sortable="custom" min-width="180" align="center" class="fontBlod fontSizeBtB12">
              <template slot-scope="scope">
                <span style="margin-left: 10px" class="overKeyWidth">{{ scope.row.configKey }}</span>
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
          <el-pagination class="paginationStyle" v-if="formModelData.total != 0" :current-page="formModelData.pageNo + 1" @size-change="sizeChange" @current-change="currentChange" :page-size="formModelData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formModelData.total"></el-pagination>
        </div>
    </div>

    <!--添加配置-->
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

    <!--修改配置-->
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

    <!--秘钥验证弹窗-->
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

  </section>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import vueTages from './vue-tags.vue'
  import util from '../../utils/util.js'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  import {ORDER_TYPE} from '@/constants'
  export default {
    name: 'indexList',
    data () {
      return {
        initValue: '0', ////
        ActiveVersion: {
          version: ''
        },
        ConfigData: {},
        tabCheckType: '',
        tabCheckPath: '',
        textConfigValue: '',
        filesID: '',
        fileName:'',
        saveButton: false,
        disTextDiv: false,
        disPathValue: true,
        disTypeValue: false,
        disExportButton:false,
        disTextEdit: true,
        tablaDivDefault: false,
        textValue: '',
        defaultUploadList: [],
        url: this.g_Config.BASE_URL + '/files/config_file_import',
        url2: this.g_Config.BASE_URL + '/configs/import',
        dialogExpoVisible: false,
        dialogImportVisible: false,
        fileList: [],
        projectName: '',
        creatorName: '',
        updateTime: '',
        dialogAddVisible: false,
        dialogEditVisible: false,
        dialogValidateKeyVisible: false,
        expofiledata: {
          projectId: '',
          version: ''
        },
        ruleKeyForm: {
          key: '',
          mark: '',
          confirm: ''
        },
        profiledata: {
          f_eq_projectId: this.$route.params.mark,
          f_eq_version: ''
        },
        formInline: {
          f_eq_projectId: '',
          f_eq_groupId: '0',
          f_like_configKey: '',
          'f_eq_profile.id': '',
          'orderType': 0
        },
        ruleTextAddForm: {
          id: '',
          projectId: this.$route.params.mark,
          configKey: 'text',
          configValue: '',
          groupId: '',
          profileId: '',
          remark: '',
          version:''
        },
        ruleAddForm: {
          projectId: this.$route.params.mark,
          configKey: '',
          configValue: '',
          groupId: '',
          profileId: '',
          remark: '',
          version:''
        },
        ruleEditForm: {
          projectId: this.$route.params.mark,
          configKey: '',
          configValue: '',
          groupId: '',
          profileId: '',
          remark: '',
          version:''
        },
        ruleVeriosn: {
          projectId: this.$route.params.mark,
          version: ''
        }
      }
    },
    methods: {
      ...mapActions([
        'getProjectsShow', 'getGroups', 'getProjectsConfigList', 'getAddConfig', 'getdelprofiles', 'getdelConfig', 'geteditConfig', 'getpushConfig', 'getprofiles', 'getpublishtime', 'getProjectsConfigShow', 'getversion', 'getactiveversion', 'getValidateKey'
      ]),
      handleSortChange({prop, order}) {
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
        this.getConfigList()
      },
      textEdit () {
        this.disTextEdit = false
        this.saveButton = true
      },
      textSave () {
        this.disTextEdit = true
        this.saveButton = false
        if (this.ruleTextAddForm.id != '') {
          let params = Object.assign(this.ruleTextAddForm)
          this.geteditConfig(params).then(res => {
            this.$message({
              type: 'success',
              message: this.$t('message.edit_success')
            })
          })
        } else {
          this.ruleTextAddForm.profileId = this.filesID
          this.ruleTextAddForm.version = this.ActiveVersion.version
          let params = Object.assign(this.ruleTextAddForm)
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
          })
          this.getTextConfigList()
        }
      },
      onexceed (files, fileList) {
        this.$message({
          message: this.$t('message.only_upload_file'),
          type: 'warning'
        })
      },
      getCurrentProFiles () {
        this.initValue = '0'
        this.disPathValue = true
        this.disTypeValue = true
        this.profiledata.f_eq_version = this.ActiveVersion.version
        let params = Object.assign(this.profiledata)
        this.getprofiles(params).then(res => {
         if(res.data.result.total == 0){
           this.disExportButton = true
         }else {
           if (this.initValue == '0') { ////
             this.tagClick(res.data.result.data[0], 0)
           }
           this.disExportButton = false
         }
        })
      },
      getCurrentVersion () {
        return this.ActiveVersion.version
      },
      getSelectVersion () {
        this.getCurrentProFiles()
        this.disTextDiv = false
        this.tablaDivDefault = false
        // this.disPathValue = true
        // this.disTypeValue = true
        this.expofiledata.version = this.getCurrentVersion()
        this.getpublish()
      },
      dialogExpoClose () {
        this.dialogExpoVisible = false
        this.dialogImportVisible = false
        this.defaultUploadList = []
        this.fileList = []
      },
      beforeClose (done) {
        this.defaultUploadList = []
        done()
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      submitUpload2 () {
        this.$refs.upload2.submit()
      },
      handleSuccess (file, fileList) {
        if (file.status == '200') {
          if(file.code == 0){
            this.$message({
              message: this.$t('message.success'),
              type: 'success'
            })
          }else {
            this.$message.error(this.$t('message.fail'))
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
        this.getConfigList()
        this.getCurrentProFiles()
        this.defaultUploadList = []
        this.fileList = []
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      timestampToTimeFun (val) {
        if (val) {
          return util.timestampToTime(val)
        } else {
          return '---'
        }
      },
      // groupId转分组名
      filterFuns (row) {
        return this.list_groups.filter(item => {
          if (item.value == row) {
            return item.name
          }
        })[0].name
      },
      getProjectsConfigListClick () {
        let params = Object.assign({id: this.$route.params.id})
        this.getProjectsConfigList(params)
      },
      getTextConfigList () {
        let params = Object.assign(this.formInline, this.formModelData)
        if (params.f_eq_groupId == 0) {
          params.f_eq_groupId = ''
        }
        this.getProjectsConfigList(params).then(res => {
          if (res.data.result.data.length > 0) {
            this.ruleTextAddForm = Object.assign(this.ruleTextAddForm, res.data.result.data[0])
          } else {
            this.ruleTextAddForm.projectId = this.$route.params.mark
            this.ruleTextAddForm.configKey = 'text'
            this.ruleTextAddForm.configValue = ''
            this.ruleTextAddForm.groupId = ''
            this.ruleTextAddForm.profileId = ''
            this.ruleTextAddForm.remark = ''
            this.ruleTextAddForm.id = ''
          }
        }).catch((e) => {
          this.ruleTextAddForm.projectId = this.$route.params.mark
          this.ruleTextAddForm.configKey = 'text'
          this.ruleTextAddForm.configValue = ''
          this.ruleTextAddForm.groupId = ''
          this.ruleTextAddForm.profileId = ''
          this.ruleTextAddForm.remark = ''
          this.ruleTextAddForm.id = ''
        })
      },
      getConfigList () {
        let params = Object.assign(this.formInline, this.formModelData)
        if (params.f_eq_groupId == 0) {
          params.f_eq_groupId = ''
        }
        this.getProjectsConfigList(params).then(res => {
          console.log(res)
        })
      },
      buttonConfigList () {
        this.formModelData.pageNo = 0
        this.getConfigList()
      },
      expoFiles() {
        this.dialogExpoVisible = true
      },
      importFiles() {
        this.dialogImportVisible = true
      },
      exportFiles() {
        console.log(this.g_Config.BASE_URL+`/configs/export/${   this.ruleAddForm.projectId  }/${  this.ActiveVersion.version}`)
        window.open(this.g_Config.BASE_URL+`/configs/export/${   this.ruleAddForm.projectId  }/${  this.ActiveVersion.version}`)
      },

      onFilesClick () {
        this.$refs['vueTags'].add()
      },
      onVersionClick () {
        this.$refs['vueTags'].addVersion()
      },
      onConfigEdit () {
        this.$refs['vueTags'].edit(this.ConfigData)
      },
      // onConfigPushClick() {
      //   this.ruleKeyForm.mark = this.$route.params.mark
      //   if(this.ruleKeyForm.confirm == 0 || this.ruleKeyForm.confirm == 1|| this.ruleKeyForm.confirm == 2|| this.ruleKeyForm.confirm == 3) {
      //     this.dialogValidateKeyVisible = false
      //     this.onConfigPush()
      //   }else{
      //     this.dialogValidateKeyVisible = true
      //   }
      // },
      onConfigPushClick() {
        this.ruleKeyForm.mark = this.$route.params.mark
          this.dialogValidateKeyVisible = false
          this.onConfigPush()
      },
      handleShow (name) {
        this.ruleKeyForm.mark = this.$route.params.mark
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.getValidateKey(this.ruleKeyForm).then(res => {
              this.dialogValidateKeyVisible = false
              if (res.data.result) {
                this.onConfigPush()
              }else{
                // this.$router.push({path: '/404'})
                this.$message.error(this.$t('message.badKey'))
              }
            })
          } else {
            return false
          }
        })
      },
      onConfigPush () {
        let params = Object.assign({projectId: this.$route.params.mark})
        params.version = this.ActiveVersion.version
        this.getpushConfig(params).then(res => {
          if(res.data.status == 200 && res.data.code == 0){
            this.$message({
              message: this.$t('message.push_success'),
              type: 'success'
            })
          }else{
            if(res.data.status == 1005){
              this.$message.error(this.$t('message.NO_CONFIGS_TO_PUBLISH'))
            }
          }
          this.getpublish()
        })
      },
      onNewConfig () {
        this.dialogAddVisible = true
      },
      handleEdit (index, row) {
        // 修改数据赋值
        this.dialogEditVisible = true
        this.ruleEditForm = Object.assign(this.ruleEditForm, row)
        this.ruleEditForm.groupId = parseInt(row.groupId)
        this.ruleEditForm.version = this.ActiveVersion.version
      },
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
            this.getConfigList()
          })
        }).catch(() => {

        })
      },
      sizeChange (val) {
        this.formModelData.pageSize = val
        this.getConfigList()
      },
      currentChange (val) {
        this.formModelData.pageNo = val
        this.getConfigList()
      },
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
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      openAddForm () {
        this.ruleAddForm.profileId = this.filesID
      },
      resetForm (name) {
        if (this.$refs[name]) {
          this.$refs[name].resetFields()
        }
      },
      resetKeyForm (name) {
        this.dialogValidateKeyVisible = false
        this.ruleKeyForm.key = ''
        this.resetForm(name)
      },
      tagClick (data) {
        this.initValue = '1' ////
        if (data) {
          this.ConfigData = data
          this.ConfigData.name = data.name
          this.ConfigData.profileType = data.profileType
          this.ConfigData.id = data.id
          this.ConfigData.path = data.path
          this.ConfigData.projectId = data.projectId
          this.ConfigData.version = data.version
          this.disTextEdit = true
          this.saveButton = false
          this.tablaDivDefault = true
          this.disTypeValue = false
          this.filesID = data.id
          this.fileName = data.name
          this.tabCheckType = data.profileType
          this.tabCheckPath = data.path
          if (data.profileType === 'text') {
            this.disTextDiv = true
            this.disPathValue = false
            this.formInline = Object.assign(this.formInline, {'f_eq_profile.id': data.id})
            this.getTextConfigList()
          } else {
            if (data.profileType === 'bootstrap') {
              this.disPathValue = true
            } else {
              this.disPathValue = false
            }
            this.disTextDiv = false
            this.formInline = Object.assign(this.formInline, {'f_eq_profile.id': data.id})
            this.getConfigList()
          }
        }
      },
      delConfig () {
        this.$confirm(this.$t('message.delete_file_content'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.ensure'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
          center: true
        }).then(() => {
          let params = Object.assign(this.ConfigData)
          this.getdelprofiles(params).then(res => {
            this.onchangetag()
            this.disTextDiv = false
            this.$message({
              type: 'success',
              message: this.$t('message.delete_success')
            })
          })
        })
      },
      onchangetag () {
        this.disTextDiv = false
        this.disTypeValue = true
        this.disPathValue = true
        this.tablaDivDefault = false
        this.tabCheckType = ''
        this.tabCheckPath = ''
        this.getCurrentProFiles()
      },
      onchangeversion () {
        let paramts = Object.assign(this.ruleVeriosn)
        this.getversion(paramts).then(res => {
          if (res.data.result) {
            this.list_version = res.data.result
          }
        })
      },
      getpublish () {
        let para = Object.assign({projectId: this.$route.params.mark})
        para.version = this.getCurrentVersion()
        this.getpublishtime(para).then(res => {
          this.updateTime = res.data.result
        })
      },
      getActiveVersion (paramts) {
        this.getactiveversion(paramts).then(res => {
          if (res.data.result) {
            this.ActiveVersion.version = res.data.result
          }
        })
      }
    },
    computed: {
      ...mapState({
        formModelData: (index) => index.config.formModelData,
        list_groups: (index) => index.config.list_groups,
        index_configList: (index) => index.config.index_configList,
        text_config: (index) => index.config.text_config,
        list_files: (index) => index.config.list_files,
        list_version: (index) => index.config.list_version,
        activeversion: (index) => index.config.activeversion
      }),
      title () {
        return this.$t('list.config_info')
      },
      configSearch () {
        return this.$t('list.config_Search')
      },
      addFormRules () {
        return {
          configKey: [
            {required: true, message: this.$t('message.checkConfigKey'), trigger: 'blur'}
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
      },
      keyFormRules () {
        return {
          key: [{required: true, message: this.$t('message.validateKey'), trigger: 'blur'}]
        }
      },
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
    },
    mounted() {
      let params = Object.assign({id: this.$route.params.id})
      this.getGroups()
      let params2 = Object.assign(this.ruleVeriosn)
      this.getversion(params2)
      this.getactiveversion(params2).then(res => {
        this.ActiveVersion.version = res.data.result
        this.expofiledata.version = this.ActiveVersion.version
        this.getCurrentProFiles()
      })
      this.getProjectsShow(params).then(res => {
        this.ruleKeyForm.confirm = res.data.result.confirm
        this.projectName = res.data.result.name
        this.creatorName = res.data.result.creatorName
        this.formInline.f_eq_projectId = res.data.result.mark
        this.expofiledata.projectId = res.data.result.mark
        this.expofiledata.version = this.ActiveVersion.version
        this.getpublish()
        this.getConfigList()
      })
    },
    components: {
      ElButton,
      vueTages
    }
  }
</script>

<style lang="less" scoped>
  .fontBlod {
    font-weight: bold;
  }
  .float-right {
    float: right;
  }
  .float-left {
    float: left;
  }
  .line{
    border: 1px solid #dedede;
    margin: 10px 0;
  }
  .el-dialog .el-input {
    width: 300px;
  }
  .demo-form-inline {
    margin-left: 20px;
  }
  .content-header{
    height: 113px;
    padding: 10px;
  }
  .content-table{
    background: #ffffff;
    margin: 20px 10px 10px 10px;
  }
  .lineStyle{
    width:100%;
    height:0px;
    border: solid #edeff4 1px;
  }
  .titleDiv{
    background: #ffffff;
    height: 45px;
  }
  .titleSpan{
    margin-left: 21px;
    padding-top: 13px;
  }
  .infoDiv{
    background: #ffffff;
  }
  .infoRow{
    width: 100%;
    height: 67px;
    padding: 22px;
    padding-left: 41px;
    padding-right: 22px;
  }
  .configRow{
    width: 100%;
    height: 58px;
    padding: 10px 0;
    padding-left: 41px;
    padding-right: 22px;
  }
  .titleLeft{
    padding-top: 13px;
    margin-left: 21px;
  }
  .disStyle{
    display: none;
  }
  .textDivStyle{
    padding-top: 10px;
    width: 60%;
  }
  .buttonStyle{
    margin-top: 10px;
  }
  .text-right {
    text-align: right;
  }
  .fontSize14{
    font-size: 14px;
    color: #4a525e;
  }
  .fontSize12{
    font-family:PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
  }
  .fontSizeTitle12{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#7e828c;
  }
  .fontSizeBtW12{
    font-size: 12px;
    color: #ffffff;
    background:#016ad5;
    border-radius:4px;
    width:80px;
    height:32px;
    margin-left: 10px;
  }
  .fontSizeBtB12{
    font-size: 12px;
    color:#666666;;
    background:#f0f4f8;
    border:1px solid #dfe6ed;
    border-radius:4px;
    width:80px;
    height:32px;
    margin-left: 10px;
  }
  .el-button {
    line-height: 0.5;
  }
  .el-table{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#909399;
    letter-spacing:0.86px;
    text-align:left;
  }
  .cell{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#606266;
    letter-spacing:0.86px;
    text-align:left;
  }
  .tableActionStyle{
    font-family:PingFangSC-Medium;
    font-size:12px;
    color:#016ad5;
    letter-spacing:0.86px;
    text-align:left;
  }
  .el-dialog__title{
    line-height: 24px;
    font-size: 16px;
    color: #333333;
  }
  .dialogButtonW {
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width:60px;
    height:32px;
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #606266;
    letter-spacing: 0;
    text-align: center;
  }
  .dialogButtonB{
    background:#016ad5;
    border-radius:4px;
    width:60px;
    height:32px;
    font-family:PingFangSC-Semibold;
    font-size:14px;
    color:#ffffff;
    letter-spacing:0;
    text-align:center;
  }
  .paginationStyle{
    text-align: right;
    padding-top: 20px;
    /deep/.el-pagination__total{
      font-size: 12px;
    };
    /deep/.el-input__inner{
      font-size: 12px;
    };
    /deep/.number{
      font-size: 12px;
    };
    /deep/.el-pagination__jump{
      font-size: 12px;
    };
  }
  .form-top{
    margin-top: 10px;
    width: 100%;
    height: 48px;
    padding-left: 41px;
    padding-right: 22px;
    /deep/.el-input__inner {
      background:#ffffff;
      border:1px solid #dcdfe6;
      border-radius:4px;
      width:170px;
      height:30px;
      font-size: 12px;
    }
    /deep/.el-form-item{
      margin-right: 0;
    }
  }
  .selectStyle {
    margin-top: -15px;
    width: 50%;
  }
  .addVersionButton {
    margin-left: -30px;
    margin-top: -10px;
    width: 100px;
  }
  .addProfileButton {
      width: 100px;
    }
  .overListNameWidth {
    max-width: 75%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .overListPathWidth {
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .overKeyWidth {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .overRemarkWidth {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
