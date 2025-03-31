import { mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createStore } from 'vuex'
import ProjectsList from '@/views/ProjectsList.vue'

const vuetify = createVuetify({
    components,
    directives,
})

global.ResizeObserver = require('resize-observer-polyfill')

const store = createStore({
    modules: {
        projects: {
            namespaced: true,
            state: {
                projects: [{ id: 1, name: 'Test Project' }],
                loading: false,
            },
            getters: {
                projectsCount: (state) => state.projects.length,
            }
        }
    }
})

test('displays projects count from store', () => {
    const wrapper = mount(ProjectsList, {
        global: {
            plugins: [vuetify, store],
        }
    })
    
    expect(wrapper.text()).toContain('1')
})

test('projectsCount getter works correctly', () => {
    const projectsCount = store.getters['projects/projectsCount']
    expect(projectsCount).toBe(1)
})