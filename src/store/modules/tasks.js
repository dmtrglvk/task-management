import { fetchTasks } from '@/api/apiTasks'

export default {
    namespaced: true,

    state: {
        tasks: [],
        loading: false
    },

    getters: {
        getTasksByProjectId: (state) => (projectId) => {
            return state.tasks.filter(task => task.projectId === projectId)
        }
    },

    mutations: {
        setTasks(state, tasks) {
            state.tasks = tasks ? tasks : []
        },
        setLoading(state, status) {
            state.loading = status
        },
        addTask(state, task) {
            state.tasks.push(task)
        },
        updateTask(state, updatedTask) {
            const index = state.tasks.findIndex(task => task.id === updatedTask.id)
            if (index !== -1) {
                state.tasks[index] = updatedTask
            }
        },
        deleteTask(state, taskId) {
            state.tasks = state.tasks.filter(task => task.id !== taskId)
        }
    },

    actions: {
        async fetchTasks({ commit, state }) {
            if (!state.tasks || state.tasks.length === 0) {
                commit('setLoading', true)
                try {
                    const data = await fetchTasks()
                    commit('setTasks', data)
                } catch (error) {
                    console.error('Error fetching tasks:', error)
                }
                commit('setLoading', false)
            }
        },
        addTask({ commit }, task) {
            commit('addTask', task)
        },
        updateTask({ commit }, task) {
            commit('updateTask', task)
        },
        deleteTask({ commit }, taskId) {
            commit('deleteTask', taskId)
        }
    }
}
