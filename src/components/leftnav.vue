/**
* 左边菜单
*/
<template>
  <el-menu default-active="2" :collapse="collapsed" collapse-transition router :default-active="$route.path" unique-opened class="el-menu-vertical-demo" background-color="#334157" text-color="#fff" active-text-color="#ffd04b">
    <div class="logobox">
      <img class="logoimg" src="../assets/img/logo.png" alt="" @click="gotoMain()">
    </div>
    <el-submenu v-for="menu in allmenu" :key="menu.menuid" :index="menu.menuname">
      <template slot="title">
        <i class="iconfont" :class="menu.icon"></i>
        <span>{{menu.menuname}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="chmenu in menu.menus" :index="'/'+chmenu.url" :key="chmenu.menuid">
          <i class="iconfont" :class="chmenu.icon"></i>
          <span>{{chmenu.menuname}}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>
export default {
  name: 'leftnav',
  data() {
    return {
      collapsed: false,
      allmenu: []
    }
  },
  methods: {
    gotoMain() {
      this.$router.push({path: '/welcome'})
    },
  },
  // 创建完毕状态(里面是操作)
  created() {
    // 获取图形验证码
    let res = {
      success: true,
      data: [
        {
          menuid: 1,
          icon: 'li-icon-xiangmuguanli',
          menuname: '系统管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 11,
              icon: 'icon-cus-manage',
              menuname: '权限管理',
              hasThird: 'N',
              url: 'system/Authority',
              menus: null
            },
            {
              menuid: 12,
              icon: 'icon-cms-manage',
              menuname: '接口管理',
              hasThird: 'N',
              url: 'system/Interface',
              menus: null
            },
            {
              menuid: 13,
              icon: 'li-icon-jichuguanli',
              menuname: '算法管理',
              hasThird: 'N',
              url: 'system/Algorithm',
              menus: null
            },
            {
              menuid: 14,
              icon: 'icon-cat-skuQuery',
              menuname: '模型管理',
              hasThird: 'N',
              url: 'system/DeepModule',
              menus: null
            }
          ]
        },
        {
          menuid: 2,
          icon: 'li-icon-shujujiankong',
          menuname: '高速流量管理',
          hasThird: null,
          url: null,
          menus: [
            {
              menuid: 21,
              icon: 'icon-cms-refri',
              menuname: '高速流量查询',
              hasThird: 'N',
              url: 'highway/FlowQuery',
              menus: null
            },
            {
              menuid: 22,
              icon: 'icon-promotion-manage',
              menuname: '高速流量预测',
              hasThird: 'N',
              url: 'highway/FlowForecast',
              menus: null
            }
          ]
        },
      ],
      msg: 'success'
    }
    this.allmenu = res.data

    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
  min-height: 400px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  border: none;
  text-align: left;
}
.el-menu-item-group__title {
  padding: 0px;
}
.el-menu-bg {
  background-color: #f5f7fa !important;
}
.el-menu {
  border: none;
}
.logobox {
  height: 40px;
  line-height: 40px;
  color: #9d9d9d;
  font-size: 20px;
  text-align: center;
  padding: 10px 0px;
}
.logoimg {
  height: 50px;
  width: 235px;
}
</style>
