<template>
    <div>
      <div>
        <div>
          <span>{{item.name}}</span><span style="font-size: 12px;margin-left: 4.2%">{{$t('list.project_path')}}：{{fileData.path}}</span>
          <i class="icon iconfont icon-ic-edit" @click="editPathMethod(fileData.id)"></i>
          <div class="config-file-title">
            <el-input v-model="formInline.f_like_configKey" :placeholder="$t('list.searchFrom_place')" style="width: 200px;float: right;"></el-input>
            <el-button class="tableLastButtonStyleB" type="primary" @click="addConfigMethod(fileData.id)">{{$t('list.addConfig_button')}}</el-button>
            <el-button class="tableLastButtonStyleW" type="primary" @click="deleteConfigFile(fileData.id)">{{$t('common.delete')}}</el-button>
          </div>
        </div>
        <div v-if="divShowName == fileData.id" class="content-div-style" v-loading="listLoading">
          <el-table :data="configDetailList" style="width: 100%" :border="false">
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
                  <span class="overKeyWidth">{{ scope.row.configKey }}</span>
                  <el-tag v-if="scope.row.publish == 0" size="medium" style="margin-left: 10px;">{{conKeyStatus(scope.row.operation)}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Value" min-width="180" align="left">
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p>{{ scope.row.configValue }}</p>
                  <div slot="reference" class="value-tag-style">
                    <el-tag size="medium">{{ scope.row.configValue }}</el-tag>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :label="$t('list.modify_time')" prop="updateTime" sortable="custom" min-width="180" align="center">
              <template slot-scope="scope">
                <span size="medium">{{ timestampToTimeFun(scope.row.updateTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('list.remarks')" min-width="180" align="left">
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
      </div>
    </div>
</template>

<script>
  export default {
    name: 'fileListTag',
    props: {
      fileData: {
        type: Object
      }
    },
    data () {
      return {
        divShowName: ''
      }
    }
  }
</script>

<style scoped>

</style>
