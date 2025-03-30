import {fetchProjects} from '@/api/apiProjects'

export default {
    namespaced: true,

    state: {
        projects: [],
        loading: false
    },

    getters: {
        projectsCount: state => state.projects.length,
        project: (state) => (projectId) => {
            return state.projects.find(project => project.id === projectId)
        }
    },

    mutations: {
        setProjects(state, projects) {
            state.projects = projects ? projects : []
        },
        setLoading(state, status) {
            state.loading = status
        },
        addProject(state, project) {
            state.projects.push(project)
        },
        updateProject(state, updatedProject) {
            const index = state.projects.findIndex(proj => proj.id === updatedProject.id)
            if (index !== -1) {
                state.projects[index] = updatedProject
            }
        },
        deleteProject(state, projectId) {
            state.projects = state.projects.filter(proj => proj.id !== projectId)
        }
    },

    actions: {
        async fetchProjects({ commit, state }) {
            if (!state.projects || state.projects.length === 0) {
                commit('setLoading', true)
                try {
                    const data = await fetchProjects()
                    commit('setProjects', data)
                } catch (error) {
                    console.error('Error fetching projects:', error)
                }
                commit('setLoading', false)
            }
        },
        addProject({ commit }, project) {
            commit('addProject', project)
        },
        updateProject({ commit }, project) {
            commit('updateProject', project)
        },
        deleteProject({ commit }, projectId) {
            commit('deleteProject', projectId)
        }
    }
}
