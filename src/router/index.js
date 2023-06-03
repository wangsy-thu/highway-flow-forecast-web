// 导入组件
import Vue from 'vue';
import Router from 'vue-router';
// 登录
import login from '@/views/login';
// 首页
import index from '@/views/index';
import Authority from "@/views/system/Authority.vue";
import Interface from "@/views/system/Interface.vue";
import Algorithm from "@/views/system/Algorithm.vue";
import DeepModule from "@/views/system/DeepModule.vue";
import Welcome from "@/views/Welcome.vue";
import FlowForecast from "@/views/highway/FlowForecast.vue";
import FlowQuery from "@/views/highway/FlowQuery.vue";

// 启用路由
Vue.use(Router);

// 导出路由
export default new Router({
    routes: [{
        path: '/',
        name: '',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/login',
        name: '登录',
        component: login,
        hidden: true,
        meta: {
            requireAuth: false
        }
    }, {
        path: '/index',
        name: '首页',
        component: index,
        iconCls: 'el-icon-tickets',
        children: [{
          path: '/welcome',
          name: '欢迎页',
          component: Welcome,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/system/Authority',
          name: '权限管理',
          component: Authority,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/system/Interface',
          name: '接口管理',
          component: Interface,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/system/Algorithm',
          name: '算法管理',
          component: Algorithm,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/system/DeepModule',
          name: '模型管理',
          component: DeepModule,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/highway/FlowForecast',
          name: '高速流量预测',
          component: FlowForecast,
          meta: {
            requireAuth: true
          }
        }, {
          path: '/highway/FlowQuery',
          name: '高速流量预测',
          component: FlowQuery,
          meta: {
            requireAuth: true
          }
        }]
    }]
})
