import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import LandingPage from '@/views/LandingPage.vue'
import MyReport from '@/views/MyReport.vue'
import ChatWindow from '@/views/ChatWindow.vue'
import ResultPage from '@/views/ResultPage.vue'
import List from '@/views/List.vue'
import Tool from './unit/tool.js'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: Tool.is_cosleep() ? '/home' : '/',
      name: 'home',
      component: Home
    },
    {
      path: '/lp',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/mp',
      name: 'MyReport',
      component: MyReport
    },
    {
      path: '/cw',
      name: 'ChatWindow',
      component: ChatWindow
    },
    {
      path: '/rp',
      name: 'ResultPage',
      component: ResultPage
    },
    {
      path: Tool.is_cosleep() ? '/' : '/list',
      name: 'List',
      component: List
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
