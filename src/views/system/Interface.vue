<template>
<div>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>接口管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索筛选 -->
  <el-form :inline="true" :model="formInline" class="user-search">
    <el-form-item label="搜索：">
      <el-select size="small" v-model="formInline.isLock" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="开放" value="开放"></el-option>
        <el-option label="禁用" value="禁用"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="">
      <el-input size="small" v-model="formInline.userName" placeholder="输入接口编号"></el-input>
    </el-form-item>
    <el-form-item label="">
      <el-input size="small" v-model="formInline.userMobile" placeholder="输入接口名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
    </el-form-item>
  </el-form>
  <!-- 接口管理列表 -->
  <el-table
    border
    :data="interfaceList"
    style="width: 100%">
    <el-table-column
      prop="code"
      label="编号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="url"
      label="路径"
      width="280">
    </el-table-column>
    <el-table-column
      prop="securityState"
      label="安全状态"
      width="120">
      <template v-slot="scope">
        <el-tag type="primary" v-if="scope.row.securityState === '受保护'">受保护</el-tag>
        <el-tag type="danger" v-if="scope.row.securityState === '未保护'">未保护</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="openState"
      label="开放状态"
      width="120">
      <template v-slot="scope">
        <el-tag type="primary" v-if="scope.row.openState === '开放'">开放</el-tag>
        <el-tag type="info" v-if="scope.row.openState === '禁用'">禁用</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="paramsType"
      label="参数类型"
      width="240">
    </el-table-column>
    <el-table-column
      prop="returnType"
      label="返回值类型"
      width="240">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="340">
      <template v-slot="scope">
        <el-button
          @click="changeValue(scope.row.id)"
          type="primary"
          size="small"
          plain
        >
          修改
        </el-button>
        <el-button
          @click="deleteInterface(scope.row.id)"
          type="danger"
          size="small"
          plain
        >
          删除
        </el-button>
        <el-button
          @click="disableInterface(scope.row.id)"
          type="warning"
          size="small"
          v-if="scope.row.openState === '开放'"
          plain
        >
          禁用
        </el-button>
        <el-button
          @click="openInterface(scope.row.id)"
          type="warning"
          size="small"
          v-if="scope.row.openState === '禁用'"
          plain
        >
          开放
        </el-button>
        <el-button
          @click="secureInterface(scope.row.id)"
          type="info"
          size="small"
          plain
        >
          保护接口
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <Pagination v-bind:child-msg="pageParm" @callFather="callFather"></Pagination>
  <!-- 编辑界面 -->
  <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
    <el-form label-width="80px" ref="editForm" :model="editForm">
      <el-form-item label="接口编号" prop="code">
        <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="请输入接口编号"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入接口名称"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="url">
        <el-input size="small" v-model="editForm.url" placeholder="请输入接口路径">
        </el-input>
      </el-form-item>
      <el-form-item label="安全状态" prop="securityState">
        <el-radio v-model="editForm.securityState" label="保护">保护</el-radio>
        <el-radio v-model="editForm.securityState" label="直接访问">直接访问</el-radio>      </el-form-item>
      <el-form-item label="开放状态" prop="openState">
        <el-radio v-model="editForm.openState" label="男">开放</el-radio>
        <el-radio v-model="editForm.openState" label="女">禁用</el-radio>
      </el-form-item>
      <el-form-item label="参数类型" prop="paramsType">
        <el-input v-model="editForm.paramsType" placeholder="请输入参数类型"></el-input>
      </el-form-item>
      <el-form-item label="返回值类型" prop="returnType">
        <el-input v-model="editForm.returnType" placeholder="请输入返回值类型"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
      <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import Pagination from "../../components/Pagination.vue";

export default {
  name: "Interface",
  components: {Pagination},
  data() {
    return {
      title: '添加接口',
      // 编辑与添加
      editForm: {
        code: "",
        name: "",
        url: "",
        securityState: "",
        openState: "",
        paramsType: "",
        returnType: "]",
        token: localStorage.getItem('logintoken')
      },
      // 请求数据参数
      formInline: {
        page: 1,
        limit: 10,
        deptId: '',
        userName: '',
        userMobile: '',
        isLock: ''
      },
      interfaceList: [],
      // 分页参数
      pageParm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      selectData: [],
    }
  },
  methods: {
    // 获取接口列表
    getData() {
      this.loading = true
      let res = {
        code: 0,
        msg: "ok",
        count: 12,
        data: [
          {
            code: "INTER0001",
            name: "上传图片",
            url: "/obj-list/upload-fits-list",
            securityState: "受保护",
            openState: "开放",
            paramsType: "FitFile[]",
            returnType: "ObjView[]"
          },
          {
            code: "INTER0002",
            name: "轨道状态分析",
            url: "/obj-analyze/orbit-state-perception",
            securityState: "受保护",
            openState: "禁用",
            paramsType: "String",
            returnType: "OrbitState"
          },
          {
            code: "INTER0003",
            name: "姿态状态分析",
            url: "/obj-analyze/posture-state-perception",
            securityState: "未保护",
            openState: "禁用",
            paramsType: "String",
            returnType: "{LightCurve, PoseState}"
          }
        ]
      }
      this.loading = false
      this.interfaceList = res.data
      this.pageParm.currentPage = this.formInline.page
      this.pageParm.pageSize = this.formInline.limit
      this.pageParm.total = res.count
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row !== undefined && row !== 'undefined') {
        this.title = '修改接口'
        this.editForm.code = row.code
        this.editForm.name = row.name
        this.editForm.url = row.url
        this.editForm.securityState = row.securityState
        this.editForm.openState = row.openState
        this.editForm.paramsType = row.paramsType
        this.editForm.returnType = row.returnType
      } else {
        this.title = '添加接口'
        this.editForm.code = ''
        this.editForm.name = ''
        this.editForm.url = ''
        this.editForm.securityState = ''
        this.editForm.openState = ''
        this.editForm.paramsType = ''
        this.editForm.returnType = ''
      }
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getData(this.formInline)
    },
    //搜索事件
    search() {
      this.getData(this.formInline)
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog === 'edit') {
        this.editFormVisible = false
      }
    },
    // 编辑、添加提交方法
    submitForm(editData) {
      this.editFormVisible = false
      console.log(editData)
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>
.user-search {
  margin-top: 20px;
}
</style>
