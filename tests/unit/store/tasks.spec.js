import { createStore } from 'vuex'
import tasksModule from '@/store/modules/tasks'

describe('Vuex: Tasks Module', () => {
    let store

    beforeEach(() => {
        store = createStore({
            modules: {
                tasks: { ...tasksModule, namespaced: true }
            }
        })
    })
    
    it('should return tasks filtered by projectId', () => {
        const projectId = 1
        const filteredTasks = store.getters['tasks/getTasksByProjectId'](projectId)
        expect(filteredTasks).toEqual([])
    })
    
    it('should add a new task to the state', () => {
        const newTask = { id: 3, name: 'Task 3', priority: 'Medium', status: 'in progress' }

        store.commit('tasks/addTask', newTask)

        expect(store.state.tasks.tasks).toContainEqual(newTask)
    })
    
    it('should dispatch addTask and commit addTask', async () => {
        const newTask = { id: 4, name: 'Task 4', priority: 'High', status: 'completed' }

        await store.dispatch('tasks/addTask', newTask)

        expect(store.state.tasks.tasks).toContainEqual(newTask)
    })
})
