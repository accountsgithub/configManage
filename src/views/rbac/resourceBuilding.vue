<template>
  <el-row class="main" style="background: #ffffff">
    <div style="height: 45px;border: solid 1px #edeff4;padding-top: 14px;padding-left: 21px;font-size: 14px;color:#555D68;font-weight: bold;"><span>{{titleName}}-资源绑定</span></div>
    <div id="dataDiv">
    <el-row v-for="(item, count) in index_treeResourceBuilding" style="margin-top: 10px">
      <div class="menuStyle"><span>{{item.name}}</span></div>
      <!--<el-checkbox style="margin-left: 20px" :label="item.name" :key="item.id" :value="item" v-model="item.checked"><span class="fontFirstStyle">{{item.name}}</span></el-checkbox>-->
      <br/>
      <el-col class="checkBoxStyle" :span="3" v-for="(child, index) in item.children" v-if="child.level > 1 && child.hasChildren == false">
        <div><el-checkbox :label="child.name" :key="child.id" :value="child" v-model="child.checked" style="margin-left: 40px"><span class="fontStyle">{{child.name}}</span></el-checkbox><i v-if="child.type == '20'" @click="openDailog(child)" class="el-icon-setting"></i></div>
      </el-col>
      <el-row v-for="(child, index) in item.children" v-else-if="index < 1">
        <el-col class="checkBoxStyle">
        <div><el-checkbox :label="child.name" :key="child.id" :value="child" v-model="child.checked" style="margin-left: 40px"><span class="fontFirstStyle">{{child.name}}</span></el-checkbox><i v-if="child.type == '20'" @click="openDailog(child)" class="el-icon-setting"></i></div>
        </el-col>
        <br/>
        <el-col class="checkBoxStyle" :span="3" v-for="(child1, index1) in child.children" v-if="child1.level > 1 && child1.hasChildren == false">
          <div><el-checkbox :label="child1.name" :key="child1.id" :value="child1" v-model="child1.checked" style="margin-left: 60px"><span class="fontStyle">{{child1.name}}</span></el-checkbox><i v-if="child1.type == '20'" @click="openDailog(child1)" class="el-icon-setting"></i></div>
        </el-col>
        <el-row v-for="(child1, index1) in child.children" v-else>
          <el-col class="checkBoxStyle">
          <el-checkbox :label="child1.name" :key="child1.id" :value="child1" v-model="child1.checked" style="margin-left: 60px"><span class="fontFirstStyle">{{child1.name}}</span></el-checkbox><i v-if="child1.type == '20'" @click="openDailog(child1)" class="el-icon-setting"></i>
          </el-col>
          <br/>
          <el-col class="checkBoxStyle" :span="3" v-for="(child2, index2) in child1.children" v-if="child2.level > 1 && child2.hasChildren == false" >
            <div><el-checkbox :label="(child2, index2).name" :key="child2.id" :value="child2" v-model="child2.checked" style="margin-left: 80px"><span class="fontStyle">{{child2.name}}</span></el-checkbox><i v-if="child2.type == '20'" @click="openDailog(child2)" class="el-icon-setting"></i></div>
          </el-col>
          <el-row v-for="(child2, index2) in child1.children" v-else>
            <el-col class="checkBoxStyle">
            <div><el-checkbox :label="child2.name" :key="child2.id" :value="child2" v-model="child2.checked" style="margin-left: 80px"><span class="fontFirstStyle">{{child2.name}}</span></el-checkbox><i v-if="child2.type == '20'" @click="openDailog(child2)" class="el-icon-setting"></i></div>
            </el-col>
            <br/>
            <el-col class="checkBoxStyle" :span="3" v-for="(child3, index3) in child2.children" v-if="child3.level > 1 && child3.hasChildren == false" >
              <div><el-checkbox :label="child3.name" :key="child3.id" :value="child3" v-model="child3.checked" style="margin-left: 100px"><span class="fontStyle">{{child3.name}}</span></el-checkbox><i v-if="child3.type == '20'" @click="openDailog(child3)" class="el-icon-setting"></i></div>
            </el-col>
          </el-row>
        </el-row>
      </el-row>
    </el-row>
    </div>
    <div style="float: right;margin-top: 10px;">
      <el-button @click="backPage('false')" class="dialogButtonW">取消</el-button>
      <el-button type="primary" @click="submitForm()" class="dialogButtonB">保存</el-button>
    </div>
    <el-dialog
      title="资源修改配置"
      :visible.sync="dialogEditVisible" @close="closeDialog('settings')"
      width="558px;">
      <el-scrollbar class="dialogScrollbar">
        <!--<hr style="margin-top: -20px;color: #e3eaf1;"/>-->
        <el-form :model="settings" :rules="resourceEditFormRules" ref="settings" label-width="100px" class="demo-ruleForm">
          <div class="app-container">
            <el-input placeholder="请输入字段名称" v-model="filterText" class="treeInputStyle"></el-input>
            <div style="margin-top: 14px">
            <el-scrollbar class="list">
              <el-table ref="fieldTable" :data="fieldValue" @selection-change="allSelect">
                <el-table-column label="勾选表示允许字段" min-width="80%" align="left" prop="name"></el-table-column>
                <el-table-column type="selection" min-width="15%">
                  <!--<template slot-scope="scope">-->
                    <!--<el-checkbox :checked="scope.row.checked"/>-->
                  <!--</template>-->
                </el-table-column>
              </el-table>
            </el-scrollbar>
            </div>
          </div>
          <!--<hr style="color: #e3eaf1;"/>-->
          <div style="height:55px;line-height:55px;margin-top: 0;background: #e6e9ef;">
          <span style="font-weight: bold;margin-left: 10px;">数据访问权限：</span>
          <el-form-item prop="settings.dataScope" style="margin-top: -48px;margin-left: 20px;">
            <el-radio-group v-model="settings.dataScope">
              <el-radio label="0">用户权限</el-radio>
              <el-radio label="2">部门权限</el-radio>
              <el-radio label="3">全部权限</el-radio>
            </el-radio-group>
            <a style="float: right;color:#016ad5; " @click="showAddField('settings')">高级配置<i :class="[moreFieldIcon]"></i></a>
          </el-form-item>
          </div>
          <!--<hr style="margin-top: -20px"/>-->
          <div class="columnStyle" :style="[{display: moreField}]">
            <span style="font-weight: bold;margin-left: 10px;">数据自定义权限配置</span>
            <a class="tableActionStyle" @click="textAddMthod('settings')">添加字段</a><br>
            <div style="color:#666666;font-size: 12px;padding: 18px 10px 11px 10px;">
              <span>显示符合下列所有条件</span>
            </div>
            <!--动态字段-->
            <el-scrollbar class="list1">
            <el-form-item
              v-for="(domain, index) in settings.dataAccess"
              :key="domain.key" style="margin-left: -100px">
              <div class="fileHovr">
              <div class="addFieldStyle">
                <el-form-item style="float: left;"
                              :prop="'dataAccess.' + index + '.column'">
                  <el-select :id="'two'+index" v-model="domain.column" style="width: 100px;">
                    <el-option v-for="item in optionColumn"
                               :key="item.id"
                               :value="item.id"
                               :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="float: left;margin-left: 10px"
                              :prop="'dataAccess.' + index + '.term'">
                  <el-select :id="'two'+index" v-model="domain.term" style="width: 133px;">
                    <el-option v-for="item in optionType"
                               :key="item.id"
                               :value="item.id"
                               :label="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item style="float: left;"
                              :prop="'dataAccess.' + index + '.value'">
                  <el-input :id="'one'+index" v-model="domain.value" placeholder="输入多个值用“，”隔开，如A, B，C" style="width: 200px;margin-left: 10px;"></el-input>
                </el-form-item>
                <a @click.prevent="removeDomain(domain, 'settings')" class="tableActionStyle"><i class="icon iconfont icon-ic-closed"></i></a>
              </div>
              </div>
            </el-form-item>
            </el-scrollbar>
            <!--<hr/>-->
          </div>
        </el-form>
        <span style="float: right;padding: 14px 11px 14px 0;">
          <el-button @click="closeDialog('settings')" class="dialogButtonW">取消</el-button>
          <el-button type="primary" @click="setData()" class="dialogButtonB">保存</el-button>
      </span>
      </el-scrollbar>
    </el-dialog>
  </el-row>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import vue from 'vue'
  import '@/assets/iconfont/iconfont.css'
  import ElCol from 'element-ui/packages/col/src/col' // icon css
  export default {
    components: {ElCol},
    name: 'role',
    data () {
      return {
        searchFormLine: {
          f_eq_settingForId: this.$route.params.id,
          f_eq_settingForType: this.$route.params.settingForType,
          'f_eq_resource.clientSign': this.$route.params.clientSign,
          paging: false
        },
        titleName: this.$route.params.name,
        dialogData: {},
        saveData: [],
        fieldValue: [], // 字段名称条件过滤
        typeOptions: [],
        optionType: [
          {id: '2', name: '包含'},
          {id: '3', name: '不包含'},
          {id: '12', name: '为空'},
          {id: '13', name: '不为空'},
          {id: '0', name: '等于'},
          {id: '1', name: '不等于'},
          {id: '4', name: '大于'},
          {id: '6', name: '大于等于'},
          {id: '5', name: '小于'},
          {id: '7', name: '小于等于'}],
        optionColumn: [],
        moreField: 'none',
        moreFieldIcon: 'icon iconfont icon-ic-arrow-down',
        dialogEditVisible: false,
        val: [],
        settings: {
          dataAccess: [{
            column: '', // 列
            description: '', // 描述
            term: '', // 条件
            value: '' // 值
          }], // 自定义数据权限
          dataScope: '3', // 数据权限
          field: [], // 可见字段
          resource: {
            id: '' // 资源id
          } // 资源
        }, // 详细设置集合
        buildingEditForm: {
          settingForId: this.$route.params.id, // 主体ID
          settingForType: this.$route.params.settingForType, // 主体类型
          settings: [] // 详细设置集合
        },
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        filterText: '', // 监听收索框变量
        resourceEditFormRules: {
          name: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '资源类型不能为空', trigger: 'blur' }
          ],
          sign: [
            { required: true, message: '资源标识不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '资源地址不能为空', trigger: 'blur' }
          ],
          sortIndex: [
            { required: true, message: '资源排序不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.gettreeResourceBuilding()
      // this.getTreeDepartList()
    },
    watch: {
      filterText (val) {
        let fieldValues = []
        let dataArray = this.settings.field
        if (val) {
          for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].name.toString().indexOf(val) > -1) {
              fieldValues.push(dataArray[i])
            }
          }
          this.fieldValue = fieldValues
        } else {
          this.fieldValue = dataArray
        }
      }
    },
    methods: {
      ...mapActions([
        'getTreeDeptList', 'getResourceBuildingTree', 'getRResourceBuild'
      ]),
      // 全选
      SelectFunction (item, mark = 0) {
        if (item.children && item.children.length > 0) {
          for (let i = 0; i < item.children.length; i++) {
            if (!item.children[i].checked) {
              ++mark
              break
            } else if (item.children[i].children && item.children[i].children.length > 0) {
              this.SelectFunction(item.children[i].children, mark)
            }
          }
          if (mark > 0) {
            this.setSelect(item, 1)
          }
        }
      },
      setSelect (item, type) {
        for (let i = 0; i < item.children.length; i++) {
          if (type == 1) {
            item.children[i].checked = true
          } else {
            item.children[i].checked = false
          }
          if (item.children[i].children && item.children[i].children.length > 0) {
            this.setSelect(item.children[i].children, type)
          }
        }
      },
      // 高级配置
      showAddField (name) {
        /* if (this.moreField == 'none') {
          this.$refs[name].model.dataAccess = [{
            column: '', // 列
            description: '', // 描述
            term: '', // 条件
            value: '', // 值
            key: Date.now()
          }]
        } */
        this.moreField = this.moreField == 'none' ? 'block' : 'none'
        this.moreFieldIcon = this.moreField == 'block' ? 'icon iconfont icon-ic-arrow-up-02' : 'icon iconfont icon-ic-arrow-down'
      },
      // 字段全选
      allSelect (val) {
        this.val = val
      },
      // 取消资源绑定
      backPage (val) {
        let backPath = this.buildingEditForm.settingForType.toLowerCase()
        let pathName = ''
        if (backPath == 'role') {
          pathName = '角色管理'
        } else if (backPath == 'department') {
          pathName = '部门管理'
        } else if (backPath == 'user') {
          pathName = '用户管理'
        }
        this.$router.push({name: pathName, params: {mountedType: val}})
      },
      // 设置字段选中
      setTableSelect () {
        let tempArray = []
        let fieldArray = this.settings.field
        let i = 0
        for (; i < fieldArray.length; i++) {
          if (fieldArray[i].checked) {
            tempArray.push(fieldArray[i])
          }
        }
        this.$refs.fieldTable.clearSelection()
        tempArray.forEach(row => {
          if (this.$refs.fieldTable) {
            this.$refs.fieldTable.toggleRowSelection(row)
          }
        })
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      // 打开编辑框
      openDailog (val) {
        this.dialogData = val
        if (val.field) {
          this.fieldValue = val.field
          this.settings.field = val.field
          let jsonTemp = {}
          for (let j = 0; j < val.field.length; j++) {
            jsonTemp = {}
            jsonTemp.id = val.field[j].name
            jsonTemp.name = val.field[j].name
            this.optionColumn.push(jsonTemp)
          }
        } else {
          this.fieldValue = []
          this.settings.field = []
        }
        if (val.dataAccess && val.dataAccess.length > 0) {
          this.settings.dataAccess = val.dataAccess
          this.moreField = 'block'
          this.moreFieldIcon = 'icon iconfont icon-ic-arrow-up-02'
        } else {
          this.settings.dataAccess = []
        }
        this.settings.resource = {id: val.id}
        if (val.dataScope) {
          this.settings.dataScope = val.dataScope
        } else {
          this.settings.dataScope = '3'
        }
        vue.nextTick(_ => {
          this.setTableSelect()
        })
        this.dialogEditVisible = true
      },
      // 资源树方法
      gettreeResourceBuilding () {
        let params = Object.assign(this.searchFormLine)
        this.getResourceBuildingTree(params)
      },
      // 左侧单位树
      getTreeDepartList () {
        let params = Object.assign({paging: false})
        this.getTreeDeptList(params)
      },
      // 动态添加文本框
      textAddMthod (name) {
        this.settings.dataAccess.push({
          column: '', // 列
          description: '', // 描述
          term: '', // 条件
          value: '', // 值
          key: Date.now()
        })
      },
      // 移除dom
      removeDomain (item, name) {
        var index = this.$refs[name].model.dataAccess.indexOf(item)
        if (index !== -1) {
          this.$refs[name].model.dataAccess.splice(index, 1)
        }
      },
      closeDialog (name) {
        this.moreField = 'none'
        this.moreFieldIcon = 'icon iconfont icon-ic-arrow-down'
        this.dialogEditVisible = false
        // this.$refs[name].resetFields()
      },
      // 对话框保存
      setData () {
        for (let i = 0; i < this.settings.field.length; i++) {
          if (this.val.length < 1) {
            this.settings.field[i].checked = false
          } else {
            for (let j = 0; j < this.val.length; j++) {
              if (this.val[j].name == this.settings.field[i].name) {
                this.settings.field[i].checked = true
                break
              } else {
                this.settings.field[i].checked = false
              }
            }
          }
        }
        this.dialogData.field = this.settings.field
        this.dialogData.dataAccess = this.settings.dataAccess
        this.dialogData.resource = {id: this.settings.resource.id}
        this.dialogData.dataScope = this.settings.dataScope
        this.dialogEditVisible = false
      },
      // 保存、修改
      submitForm () {
        let dataDiv = document.getElementById('dataDiv')
        if (dataDiv) {
          let dataChecked = dataDiv.getElementsByClassName('el-checkbox is-checked')
          if (dataChecked && dataChecked.length > 0) {
            this.saveData = []
            for (let i = 0; i < dataChecked.length; i++) {
              this.saveData.push(dataChecked[i].__vue__.$attrs.value)
              this.saveData[i].resource = {id: dataChecked[i].__vue__.$attrs.value.id}
              this.saveData[i].excludeFields = dataChecked[i].__vue__.$attrs.value.field
              if (this.saveData[i].excludeFields) {
                for (let j = 0; j < this.saveData[i].excludeFields.length;) {
                  if (this.saveData[i].excludeFields[j].checked == false) {
                    this.saveData[i].excludeFields.splice(j, 1)
                  } else {
                    ++j
                  }
                }
              }
              if (!this.saveData[i].dataScope || this.saveData[i].dataScope == '') {
                this.saveData[i].dataScope = '3'
              }
            }
          }
        }
        this.buildingEditForm.settings = this.saveData
        let params = Object.assign(this.buildingEditForm)
        this.getRResourceBuild(params).then(res => {
          if (res.data.code == '0') {
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.backPage('')
          } else if (res.data.code == '-1') {
            this.$message({
              type: 'error',
              message: res.data.message
            })
          }
          // let backPath = this.buildingEditForm.settingForType.toLowerCase()
          // this.$router.push({name: backPath})
        })
      },
      // 数组结构转换
      data2treeDG (datas, dataArray) {
        for (var j = 0; j < dataArray.length; j++) {
          var dataArrayIndex = dataArray[j]
          var childrenArray = []
          var CATL_CODEP = dataArrayIndex.id
          for (var i = 0; i < datas.length; i++) {
            var data = datas[i]
            var CATL_PARENT = data.parentid
            if (CATL_PARENT == CATL_CODEP) { // 判断是否为儿子节点
              data.parentid = CATL_PARENT
              childrenArray.push(data)
            }
          }
          dataArrayIndex.children = childrenArray
          if (childrenArray.length > 0) { // 有儿子节点则递归
            this.data2treeDG(datas, childrenArray)
          }
        }
        return dataArray
      }
    },
    computed: {
      ...mapState({
        index_treeDepartList: (index) => index.rbac.index_treeDepartList,
        index_treeResourceBuilding: (index) => index.rbac.index_treeResourceBuilding // [{id: 1, name: 1, children: [{id: 2, name: 2, fields: [{id: 'id1', name: 'id1', checked: false}, {id: 'id2', name: 'id2', checked: true}]}, {id: 3, name: 3, fields: [{id: 'id2', name: 'id2', checked: true}, {id: 'id1', name: 'id1', checked: true}]}]}]
      }),
      dataTreeList () {
        let i = 0
        let dataList = this.index_rResourceList
        for (; i < dataList.length; i++) {
          if (dataList[i].parent) {
            dataList[i].parentid = dataList[i].parent.id
          }
          if (this.index_rResourceList[i].status == '0') {
            dataList[i].status = '无效'
          } else {
            dataList[i].status = '有效'
          }
        }
        if (dataList.length > 0) {
          let tempArray = []
          let j = 0
          for (;j < dataList.length; j++) {
            if (!dataList[j].parent) {
              tempArray.push(dataList[j])
            }
          }
          return this.data2treeDG(dataList, tempArray)
        } else {
          return []
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .fontStyle{
    font-family:PingFangSC-Regular;
    font-size:12px;
    color:#606266;
  }
  .fontFirstStyle{
    font-family:PingFangSC-Medium;
    font-size:12px;
    color:#606266;
    font-weight: 900;
  }
  .divStyle_tree{
    float: left;
    width: 19%;
    background: #ffffff;
    margin-right:0.5%;
    margin-top: 10px;
  }
  .divStyle_show{
    float: right;
    width: 80%;
  }
  .main{
    margin: 0 10px;
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
  .fontSizeBtW12{
    font-size: 12px;
    color: #ffffff;
    background:#016ad5;
    border-radius:4px;
    width:90px;
    height:32px;
  }
  .fontSizeBtB12{
    font-size: 12px;
    color:#666666;;
    background:#f0f4f8;
    border:1px solid #dfe6ed;
    border-radius:4px;
    width:90px;
    height:32px;
  }
  .tableButtonStyleW{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#666666;
    background:#f9fbfd;
    border:1px solid #e7e9f0;
    border-radius:4px;
    width:90px;
    height:32px;
    float: right;
    margin-left: 10px;
  }
  .tableButtonStyleB{
    font-family:PingFangSC-Semibold;
    font-size:12px;
    color:#ffffff;
    background:#016ad5;
    border:1px solid #e7e9f0;
    border-radius:4px;
    width:90px;
    height:32px;
    float: right;
    margin-left: 10px;
  }
  .el-button {
    padding: 0;
  }
  .el-table{
    font-family:PingFangSC-Regular;
    font-size:14px;
    color:#333333;
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
  // 弹出框标题样式
  /deep/.el-dialog__title{
    font-weight: bolder;
    font-size: 16px;
    color:#333333;
    font-family:PingFangSC-Medium;
  }
  // 弹出框样式
  .form-top{
    margin-top: 0;
    margin-right: 22px;
    /deep/.el-form-item__label {
      font-family:PingFangSC-Regular;
      font-size:12px;
      color:#606266;
      letter-spacing:0;
      text-align:right;
    };
    /deep/.el-input__inner {
      background:#ffffff;
      border:1px solid #dcdfe6;
      border-radius:4px;
      width:170px;
      height:30px;
      font-size: 12px;
    };
    /deep/.el-form-item{
      margin-right: 0;
    }
  }
  .tableActionStyle{
    font-family:PingFangSC-Medium;
    font-size:14px;
    color:#016ad5;
    letter-spacing:0.86px;
    text-align:left;
    margin-left: 10px;
    margin-right: 10px;
    float: right;
  }
  .content-table{
    background: #ffffff;
  }
  .tableInfo{
    margin-left: 21px;
    padding-top: 10px;
    font-family:PingFangSC-Medium;
    font-size:14px;
    color:#686f79;
    letter-spacing:0;
    text-align:left;
    height: 50px;
    margin-right: 22px;
  }
  .disStyle{
    display: none;
  }
  .necessary:before {
    content: '*';
    color: red;
  }
  // 左侧树滚动条
  .list {
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .list1 {
    max-height: 100px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .fieldTitleStyle{
    font-family:PingFangSC-Regular;
    font-size:14px;
    color:#666666;
  }
  .dialogScrollbar{
    max-height: 600px;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  .input-with-select{
    width: 246px;
    height: 28px;
  }
  .addFieldStyle{
    float: left;
    margin-left: 34px;
    /deep/.el-input__inner{
      font-size: 12px;
      height: 28px;
      color: #333333;
    };
  }
  .fileHovr{
    height: 40px;
    background: #ffffff;
    a{
      margin-left: 11px;
      display: none;
    }
  }
  .fileHovr:hover{
    background: #ecf5ff;
    a{
      display: block;
    }
  }
  .treeInputStyle{
    /deep/.el-input__inner {
      border-radius:100px;
      width:528px;
      height:30px;
      background:#ffffff;
      border:1px solid #dcdfe6;
      font-family:PingFangSC-Regular;
      font-size:12px;
      color:#c9cdd3;
      margin-left: 15px;
    }
  }
  .app-container {
    padding: 12px 0 0 0;
  }
  // 弹出框样式
  /deep/.el-dialog {
    width:558px;
    background:#f9fbfd;
  }
  /deep/.el-dialog__body {
    padding: 0;
    background:#f9fbfd;
  }
  .checkBoxStyle {
    background: #ffffff;
    i{
      margin-left: 10px;
      color: #ffffff;
    }
  }
  .checkBoxStyle:hover{
    background: #ecf5ff;
    i{
      color: #c9cdd3;
    }
  }
  #dataDiv{
    .el-col-3 {
      width: 16%;
      margin-top: 5px;
    }
  }
  // 动态列div样式
  .columnStyle{
    background:#ffffff;
    padding-top: 19px;
  }
  // 一级目录样式
  .menuStyle{
    margin-left: 40px;
    font-weight: bolder;
    font-family:PingFangSC-Medium;
    font-size:14px;
    color:#4b535f;
    background:#f9fbfd;
    height:40px;
    line-height: 40px;
  }
</style>
