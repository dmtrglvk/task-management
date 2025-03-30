import { createStore } from 'vuex'
import projectsModule from '@/store/modules/projects'

describe('Vuex: Projects Module', () => {
    let store

    beforeEach(() => {
        store = createStore({
            modules: {
                projects: { ...projectsModule, namespaced: true }
            }
        })
    })

    it('should return project found by projectId', () => {
        store.state.projects.projects = [
            { id: 1, name: 'Project A' },
            { id: 2, name: 'Project B' }
        ]
        
        const projectId = 1
        const project = store.getters['projects/project'](projectId)
        
        expect(project).toEqual({ id: 1, name: 'Project A' })
    })
})
