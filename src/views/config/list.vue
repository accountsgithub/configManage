<template>
  <el-row class="main" v-loading="pageLoading">
    <div class="title-div-style">
      <!--操作栏-->
      <div class="project-list-style">
        <div class="list-title-style">
          <span>{{$t('list.project_info')}}<el-tag v-if="unPushCount&&unPushCount > 0" size="medium" style="margin-left:20px;">{{$t('common.modify')}}{{unPushCount}}</el-tag></span>
        </div>
        <div>
          <el-button :disabled="unPushCount < 1" class="tableLastButtonStyleB icon iconfont icon-ic-release" type="primary" @click="openPushJsonDialog">{{$t('list.push')}}</el-button>
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
            <div @keyup.enter.stop="">
              <!--编辑路径-->
              <span>{{item.name}}</span>
              <span v-if="item.profileType!='bootstrap'" class="path-label-style">{{$t('list.project_path')}}：</span>
              <span v-if="item.profileType!='bootstrap'" class="path-style">{{item.path}}</span>
              <!--<i class="icon iconfont icon-ic-edit edit-icon-style" @click="editPathMethod(item.id, item.path)" @click.stop=""></i>-->
              <!--tag操作栏-->
              <div class="config-file-title" @click.stop="">
                <el-button v-if="item.profileType == 'bootstrap' && activeName == item.id" class="tableLastButtonStyleB" type="primary" @click="addConfigMethod(item.id)">{{$t('list.addConfig_button')}}</el-button>
                <el-button :class="{tableLastButtonStyleW: true, tableLastButtonStyleWLast: tabName != 'json'||activeName != item.id||item.profileType != 'bootstrap'}" type="primary" @click="editConfigFileMethod(item)">{{$t('list.editConfigFile_title')}}</el-button>
                <el-button class="tableLastButtonStyleW" type="primary" @click="deleteConfigFile(item.id)">{{$t('common.delete')}}</el-button>
                <el-input v-if="tabName == 'json' && activeName == item.id" v-model="formInline.f_like_configKey" @keyup.enter.native="getConfingListMethod('no')" :placeholder="$t('list.searchFrom_place')" suffix-icon="el-icon-search" class="search-config-style"></el-input>
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
                  <el-table-column :label="$t('list.pushStatus_label')" prop="publish" min-width="10%" align="center" class="fontBlod fontSizeBtB12">
                    <template slot-scope="scope">
                      <div slot="reference" :class="{'push-status': true, 'y-push-status': scope.row.publish==1}">
                        <el-tag size="medium">{{conPushStatus(scope.row.publish)}}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="Key" prop="configKey" sortable="custom" min-width="17%" align="left">
                    <template slot-scope="scope">
                      <div slot="reference" :class="{'key-status': true, 'd-key-status': scope.row.operation==3, 'm-key-status': scope.row.operation==2}">
                        <el-popover v-if="scope.row.configKey&&scope.row.configKey.length>20" trigger="hover" placement="top">
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
                  <el-table-column label="Value" min-width="28%" align="left">
                    <template slot-scope="scope">
                      <el-popover v-if="scope.row.configValue&&scope.row.configValue.length>36" trigger="hover" placement="top">
                        <p class="popover-style">{{ scope.row.configValue }}</p>
                        <div slot="reference" class="value-tag-style">
                          <el-tag size="medium">{{ scope.row.configValue.substring(0,36) }}…</el-tag>
                        </div>
                      </el-popover>
                      <div v-else-if="scope.row.configValue" slot="reference" class="value-tag-style">
                        <el-tag size="medium">{{ scope.row.configValue }}</el-tag>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('list.modify_time')" prop="updateTime" sortable="custom" min-width="10%" align="center">
                    <template slot-scope="scope">
                      <span size="medium">{{ timestampToTimeFun(scope.row.updateTime) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('list.remarks')" prop="remark" min-width="20%" align="left">
                    <template slot-scope="scope">
                      <div slot="reference">
                        <el-popover v-if="scope.row.remark&&scope.row.remark.length>20" trigger="hover" placement="top">
                          <p class="popover-style">{{ scope.row.remark }}</p>
                          <div slot="reference">
                            <span size="medium">{{ scope.row.remark.substring(0,20) }}…</span>
                          </div>
                        </el-popover>
                        <div v-else >
                          <span class="overKeyWidth">{{ scope.row.remark }}</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('common.deal')"  min-width="15%" align="center">
                    <template slot-scope="scope">
                      <a v-if="scope.row.operation!=3" class="tableActionStyle" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</a>
                      <a v-if="scope.row.operation!=3" class="tableActionStyle" style="padding-left: 10px" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</a>
                    </template>
                  </el-table-column>
                </el-table>
                </div>
              </el-tab-pane>
              <el-tab-pane v-if="item.profileType!='bootstrap'" label="text" name="text">
                <div>
                  <el-form :inline="true" :model="ruleTextAddForm" ref="ruleTextAddForm">
                    <el-input class="textDivStyle" :disabled="editButtonShow"
                              type="textarea"
                              :autosize="{ minRows: 14, maxRows: 14}"
                              v-model="ruleTextAddForm.configValue" auto-complete="off" maxlength="4096">
                    </el-input>
                    <pre class="pre-display-style">{{configValuePre}}</pre>
                    <el-button v-if="editButtonShow" class="tableLastButtonStyleB" type="primary" @click="textEditMethod" style="margin-right: 22px;">{{$t('list.text_edit')}}</el-button>
                    <el-button v-else class="tableLastButtonStyleB" type="primary" @click="textSaveMethod(item)" style="margin-right: 22px;">{{$t('list.text_save')}}</el-button>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!--未发布数据列表-->
    <el-dialog
      :title="$t('list.push')"
      :visible.sync="pushJsonDialogVisible"
      @close="unPushJsonCloseMethod"
      width="60%">
      <div>
        <div class="table-div-style">
          <el-table class="table-sort-style" :data="unPushDataList" ref="unPushTable" :stripe="true" style="width: 100%" :border="false">
            <el-table-column label="Key" prop="configKey" min-width="15%" align="left">
              <template slot-scope="scope">
                <div slot="reference" :class="{'key-status': true, 'd-key-status': scope.row.operation==3, 'm-key-status': scope.row.operation==2}">
                  <el-popover v-if="scope.row.configKey&&scope.row.configKey.length>20" trigger="hover" placement="top">
                    <p class="popover-style">{{ scope.row.configKey }}</p>
                    <div slot="reference">
                      <span size="medium">{{ scope.row.configKey.substring(0,20) }}…</span>
                      <el-tag size="medium" style="margin-left: 10px;">{{conKeyStatus(scope.row.operation)}}</el-tag>
                    </div>
                  </el-popover>
                  <div v-else-if="scope.row.configKey&&scope.row.configKey.length>0" >
                    <span class="overKeyWidth">{{ scope.row.configKey }}</span>
                    <el-tag size="medium" style="margin-left: 10px;">{{conKeyStatus(scope.row.operation)}}</el-tag>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('list.originPush_label')" prop="effectiveValue" min-width="30%" align="left">
              <template slot-scope="scope">
                <el-popover v-if="scope.row.effectiveValue&&scope.row.effectiveValue.length>26" trigger="hover" placement="top">
                  <p class="popover-style">{{ scope.row.effectiveValue }}</p>
                  <div slot="reference" class="value-tag-style">
                    <span size="medium">{{ scope.row.effectiveValue.substring(0,26) }}…</span>
                  </div>
                </el-popover>
                <div v-else-if="scope.row.effectiveValue" slot="reference" class="value-tag-style">
                  <span size="medium">{{ scope.row.effectiveValue }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('list.unPush_label')" prop="ineffectiveValue" min-width="30%" align="left">
              <template slot-scope="scope">
                <el-popover v-if="scope.row.ineffectiveValue&&scope.row.ineffectiveValue.length>26" trigger="hover" placement="top">
                  <p class="popover-style">{{ scope.row.ineffectiveValue }}</p>
                  <div slot="reference" class="value-tag-style">
                    <span size="medium">{{ scope.row.ineffectiveValue.substring(0,26) }}…</span>
                  </div>
                </el-popover>
                <div v-else-if="scope.row.ineffectiveValue" slot="reference" class="value-tag-style">
                  <span size="medium">{{ scope.row.ineffectiveValue }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('list.modify_time')" prop="updateTime" min-width="15%" align="center">
              <template slot-scope="scope">
                <span size="medium">{{ timestampToTimeFun(scope.row.updateTime) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onConfigPushMethod" class="dialogButtonB">{{$t('list.push')}}</el-button>
        <el-button @click="pushJsonDialogVisible=false" class="dialogButtonW">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
    <!--添加配置项dialog-->
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
        <div v-if="saveConfigFile.profileType!='bootstrap'&&saveConfigFile.id==''" class="path-message-style">
          <span>{{$t('list.addPath_message')}}</span>
        </div>
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
      width="600px">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="url"
        drag
        with-credentials
        :data="expofiledata"
        :file-list="fileList"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-upload="beforeUpload"
        :on-change="uploadChange"
        :show-file-list="true"
        :limit="1"
        :format="['properties','yaml','yml','json','js']"
        :on-exceed="onexceed"
        :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('list.upload_message')}}<em>{{$t('list.upload_messageButton')}}</em></div>
        <div slot="tip" class="el-upload__tip">{{$t('message.list_config_content')}}</div>
      </el-upload>
      <div class="upload-path-style">
        <div>{{$t('list.project_path')}}:</div>
        <div>
          <el-input v-model="expofiledata.path" auto-complete="off" maxlength="4096" :placeholder="$t('list.uploadPath_place')"></el-input>
        </div>
      </div>
      <div class="path-message-style">
        <span>{{$t('list.path_message')}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialogButtonW" @click="dialogExpoClose">{{$t('common.cancel')}}</el-button>
        <el-button class="dialogButtonB":disabled="doubleDisable"  size="small" @click="submitUpload">{{$t('list.upload_server')}}</el-button>
      </span>
    </el-dialog>
    <!--迁入配置-->
    <el-dialog
      :title="$t('list.import_config')"
      :visible.sync="dialogImportVisible"
      @close="dialogExpoClose"
      width="600px">
      <el-upload
        class="upload-demo"
        ref="upload2"
        :action='url2'
        :data="expofiledata"
        :file-list="fileList"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-change="uploadChange"
        :before-upload="beforeUpload2"
        :limit="1"
        drag
        with-credentials
        :format="['json']"
        :on-exceed="onexceed"
        :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">{{$t('list.upload_message')}}<em>{{$t('list.upload_messageButton')}}</em></div>
        <div slot="tip" class="el-upload__tip">{{$t('message.list_config_content_2')}}</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button class="dialogButtonW" @click="dialogExpoClose">{{$t('common.cancel')}}</el-button>
        <el-button class="dialogButtonB":disabled="doubleDisable"  size="small" @click="submitUpload2">{{$t('list.upload_server')}}</el-button>
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
        // 未发布数据集
        unPushDataList: [],
        // 编辑数据index值
        jsonIndex: 0,
        // 发布弹窗状态
        pushJsonDialogVisible: false,
        // 配置文件上传路径
        configUploadPath: '',
        // 显示text编辑按键
        editButtonShow: true,
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
        // 查询数据集合
        formInline: {
          paging: false,
          f_eq_projectId: this.$route.params.mark,
          f_like_configKey: '',
          'f_eq_profile.id': '',
          'orderType': 0
        },
        // 临时存放testValue值
        configValuePre: null,
        // text数据集合
        ruleTextAddForm: {
          id: '',
          projectId: this.$route.params.mark,
          configKey: 'text',
          configValue: '',
          profileId: '',
          remark: '',
          version:''
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
        // 防止二次上传状态
        doubleDisable: false,
        fileList: [],
        fileListTemp: '',
        fileTemp: null,
        url: this.g_Config.BASE_URL + '/files/config_file_import',
        url2: this.g_Config.BASE_URL + '/configs/import',
        expofiledata: {
          projectId: this.$route.params.mark,
          path: '',
          version: ''
        },
        // 导入end
      }
    },
    mounted () {
      // 版本号查询
      this.getVersionList()
      // 详细信息查询
      this.getProjectDetailMethod()
    },
    beforeDestroy () {
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
        'geteditprofiles',
        'geteditConfig',
        'getAddConfig',
        'getUnPushListApi'
      ]),
      // 验证是否是json文件
      isJsonValidateMethod (val) {
        if (val.path) {
          let pathArray = val.path.split('.')
          let pathStr = pathArray.length > 0 ? pathArray[pathArray.length - 1] : ''
          return pathStr == 'json' || pathStr == 'JSON'
        }
      },
      // tab切换
      tabClickMethod (val) {
        if (val.name == 'json') {
          this.getConfingListMethod('no')
        } else if (val.name == 'text') {
          this.getTextConfigMethod()
        }
      },
      // text编辑方法
      textEditMethod () {
        this.editButtonShow = false
      },
      // text保存前验证方法
      textSaveMethod (val) {
        let isValidate = false
        if (val.path) {
          let pathArray = val.path.split('.')
          let pathStr = pathArray.length > 0 ? pathArray[pathArray.length - 1] : ''
          isValidate = pathStr == 'json' || pathStr == 'JSON'
        }
        if (isValidate) {
          try {
            if (this.ruleTextAddForm.configValue) {
              let configValueTemp = JSON.parse(this.ruleTextAddForm.configValue)
              if(!configValueTemp.length && !configValueTemp.isArray && Object.keys(configValueTemp).length > 0 && typeof configValueTemp == 'object' && configValueTemp ){
                this.configValuePre = configValueTemp

                this.$nextTick(() => {
                  let preValue = document.getElementsByClassName('pre-display-style')
                  if (preValue && preValue.length > 0) {
                    this.ruleTextAddForm.configValue = preValue[0].textContent
                  }
                  this.saveTextMethod(val)
                })
                /* let timeInit = setInterval(() => {
                  let preValue = document.getElementsByClassName('pre-display-style')
                  if (preValue && preValue.length > 0 && preValue[0].textContent == this.ruleTextAddForm.configValue) {
                    this.ruleTextAddForm.configValue = preValue[0].textContent
                    clearInterval(timeInit)
                  }
                },1) */
              } else {
                this.$message({
                  type: 'error',
                  message: this.$t('message.validateJson_message')
                })
              }
            }
          } catch (e) {
            this.$message({
              type: 'error',
              message: this.$t('message.validateJson_message')
            })
          }
        } else {
          this.saveTextMethod(val)
        }
      },
      // text保存方法
      saveTextMethod (val) {
        this.editButtonShow = true
        this.ruleTextAddForm.profileId = val.id
        if (this.ruleTextAddForm.id != '') {
          this.ruleTextAddForm.version = this.ActiveVersion.version
          let params = Object.assign(this.ruleTextAddForm)
          this.geteditConfig(params).then(res => {
            if (res.data.code == '0' && res.data.status == 200) {
              // 查询修改个数
              this.getUnPushCountMethod()
              this.getTextConfigMethod()
              this.$message({
                type: 'success',
                message: this.$t('message.edit_success')
              })
            }
          })
        } else {
          this.ruleTextAddForm.version = this.ActiveVersion.version
          let params = Object.assign(this.ruleTextAddForm)
          this.getAddConfig(params).then(res => {
            if (res.data.status == 200 && res.data.code == 0) {
              // 查询修改个数
              this.getUnPushCountMethod()
              this.getTextConfigMethod()
              this.$message({
                type: 'success',
                message: this.$t('message.add_success')
              })
            } else {
              if (res.data.status == 1001) {
                // 查询修改个数
                this.getUnPushCountMethod()
                this.getTextConfigMethod()
                this.$message.error(this.$t('message.duplicated_profile'))
              }
            }
          })
        }
      },
      // text查询方法
      getTextConfigMethod () {
        let params = Object.assign(this.formInline)
        this.getProjectsConfigList(params).then(res => {
          if (res.data.result.data.length > 0) {
            this.ruleTextAddForm = Object.assign(this.ruleTextAddForm, res.data.result.data[0])
          } else {
            this.ruleTextAddForm.projectId = this.$route.params.mark
            this.ruleTextAddForm.configKey = 'text'
            this.ruleTextAddForm.configValue = ''
            this.ruleTextAddForm.profileId = ''
            this.ruleTextAddForm.remark = ''
            this.ruleTextAddForm.id = ''
          }
        }).catch((e) => {
          this.ruleTextAddForm.projectId = this.$route.params.mark
          this.ruleTextAddForm.configKey = 'text'
          this.ruleTextAddForm.configValue = ''
          this.ruleTextAddForm.profileId = ''
          this.ruleTextAddForm.remark = ''
          this.ruleTextAddForm.id = ''
        })
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
        return pushStatus[val] // val
      },
      // key状态展示转换
      conKeyStatus (val) {
        let pushStatus = ['新','改', '删']
        return pushStatus[val - 1] // val - 1
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
      // 保存添加版本号
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
                  message: res.data.message || this.$t('message.add_error')
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

          // 发布时间查询
          this.getpublish()
          // 配置文件查询
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
      // json窗口关闭方法
      unPushJsonCloseMethod () {
        this.unPushDataList = []
      },
      // 打开json发布弹窗
      openPushJsonDialog () {
        let params = Object.assign({projectId: this.formInline.f_eq_projectId, version: this.ActiveVersion.version})
        this.getUnPushListApi(params).then(res => {
          if (res.data.result && res.data.result.length > 0) {
            this.unPushDataList = res.data.result
            this.pushJsonDialogVisible = true
          } else {
            this.unPushDataList = []
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
            this.pushJsonDialogVisible = false
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
        window.open(this.g_Config.BASE_URL+`/configs/export/${this.profiledata.f_eq_projectId}/${this.ActiveVersion.version}`)
      },
      // 导入配置
      expoFiles() {
        this.expofiledata.version = this.ActiveVersion.version
        this.dialogExpoVisible = true
      },
      submitUpload () {
        if (this.fileListTemp == '') {
          this.$message.error(this.$t('message.selectFile'))
        } else {
          this.doubleDisable = true
          this.$refs.upload.submit()
        }
      },
      submitUpload2 () {
        if (this.fileListTemp == '') {
          this.$message.error(this.$t('message.selectFile'))
        } else {
          this.doubleDisable = true
          this.$refs.upload2.submit()
        }
      },
      // 导入dialog关闭方法
      dialogExpoClose () {
        this.fileListTemp = ''
        this.dialogExpoVisible = false
        this.dialogImportVisible = false
        this.expofiledata.path = ''
        this.expofiledata.version = ''
        this.fileList = []
      },
      // 上传文件改变函数
      uploadChange (file, fileList) {
        if (fileList.length > 0) {
          this.fileListTemp = fileList[0].name
          this.fileTemp = file
        } else {
          this.fileListTemp = ''
          this.fileTemp = null
        }
      },
      // 上传之前判断文件格式
      beforeUpload (file) {
        let isZip = false
        const isLtM = file.size / 1024 / 1024 < 10
        if (file.name) {
          let arrayTemp = file.name.split('.')
          let fileType = ''
          if (arrayTemp.length > 0) {
            fileType = arrayTemp[arrayTemp.length - 1]
          }
          if (fileType == 'json' || fileType == 'js' || fileType == 'yaml' || fileType == 'yml' || fileType == 'properties') {
            isZip = true
          } else {
            isZip = false
          }
        }
        if (!isZip) {
          this.doubleDisable = false // 上传按键可用
          this.$message.error(this.$t('message.dialog_UploadTypeMessage'))
        }
        if (!isLtM) {
          this.doubleDisable = false // 上传按键可用
          this.$message.error(this.$t('message.dialog_UploadSizeMessage'))
        }
        return isZip && isLtM
      },
      // 迁入配置上传之前判断文件格式
      beforeUpload2 (file) {
        let isZip = false
        const isLtM = file.size / 1024 / 1024 < 10
        if (file.name) {
          let arrayTemp = file.name.split('.')
          let fileType = ''
          if (arrayTemp.length > 0) {
            fileType = arrayTemp[arrayTemp.length - 1]
          }
          if (fileType == 'json') {
            isZip = true
          } else {
            isZip = false
          }
        }
        if (!isZip) {
          this.doubleDisable = false // 上传按键可用
          this.$message.error(this.$t('message.dialog_UploadTypeMessage_2'))
        }
        if (!isLtM) {
          this.doubleDisable = false // 上传按键可用
          this.$message.error(this.$t('message.dialog_UploadSizeMessage'))
        }
        return isZip && isLtM
      },
      // 导入失败回调函数
      handleError (err, file) {
        // this.fileList = [{name: this.fileListTemp}]
        this.doubleDisable = false
        this.handleSuccess(file)
      },
      // 导入成功回调函数
      handleSuccess (file) {
        this.doubleDisable = false
        if (file.status == '200') {
          if(file.code == 0){
            this.$message({
              message: this.$t('message.success'),
              type: 'success'
            })
            this.dialogExpoVisible = false
            this.dialogImportVisible = false
            this.getConfigFileMethod()
          } else {
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
            debugger
            if (res.data.result.data[0].configKey == '') {
              this.configDetailList = this.jsonToArrayMethod(res.data.result.data[0])
            } else {
              this.configDetailList = res.data.result.data
            }
          } else {
            this.configDetailList = []
          }
        })
      },
      // array转json字符串方法
      arrayToJsonStrMethod (array) {
        if (array && array.length > 0) {
          let jsonData = {}
          array.map(item => {
            jsonData[item.configKey] = item.configValue
          })
          return jsonData
        } else {
          return null
        }
      },
      // json配置项保存方法
      saveJsonMethod (arrayTemp) {
        let jsonValue = {}
        jsonValue.id = arrayTemp[this.jsonIndex].idStr
        jsonValue.configKey = 'text'
        jsonValue.remark = arrayTemp[this.jsonIndex].remark
        jsonValue.status = arrayTemp[this.jsonIndex].status
        jsonValue.profileId = this.formInline['f_eq_profile.id']
        jsonValue.version = this.ActiveVersion.version
        let jsonData = this.arrayToJsonStrMethod(arrayTemp)
        if (jsonData) {
          this.configValuePre = jsonData
          this.$nextTick(() => {
            let preValue = document.getElementsByClassName('pre-display-style')
            if (preValue && preValue.length > 0) {
              jsonValue.configValue = preValue[0].textContent
            }
            this.saveJsonForApiMethod(jsonValue)
          })
        } else {
          jsonValue.configValue = ''
          this.saveJsonForApiMethod(jsonValue)
        }
      },
      // json配置项调用接口方法
      saveJsonForApiMethod (jsonValue) {
        let params = Object.assign(jsonValue)
        this.geteditConfig(params).then(res => {
          if(res.data.status == 200 && res.data.code == 0){
            this.$message({
              type: 'success',
              message: this.$t('message.edit_success')
            })
            this.dialogEditVisible = false
            this.getConfingListMethod()
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
      },
      // json转array方法
      jsonToArrayMethod (jsonData) {
        if (jsonData.configValue) {
          try {
            let jsonTemp = JSON.parse(jsonData.configValue)
            let keyArray = Object.keys(jsonTemp)
            let arrayData = keyArray.map((item, index) => {
              return {
                type: 'json',
                id: index,
                idStr: jsonData.id,
                configKey: item,
                configValue: jsonTemp[item],
                publish: jsonData.publish,
                operation: jsonData.operation,
                remark: jsonData.remark,
                status: jsonData.status,
                updateTime: jsonData.updateTime
              }
            })
            return arrayData
          } catch (e) {
            this.$message({
              type: 'error',
              message: this.$t('message.validateSearchJson_message')
            })
            return []
          }
        } else {
          return []
        }
      },
      // tag改变方法
      changeTagMethod (val) {
        this.isTagChange = true
        this.tabName = 'json'
        this.formInline['f_eq_profile.id'] = val
        this.formInline.orderType = 0
        if (val != '') {
          this.getConfingListMethod('no')
        }
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
        if (row.type && row.type == 'json') {
          this.jsonIndex = row.id
          this.configSaveForm.id = row.idStr
          this.configSaveForm.configKey = row.configKey
          this.configSaveForm.configValue = row.configKey
          this.configSaveForm.remark = row.remark
        } else {
          this.configSaveForm = Object.assign(this.configSaveForm, row)
        }
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
          if (row.type && row.type == 'json') {
            let arrayTemp = this.configDetailList.slice(0)
            arrayTemp.splice(row.id, 1)
            this.saveJsonMethod(arrayTemp)
          } else {
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
          }
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
                  this.dialogAddVisible = false
                  this.getConfigFileMethod()
                  this.$message({
                    type: 'success',
                    message: this.$t('message.add_success')
                  })
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.message || this.$t('message.add_error')
                  })
                }
              })
            } else {
              let params = Object.assign({
                id: this.saveConfigFile.id,
                name: this.saveConfigFile.name,
                // projectId: this.saveConfigFile.projectId,
                // status:1,
                // profileType: this.saveConfigFile.profileType == 'bootstrap' ? this.saveConfigFile.profileType : undefined,
                // version: this.ActiveVersion.version,
                path: this.saveConfigFile.path
              })
              this.geteditprofiles(params).then(res => {
                if (res.data.code == '0' && res.data.status == 200) {
                  this.dialogAddVisible = false
                  this.getConfigFileMethod()
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
        if (this.configDetailList[0] && this.configDetailList[0].type && this.configDetailList[0].type == 'json') {
          let arrayTemp = this.configDetailList.slice(0)
          let jsonTemp = {
            type: 'json',
            id: this.jsonIndex,
            idStr: this.configSaveForm.id,
            configKey: this.configSaveForm.configKey,
            configValue: this.configSaveForm.configValue,
            remark: this.configSaveForm.remark,
            status: arrayTemp[0].status
          }
          arrayTemp.splice(this.jsonIndex, 1)
          arrayTemp.splice(this.jsonIndex, 0, jsonTemp)
          this.saveJsonMethod(arrayTemp)
        } else {
          this.$refs[name].validate((valid) => {
            if (valid) {
              if (this.configSaveForm.id == '') {
                let params = Object.assign(this.configSaveForm)
                this.getAddConfig(params).then(res => {
                  if (res.data.status == 200 && res.data.code == 0) {
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
                  } else {
                    if (res.data.status == 1001) {
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
                  if (res.data.status == 200 && res.data.code == 0) {
                    this.$message({
                      type: 'success',
                      message: this.$t('message.edit_success')
                    })
                    this.getConfingListMethod()
                    if (this.$refs[name]) {
                      this.$refs[name].resetFields()
                    }
                    this.dialogEditVisible = false
                  } else {
                    if (res.data.status == 1001) {
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
        }
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
    margin: 0 10px 0 10px;
    /deep/.el-collapse-item__header{
      padding-left: 1.5%;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #4A525E;
      letter-spacing: 0;
    }
    /deep/ .el-collapse {
      background-color: #F0F4F8;
    }
    /deep/ .el-collapse-item {
      margin-bottom: 10px;
    }
  }
  // 主题区域div样式
  .content-div-style {
    margin: 0 1.5%;
    overflow-y: auto;
    /deep/ .el-tabs__content {
      margin-top: 0;
    }
  }
  .main {
    background-color: #f0f4f8;
    // height: 100vh - 6.5;
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
    max-width: 600px;
    word-wrap: break-word;
    max-height: 100px;
    overflow-y: auto;
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
  // text文本框样式
  .textDivStyle{
    padding: 10px 0;
    width: 99.9%;
  }
  // 上次配置文件样式
  .upload-demo {
    /deep/ .el-upload-dragger {
      width: 560px;
    }
    /deep/ .el-upload-list__item .el-icon-upload-success {
      color: #ffffff;
    }
  }
  // 上传配置文件路径样式
  .upload-path-style {
    width: 554px;
    height: 55px;
    background-color: #F9FBFD;
    display: flex;
    line-height: 56px;
    margin-top: 10px;
    div:first-of-type {
      width: 69px;
      text-align: center;
      font-size: 12px;
    }
    /deep/ .el-input__inner {
      height: 32px;
      width: 465px;
    }
  }
  // 路径提示语样式
  .path-message-style {
    text-align: center;
    color: #FF9A39;
    margin-top: 10px;
  }
  // pre隐藏样式
  .pre-display-style {
    display: none;
  }
  // 路径label样式
  .path-label-style {
    margin-left: 4.2%;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #7E828C;
    letter-spacing: 0;
    text-align: right;
  }
  .path-style {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
  }
</style>
