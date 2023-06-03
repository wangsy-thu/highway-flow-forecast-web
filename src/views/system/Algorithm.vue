<template>
<div>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>算法管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索筛选过滤 -->
  <el-form :inline="true" :model="formInline" class="algorithm-search">
    <el-form-item label="搜索">
      <el-input size="small" v-model="formInline.name" placeholder="输入算法名称"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="handleEdit()">添加</el-button>
    </el-form-item>
  </el-form>
  <!-- 接口管理列表 -->
  <el-table
    border
    :data="algorithmList"
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
      prop="desc"
      label="介绍"
      width="280">
    </el-table-column>
    <el-table-column
      prop="useState"
      label="启用状态"
      width="120">
      <template v-slot="scope">
        <el-tag type="primary" v-if="scope.row.useState === '启用'">启用</el-tag>
        <el-tag type="info" v-if="scope.row.useState === '禁用'">禁用</el-tag>
      </template>
    </el-table-column>
    <el-table-column
      prop="inputType"
      label="输入类型"
      width="240">
    </el-table-column>
    <el-table-column
      prop="outputType"
      label="输出类型"
      width="240">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="220">
      <template v-slot="scope">
        <el-button
          @click="handleEdit(scope.$index, scope.row)"
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
          @click=""
          type="warning"
          size="small"
          v-if="scope.row.useState === '启用'"
          plain
        >
          禁用
        </el-button>
        <el-button
          @click=""
          type="warning"
          size="small"
          v-if="scope.row.useState === '禁用'"
          plain
        >
          启用
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <Pagination v-bind:child-msg="pageParm" @callFather="callFather"></Pagination>
  <!-- 编辑界面 -->
  <el-dialog :title="title" :visible.sync="editFormVisible" width="40%" @click='closeDialog("edit")'>
    <el-form label-width="100px" ref="editForm" :model="editForm">
      <el-form-item label="算法编号" prop="code">
        <el-input size="small" v-model="editForm.code" auto-complete="off" placeholder="请输入算法编号"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input size="small" v-model="editForm.name" auto-complete="off" placeholder="请输入算法名称"></el-input>
      </el-form-item>
      <el-form-item label="使用状态" prop="useState">
        <el-radio v-model="editForm.useState" label="开放">开放</el-radio>
        <el-radio v-model="editForm.useState" label="禁用">禁用</el-radio>
      </el-form-item>
      <el-form-item label="输入类型" prop="inputType">
        <el-input v-model="editForm.inputType" placeholder="请填写输入类型"></el-input>
      </el-form-item>
      <el-form-item label="输出类型" prop="outputType">
        <el-input v-model="editForm.outputType" placeholder="请填写输出类型"></el-input>
      </el-form-item>
      <el-form-item label="上传算法文件">
        <el-upload
          class="upload-demo"
          :auto-upload="false"
          action=""
          :file-list="fileList"
          :on-change="handleChange">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
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
  name: "Algorithm",
  components: {Pagination},
  data() {
    return {
      fileList: [],
      title: '添加算法',
      formInline: {
        page: 1,
        limit: 10,
        name: ''
      },
      algorithmList: [],
      // 分页参数
      pageParm: {
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      loading: false, //是显示加载
      editFormVisible: false, //控制编辑页面显示与隐藏
      editForm: {
        code: "",
        name: "",
        desc: "",
        useState: "",
        inputType: "",
        outputType: ""
      }
    }
  },
  methods: {
    getData() {
      let res = {
        code: 0,
        msg: "ok",
        count: 12,
        data: [
          {
            id: 1,
            code: "ALGO0001",
            name: "SVM",
            desc: "支持向量机",
            useState: "启用",
            inputType: "Matrix",
            outputType: "Vector"
          },
          {
            id: 2,
            code: "ALGO0002",
            name: "Naive Bayes",
            desc: "朴素贝叶斯",
            useState: "禁用",
            inputType: "Matrix",
            outputType: "Vector"
          }
        ]
      }
      this.loading = false
      this.algorithmList = res.data
      this.pageParm.currentPage = this.formInline.page
      this.pageParm.pageSize = this.formInline.limit
      this.pageParm.total = res.count
    },
    // 分页插件事件
    callFather(parm) {
      this.formInline.page = parm.currentPage
      this.formInline.limit = parm.pageSize
      this.getData(this.formInline)
    },
    // 关闭编辑、增加弹出框
    closeDialog(dialog) {
      if (dialog === 'edit') {
        this.editFormVisible = false
      }
    },
    // 选择文件时，往fileList里添加
    handleChange(fileList) {
      this.fileList.push(fileList)
    },
    handleEdit: function(index, row) {
      this.editFormVisible = true
      if (row !== undefined && row !== 'undefined') {
        this.title = '修改算法'
        this.editForm.code = row.code
        this.editForm.name = row.name
        this.editForm.desc = row.desc
        this.editForm.useState = row.useState
        this.editForm.inputType = row.inputType
        this.editForm.outputType = row.outputType
      } else {
        this.title = '添加算法'
        this.editForm.code = ''
        this.editForm.name = ''
        this.editForm.desc = ''
        this.editForm.useState = ''
        this.editForm.inputType = ''
        this.editForm.outputType = ''
      }
    },
  },
  created() {
    this.getData()
  }
}
</script>

<style scoped>
.algorithm-search {
  margin-top: 20px;
}
</style>
