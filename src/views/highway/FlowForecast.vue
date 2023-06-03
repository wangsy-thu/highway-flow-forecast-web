<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>高速流量预测</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 预测流量参数 -->
    <el-form :inline="true" :model="formInline" class="flow-forecast-search">
      <el-form-item label="节点编号">
        <el-input-number size="small" v-model="formInline.code" :min="0" :max="306" @change="nodeChange" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="forecast">预测</el-button>
        <el-button size="small" plain type="primary" icon="el-icon-plus" @click="showUploadDialog=true">上传历史流量</el-button>
      </el-form-item>
    </el-form>
    <!--流量展示图-->
    <el-card>
      <div class="st-gbox">
        <div class="cavasbox" ref="FlowForecastChart"></div>
      </div>
    </el-card>
    <!-- 新增弧段页面 -->
    <el-dialog :title="title" :visible.sync="showUploadDialog" style="width: 100%">
      <el-card>
        <el-upload
          ref="upload"
          class="upload-demo"
          action=""
          :multiple="false"
          :auto-upload="false"
          :file-list="fileList"
          :on-change="handleChange"
        >
          <el-button size="small" slot="trigger" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="danger"
            plain
            @click="uploadForm"
          >上传到系统</el-button>
          <div slot="tip" class="el-upload__tip">只能上传npz格式的文件列表</div>
        </el-upload>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import Chart from "echarts";

export default {
  name: 'FlowForecast',
  data() {
    return {
      formInline: {
        code: '0'
      },
      title: '上传历史数据',
      fileList: [],
      forecastFlowList: [
        300, 280, 250, 260, 270, 300,
        550, 500, 400, 390, 380, 390,
        400, 500, 600, 750, 800, 700,
        400, 500, 600, 750, 800, 700
      ],
      showUploadDialog: false,
    }
  },
  methods: {
    async forecast() {
      await this.getFlowForecastData()
      this.showFlowForecastChart()
    },
    uploadForm() {
      this.$refs.upload.submit()
      if (this.fileList.length === 0) {
        this.$message.warning('请选取文件')
        return
      }
      const formData = new FormData()
      // 因为要传一个文件数组过去，所以要循环append
      this.fileList.forEach(file => {
        formData.append('file', file.raw)
      })
      this.$axios.post('/upload-history-flow', formData).then(() => {
        this.$message.success('历史数据上传，预测开始！')
        this.$axios.get('/forecast-npz-flow').then(() => {
          this.$message.success('预测成功！')
          this.showUploadDialog = false
          this.getFlowForecastData()
          this.showFlowForecastChart()
        })
      }).catch(() => {
        this.$message.error('数据上传失败！')
      })
      this.fileList = []
    },
    async getFlowForecastData() {
      const {data: res} = await this.$axios.get('/query-forecast-result', {
        params: {
          'nodeId': this.formInline.code
        }
      })
      this.forecastFlowList = res.data
    },
    showFlowForecastChart() {
      const option = {
        title: {
          text: 'Highway Flow Forecast Result ' + 'node id: ' + this.formInline.code,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // prettier-ignore
          data: [
            '00:05', '00:10', '00:15', '00:20', '00:25', '00:30',
            '00:35', '00:40', '00:45', '00:50', '00:55', '01:00',
            '01:05', '01:10', '01:15', '01:20', '01:25', '01:30',
            '01:35', '01:40', '01:45', '01:50', '01:55', '02:00'
          ]
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} cars'
          },
          axisPointer: {
            snap: true
          }
        },
        visualMap: {
          show: false,
          dimension: 0,
          pieces: [
            {
              lt: 12,
              color: 'green'
            },
            {
              gte: 12,
              lte: 24,
              color: 'red'
            }
          ]
        },
        series: [
          {
            name: 'Highway Flow',
            type: 'line',
            smooth: true,
            // prettier-ignore
            data: this.forecastFlowList,
            markArea: {
              itemStyle: {
                color: 'rgba(255, 173, 177, 0.4)'
              },
              data: [
                [
                  {
                    name: 'Forecast Flow',
                    xAxis: '01:05'
                  },
                  {
                    xAxis: '02:00'
                  }
                ]
              ]
            }
          }
        ]
      }
      this.chart = Chart.init(this.$refs.FlowForecastChart)
      this.chart.setOption(option)
    },
    handleChange(fileList) {
      this.fileList.push(fileList)
    },
    async nodeChange(value) {
      console.log(value)
      this.formInline.code = value
      await this.getFlowForecastData()
      this.showFlowForecastChart()
    }
  },
  mounted() {
    this.showFlowForecastChart()
  }
}

</script>
<style scoped>
.flow-forecast-search {
  margin-top: 20px;
}
.st-gbox {
  background-color: #fff;
  margin-top: 5px;
  border-radius: 5px;
  height: 40vh;
  box-sizing: border-box;
  padding: 10px;
}
.cavasbox {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>
