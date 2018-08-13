<template>
  <div class="input tags-wrap">
    <div class="tags fontSize12" transition="tags" v-for="(item,index) in dis_source" :key="index" :class="{active:nums==index}" @click="tagsClick(item,index)">{{ item.name }}</div>
    <!--<el-button class="buttonAdd" size="mini" type="primary" @click="add">{{$t('common.add')}}</el-button>-->

    <!--添加版本号弹框-->
    <el-dialog
      :title="$t('tags.add_version')"
      :visible.sync="dialogAddVersionVisible" @close="resetForm('ruleAddVersionFormTag')"
      width="60%">
      <el-form :model="ruleAddVersionFormTag" :rules="addVersionRulesTag" ref="ruleAddVersionFormTag" label-width="100px" class="demo-ruleForm">
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

    <!--添加文件弹框-->
    <el-dialog
      :title="$t('tags.add_file')"
      :visible.sync="dialogAddVisible" @close="resetForm('ruleAddFormTag')"
      width="60%">
      <el-form :model="ruleAddFormTag" :rules="addFormRulesTag" ref="ruleAddFormTag" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('tags.file_name')" prop="name">
          <el-input v-model="ruleAddFormTag.name" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tags.file_type')" prop="profileType">
          <el-select v-model="ruleAddFormTag.profileType" :placeholder="$t('tags.select_type')">
            <el-option
              v-for="item in profileTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
    <!--修改文件弹框-->
    <el-dialog
      :title="$t('tags.edit_file')"
      :visible.sync="dialogEditVisible" @close="resetEditForm('copy_ruleEditFormTag')"  @open="openResetEditForm('ruleEditFormTag')"
      width="60%">
      <el-form :model="copy_ruleEditFormTag" :rules="editFormRulesTag" ref="copy_ruleEditFormTag" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('tags.file_name')" prop="name">
          <el-input v-model="copy_ruleEditFormTag.name" auto-complete="off"  maxlength="4096"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tags.file_type')" prop="profileType">
          <el-select v-model="copy_ruleEditFormTag.profileType" :placeholder="$t('tags.select_type')">
            <el-option
              v-for="item in profileTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :class="{disStyle:disEditFilePath}" :label="$t('tags.file_path')" prop="path">
          <el-input v-model="copy_ruleEditFormTag.path" auto-complete="off" maxlength="4096"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button class="dialogButtonB" type="primary" @click="submitForm('copy_ruleEditFormTag')">{{$t('common.modify')}}</el-button>
          <el-button class="dialogButtonW" @click="resetEditForm('copy_ruleEditFormTag')">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  export default {
    name: 'vue-tags',
    props: ['source', 'chooseVersion', 'fileName', 'confirm'],
    computed: {

      dis_source () {
        // console.log("tag"+this.confirm)
        // console.log("confirmKey:"+sessionStorage.getItem('confirmKey'))
        // console.log("id:"+sessionStorage.getItem('id'))
        // console.log("id2:"+this.$route.params.id)
        if(sessionStorage.getItem('confirmKey') && sessionStorage.getItem('id')==this.$route.params.id){
          return this.source
        }else{
          return this.source
        }
      },
      dis_chooseVersion () {
        return this.chooseVersion
      },
      dis_fileName () {
        return this.fileName
      },
      disEditFilePath () {
        if (this.copy_ruleEditFormTag.profileType === 'bootstrap') {
          // this.editFormRulesTag.path = []
          return true
        } else {
          this.editFormRulesTag.path.push({ required: true, message: this.$t('message.path'), trigger: 'blur' })
          return false
        }
      },
      disAddFilePath () {
        if (this.ruleAddFormTag.profileType === 'bootstrap') {
          // this.addFormRulesTag.path = []
          return true
        } else {
          this.addFormRulesTag.path.push({ required: true, message: this.$t('message.path'), trigger: 'blur' })
          return false
        }
      },
      addFormRulesTag () {
        return {
          name: [
            { required: true, message: this.$t('message.file_name'), trigger: 'blur' }
          ],
          profileType: [
            { required: true, message: this.$t('message.profileType'), trigger: 'change' }
          ],
          path: [
            { required: true, message: this.$t('message.path'), trigger: 'blur' }
          ]
        }
      },
      editFormRulesTag () {
        return {
          name: [
            {required: true, message: this.$t('message.file_name'), trigger: 'blur'}
          ],
          profileType: [
            {required: true, message: this.$t('message.profileType'), trigger: 'change'}
          ],
          path: [
            {required: true, message: this.$t('message.path'), trigger: 'change'}
          ],
        }
      }
    },
    data () {
      var validateMark = (rule, value, callback) => {
        let myreg1 = /^\d+(\.\d+)*/
        if (!myreg1.test(value) && value != '') {
          callback(new Error('请输入正确的版本号。(以数字开头，只能包含数字和" . ", 如 1 或 1.0 或 1.0.0 或 1.0.0.0 )'))
        } else if (value === '') {
          callback(new Error('版本号不能为空'))
        } else {
          callback()
        }
      }
      return {
        nums: null,
        itemaa:{},
        ruleAddFormTag: {
          id: '',
          name: '',
          profileType: '',
          path: '',
          projectId: this.$route.params.mark,
          version: ''
        },
        ruleAddVersionFormTag: {
          id: '',
          projectId: this.$route.params.mark,
          version: '',
          active: '0',
          remark: ''
        },
        profileTypeList: [{
          name: 'bootstrap',
          id: 'bootstrap'
        }, {
          name: 'json',
          id: 'json'
        }, {
          name: 'text',
          id: 'text'
        }],
        ruleEditFormTag: {
          id: '',
          name: '',
          profileType: '',
          path: '',
          projectId: this.$route.params.mark,
          version: ''
        },
        copy_ruleEditFormTag: {
          id: '',
          name: '',
          profileType: '',
          path: '',
          projectId: this.$route.params.mark,
          version: '',
          status: '1'
        },
        ruleEditProfileFormTag: {
          id: '',
          name: '',
          profileType: '',
          path: '',
          projectId: this.$route.params.mark,
          version: ''
        },
        addVersionRulesTag:{
            version: [
              { required: true, validator: validateMark, trigger: 'blur' }
            ]
        },
        dialogAddVersionVisible: false,
        dialogAddVisible: false,
        dialogEditVisible: false,
        bgc: ['#e961b4', '#ed664b', '#7b6ac7', '#56abd1', '#f7af4c', '#fe5467', '#52c7bd', '#a479b7', '#cb81ce', '#5eabc5']
      }
    },
    methods: {
      ...mapActions([
        'getaddprofiles', 'geteditprofiles', 'getprofilesexpo', 'getdelprofiles', 'getprofiles', 'getaddversions'
      ]),
      resetEditForm (name) {
        this.dialogEditVisible = false
      },
      openResetEditForm (name) {
        this.copy_ruleEditFormTag.id = this.ruleEditFormTag.id
        this.copy_ruleEditFormTag.name = this.ruleEditFormTag.name
        this.copy_ruleEditFormTag.profileType = this.ruleEditFormTag.profileType
        this.copy_ruleEditFormTag.path = this.ruleEditFormTag.path
        this.copy_ruleEditFormTag.version = this.ruleEditFormTag.version
      },
      resetForm (name) {
        this.$refs[name].resetFields()
      },
      openResetForm (name) {
        if (this.$refs[name]) {
          this.$refs[name].resetFields()
        }
      },
      reflash(){
        this.dialogEditVisible = false
      },
      submitForm (name) {
        this.ruleAddFormTag.version = this.dis_chooseVersion
        this.copy_ruleEditFormTag.version = this.dis_chooseVersion
        if (this.copy_ruleEditFormTag.profileType === 'bootstrap' || this.ruleAddFormTag.profileType === 'bootstrap') {
          this.editFormRulesTag.path = []
          this.addFormRulesTag.path = []
          this.copy_ruleEditFormTag.path = ''
          this.ruleAddFormTag.path = ''
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'ruleAddFormTag') {
              let params = Object.assign(this.ruleAddFormTag)
              this.getaddprofiles(params).then(res => {
                this.$message({
                  type: 'success',
                  message: this.$t('message.add_success')
                })
                this.$refs[name].resetFields()
                this.dialogAddVisible = false
                this.$emit('onChangeTagClick', res)
              })
            } else if (name === 'copy_ruleEditFormTag') {
              console.log(this.copy_ruleEditFormTag)
              let params = Object.assign(this.copy_ruleEditFormTag)
              this.geteditprofiles(params).then(res => {
                this.$message({
                  type: 'success',
                  message: this.$t('message.edit_success')
                })
                if (this.$refs[name]) {
                  this.$refs[name].resetFields()
                }
                this.dialogEditVisible = false
                this.$emit('onChangeTagClick')
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      submitVersionForm (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = Object.assign(this.ruleAddVersionFormTag)
            this.getaddversions(params).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('message.add_success')
              })
              this.$refs[name].resetFields()
              this.dialogAddVersionVisible = false
              this.$emit('onChangeVersionClick')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      add (text) {
        this.dialogAddVisible = true
      },
      addVersion (text) {
        this.dialogAddVersionVisible = true
      },
      del (item, index, way) {
        this.$confirm(this.$t('message.delete_file_content'), this.$t('common.prompt'), {
          confirmButtonText: this.$t('common.ensure'),
          cancelButtonText: this.$t('common.cancel'),
          type: 'warning',
          center: true
        }).then(() => {
          let params = Object.assign(item)
          this.getdelprofiles(params).then(res => {
            this.$emit('onChangeTagClick')
            this.$message({
              type: 'success',
              message: this.$t('message.delete_success')
            })
          })
        })
      },
      edit (item) {
        this.dialogEditVisible = true
        this.ruleEditFormTag = item
      },
      tagsClick (res, index) {
        this.nums = index
        this.$emit('ontagclick', res)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tags.active:after, .tags:hover:after {
    background: #ffffff;
  }
  .tags.active,  .tags:hover {
    z-index: 11;
  }
  //输入框tags
  .tags-wrap {
    width: 100%;
    height: 100%;
    outline: none;
    border-bottom: 1px solid #e4e7f0;
    &::after {
      content: "";
      display: block;
      height: 0;
      clear: both;
    }
  }

  .buttonAdd {
    margin-left: 10px;
  }

  .tags:after {
    cursor: pointer;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: #f0f4f8;
    transform: perspective(1em) rotateX(8deg);
    transform-origin: center;
    border-width: 1px 1px 0 1px;
    border-style: solid;
    border-color: #e4e7f0;
  }
  .tags {
    cursor: pointer;
    position: relative;
    color: #333333;
    display: inline-block;
    line-height: 28px;
    margin: 0;
    z-index: 1;
    padding: 0 15px;
    .del {
      width: 22px;
      height: 28px;
      text-align: center;
      cursor: pointer;
    }
    max-width: 15%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .tags-input {
    font-size: 14px;
    padding: 0;
    background-color: inherit;
    border: none;
    color: inherit;
    width: 10em;
  }
  .disStyle{
    display: none;
  }
  .fontSize12{
    font-size: 12px;
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
</style>
