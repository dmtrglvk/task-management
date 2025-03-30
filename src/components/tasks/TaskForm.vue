<template>
  <v-dialog v-model="isShown" max-width="500px">
    <v-card class="pa-4">
      <h3 class="mb-4">{{ mode === 'add' ? 'Add New Task' : 'Edit Task' }}</h3>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
            label="Task Title"
            v-model="model.title"
            variant="outlined"
            :rules="[v => !!v || 'Title is required']"
        />
        <v-select
            label="Assignee"
            v-model="model.assignee"
            :items="['Joe Biden', 'Alice Smith', 'John Doe']"
            variant="outlined"
            :rules="[v => !!v || 'Assignee is required']"
        />
        <v-select
            label="Priority"
            v-model="model.priority"
            :items="['Low', 'Medium', 'High']"
            variant="outlined"
            :rules="[v => !!v || 'Priority is required']"
        />
        <v-text-field
            label="Estimate (story points)"
            v-model="model.estimate"
            variant="outlined"
            :rules="[v => !!v || 'Estimate is required']"
        />

        <v-text-field
            v-model="formattedDate"
            label="Due Date"
            readonly
            @click="menu = true"
            :rules="[v => !!v || 'Due date is required']"
        />
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            min-width="auto"
            offset-y
            attach=""
        >
          <v-card>
            <v-date-picker
                v-model="date"
                @update:model-value="updateDate"
            />
          </v-card>
        </v-menu>
      </v-form>

      <div class="d-flex justify-space-between">
        <v-btn
            color="success"
            @click="submitTask"
            :disabled="!valid"
        >
          <v-icon>{{ mode === 'add' ? 'mdi-plus' : 'mdi-check' }}</v-icon>
          {{ mode === 'add' ? 'Add Task' : 'Update Task' }}
        </v-btn>
        <v-btn
            color="grey"
            class="ml-2"
            @click="closeDialog"
        >
          <v-icon class="mr-1">mdi-cancel</v-icon>Cancel
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { format, parse, isValid } from 'date-fns'

export default {
  props: {
    show: Boolean,
    model: Object,
    mode: String
  },
  emits: ['update:show', 'submitTask'],

  setup(props, { emit }) {
    const isShown = computed({
      get: () => props.show,
      set: (value) => emit('update:show', value)
    })

    const menu = ref(false)
    const date = ref(null)
    const valid = ref(false)
    
    const parseToISO = (dateStr) => {
      if (!dateStr) return ''
      const parsed = parse(dateStr, 'dd/MM/yyyy', new Date())
      return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : ''
    }
    
    const formatToDisplay = (isoDate) => {
      if (!isoDate) return ''
      const parsed = new Date(isoDate)
      return isValid(parsed) ? format(parsed, 'dd/MM/yyyy') : ''
    }
    
    watch(
        () => props.model.dueDate,
        (newDate) => {
          if (newDate) {
            date.value = parseToISO(newDate)
          } else {
            date.value = ''
          }
        },
        { immediate: true }
    )
    
    const formattedDate = computed(() => (date.value ? formatToDisplay(date.value) : ''))
    
    const updateDate = (newDate) => {
      if (!newDate) return
      date.value = newDate
      props.model.dueDate = formatToDisplay(newDate)
      menu.value = false
    }

    const submitTask = () => {
      if (valid.value) {
        emit('submitTask')
      }
    }

    return {
      isShown,
      menu,
      date,
      formattedDate,
      valid,
      updateDate,
      submitTask,
      closeDialog: () => (isShown.value = false)
    }
  }
}
</script>
