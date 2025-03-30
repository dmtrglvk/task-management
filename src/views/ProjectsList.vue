<template>
  <v-container max-width="900px">
    <div
        v-if="loading"
        class="text-center py-10"
    >
      <v-progress-circular indeterminate />
    </div>
    <div v-else>
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-left">Projects Overview ({{ projectsCount }})</h2>
        <v-btn
            color="primary"
            @click="addProject"
        >
          <v-icon>mdi-plus</v-icon>Add New Project
        </v-btn>
      </div>

      <v-list lines="two">
        <v-list-item
            v-for="project in projects"
            :key="project.id"
            :subtitle="project.createdAt"
            :title="project.title"
            link
            @click="$router.push(`/projects/${project.id}`)"
        >
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon
                  color="white"
                  size="small"
              >
                mdi-file-tree
              </v-icon>
            </v-avatar>
          </template>
          <template v-slot:append>
            <v-btn
                size="small"
                class="ml-2"
                @click.stop="editProject(project)"
                variant="tonal"
                icon
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
                color="error"
                size="small"
                class="ml-2"
                @click.stop="deleteProject(project.id)"
                variant="tonal"
                icon
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
      
      <project-form
          v-model:show="showDialog"
          :model="projectForm"
          :mode="dialogMode"
          @submitProject="submitProject"
      />
    </div>
  </v-container>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useForm } from '@/compositions/useForm'
import ProjectForm from '@/components/projects/ProjectForm.vue'

export default {
  components: {
    ProjectForm
  },
  setup() {
    const store = useStore()
    
    const projects = computed(() => store.state.projects.projects)
    const loading = computed(() => store.state.projects.loading)
    const projectsCount = computed(() => store.getters['projects/projectsCount'])
    
    const showDialog = ref(false)
    const dialogMode = ref('add')

    onMounted(() => {
      store.dispatch('projects/fetchProjects')
    })

    const {
      form: projectForm,
      submit: submitProject,
      reset
    } = useForm(
        { id: null, title: '', description: '' },
        (project) => {
          if (dialogMode.value === 'add') {
            const { projects } = store.state.projects
            const newId = projects.length ? Math.max(...projects.map(project => project.id || 0)) + 1 : 1
            project.id = newId
            store.dispatch('projects/addProject', {
              id: newId,
              ...project,
              tasks: [],
              createdAt: formatDate(new Date())
            })
          } else {
            store.dispatch('projects/updateProject', project)
          }
          showDialog.value = false
        }
    )
    
    const formatDate = (date) => {
      const d = new Date(date)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()

      return `${day}/${month}/${year}`
    }

    const addProject = () => {
      dialogMode.value = 'add'
      reset()
      showDialog.value = true
    }

    const editProject = (project) => {
      dialogMode.value = 'edit'
      projectForm.value = { ...project }
      showDialog.value = true
    }

    const deleteProject = (id) => {
      store.dispatch('projects/deleteProject', id)
    }

    return {
      loading,
      projectsCount,
      projects,
      showDialog,
      projectForm,
      dialogMode,
      submitProject,
      addProject,
      deleteProject,
      editProject
    }
  }
}
</script>
