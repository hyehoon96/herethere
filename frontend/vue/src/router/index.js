import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'


import ChatRoom from '../components/ChatRoom.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true,
    children: [
      {
        path: '/room/:roomNumber',
        name: 'ChatRoom',
        component: ChatRoom,
        props: true,

      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    
  },
  {
    path: '/history',
    name: 'History',
    component: () => import(/* webpackChunkName: "LoginUser" */ '../views/History.vue'),
  },
  {
    path: '/info',
    name: 'Information',
    component: () => import(/* webpackChunkName: "Info" */ '../views/Information.vue'),
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
