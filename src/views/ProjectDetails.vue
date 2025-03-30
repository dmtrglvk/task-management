<template>
  <v-container
      v-if="project"
      max-width="900px"
  >
    <div class="mb-6">
      <v-btn
          color="secondary"
          @click="$router.push('/')"
      >
        <v-icon>mdi-arrow-left</v-icon>Back to Projects
      </v-btn>
    </div>

    <h2>{{ project.title }}</h2>
    <p class="mb-6">{{ project.description }}</p>

    <div
        v-if="loading"
        class="text-center py-10"
    >
      <v-progress-circular indeterminate />
    </div>
    <div v-else>
      <v-btn
          color="green"
          @click="addNewTask"
      >
        <v-icon>mdi-plus</v-icon>Add new task
      </v-btn>

      <div
          v-if="tasks.length"
          class="d-flex align-center justify-space-between mt-4"
      >
        <h3>Tasks</h3>
        <div class="d-flex">
          <v-select
              width="180"
              density="compact"
              label="Filter by priority"
              v-model="filterBy"
              :items="['From low to high', 'From high to low']"
              variant="outlined"
              hide-details
          />
          <v-select
              class="ml-3"
              width="180"
              density="compact"
              v-model="sortBy"
              label="Sort by"
              :items="['Unassigned', 'In Progress', 'Pending', 'Completed']"
              variant="outlined"
              hide-details
          />
        </div>
      </div>
      <h4
          v-else
          class="mt-4 text-center font-weight-medium"
      >No tasks yet</h4>

      <v-list lines="two">
        <v-list-item
            v-for="task in filteredAndSortedTasks"
            :key="task.id"
            :title="task.title"
        >
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon
                  color="white"
                  size="small"
              >
                mdi-calendar-check
              </v-icon>
            </v-avatar>
          </template>
          <template v-slot:subtitle>
            {{ task.priority }} | {{ task.assignee }} | {{ task.dueDate }} | {{ task.status }} | {{ task.estimate }}
          </template>
          <template v-slot:append>
            <v-btn
                size="small"
                class="ml-2"
                @click.stop="editTask(task)"
                variant="tonal"
                icon
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
                color="error"
                size="small"
                class="ml-2"
                @click.stop="deleteTask(task.id)"
                variant="tonal"
                icon
            >
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </div>
  </v-container>
  <task-form
      v-model:show="showDialog"
      :model="taskForm"
      :mode="dialogMode"
      @submitTask="submitTask"
  />
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { useForm } from '@/compositions/useForm'

export default {
  components: {
    TaskForm
  },
  props: ['id'],
  setup() {
    const store = useStore()
    const route = useRoute()

    onMounted(() => {
      store.dispatch('tasks/fetchTasks')
    })

    const loading = computed(() => store.state.tasks.loading)
    const projectId = Number(route.params.id)
    const project = computed(() => store.getters['projects/project'](projectId))
    const tasks = computed(() => store.getters['tasks/getTasksByProjectId'](projectId))
    
    const showDialog = ref(false)
    const dialogMode = ref('add')
    const filterBy = ref(null)
    const sortBy = ref(null)

    const priorityOrder = {
      Low: 0,
      Medium: 1,
      High: 2
    }

    const filteredAndSortedTasks = computed(() => {
      let filteredTasks = tasks.value
      
      if (sortBy.value) {
        filteredTasks = filteredTasks.filter(task => task.status.toLowerCase() === sortBy.value.toLowerCase())
      }
      
      return [...filteredTasks].sort((a, b) => {
        return filterBy.value?.toLowerCase() === 'from low to high'
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    })
    
    const updateFilters = (filter, status) => {
      filterBy.value = filter
      sortBy.value = status
    }

    const {
      form: taskForm,
      submit: submitTask,
      reset
    } = useForm(
        {
          id: null,
          title: '',
          priority: '',
          assignee: 'Unassigned',
          dueDate: '',
          status: 'Backlog',
          estimate: ''
        },
        (task) => {
          if (dialogMode.value === 'add') {
            const newId = tasks.value.length ? Math.max(...tasks.value.map(t => t.id || 0)) + 1 : 1
            task.id = newId
            store.dispatch('tasks/addTask', {
              projectId: projectId,
              id: newId,
              ...task
            })
          } else {
            store.dispatch('tasks/updateTask', task)
          }
          showDialog.value = false
          reset()
        }
    )

    const addNewTask = () => {
      dialogMode.value = 'add'
      reset()
      showDialog.value = true
    }

    const editTask = (task) => {
      dialogMode.value = 'edit'
      Object.assign(taskForm.value, task)
      showDialog.value = true
    }

    const deleteTask = (taskId) => {
      store.dispatch('tasks/deleteTask', taskId)
    }

    return {
      project,
      tasks,
      showDialog,
      taskForm,
      dialogMode,
      loading,
      filterBy,
      sortBy,
      filteredAndSortedTasks,
      updateFilters,
      submitTask,
      addNewTask,
      editTask,
      deleteTask
    }
  }
}
</script>
