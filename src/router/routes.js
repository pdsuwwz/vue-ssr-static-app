
const Home = () => import('../page/Home/index.vue')
const Test = () => import('../components/Test/index.vue')
const Test2 = () => import('../components/Hello/index.vue')

export default [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/test',
    component: Test
  },
  {
    path: '/test2',
    component: Test2
  }
]
