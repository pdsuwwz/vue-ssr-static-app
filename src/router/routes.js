
const Home = () => import('../page/Home/index.vue')
const Test = () => import('../components/Test/index.vue')

export default [
  {
    path: '/home',
    component: Home
  },
  {
    path: '/test',
    component: Test
  }
]
