import { createRouter, createWebHistory } from 'vue-router'
import ProjectsList from '../views/ProjectsList.vue'
import ProjectDetails from '../views/ProjectDetails.vue'

const routes = [
  {
    path: '/',
    name: 'projects overview',
    component: ProjectsList
  },
  {
    path: '/projects/:id',
    name: 'project details',
    component: ProjectDetails,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
