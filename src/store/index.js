import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import projects from './modules/projects'
import tasks from './modules/tasks'

export default createStore({
  modules: {
    projects,
    tasks
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
      paths: ['projects', 'tasks']
    })
  ]
})
