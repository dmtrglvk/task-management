<template>
  <v-dialog v-model="isShown" max-width="500px">
    <v-card class="pa-4">
      <h3 class="mb-4">{{ mode === 'add' ? 'Add New Project' : 'Edit Project' }}</h3>
      
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
            label="Project Title"
            v-model="model.title"
            variant="outlined"
            :rules="[v => !!v || 'Title is required']"
        />

        <v-textarea
            label="Project Description"
            v-model="model.description"
            variant="outlined"
            :rules="[v => !!v || 'Description is required']"
        />

        <div class="d-flex justify-space-between">
          <v-btn
              color="success"
              @click="submitProject"
              :disabled="!valid"
          >
          <v-icon>{{ mode === 'add' ? 'mdi-plus' : 'mdi-check' }}</v-icon>
          {{ mode === 'add' ? 'Add Project' : 'Update Project' }}
          </v-btn>
          <v-btn
              color="grey"
              class="ml-2"
              @click="closeDialog"
          >
            <v-icon class="mr-1">mdi-cancel</v-icon>Cancel
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  props: {
    show: Boolean,
    model: Object,
    mode: String
  },
  emits: ['update:show', 'submitProject'],

  setup(props, { emit }) {
    const isShown = computed({
      get: () => props.show,
      set: (value) => emit('update:show', value)
    })

    const valid = ref(false)

    const submitProject = () => {
      if (valid.value) {
        emit('submitProject', props.model)
        isShown.value = false
      }
    }

    const closeDialog = () => {
      isShown.value = false
    }

    return {
      isShown,
      valid,
      submitProject,
      closeDialog
    }
  }
}
</script>
