import { ref } from 'vue'

export function useForm(initialState, onSubmit) {
    const form = ref({ ...initialState })

    const submit = () => {
        if (onSubmit) {
            onSubmit(form.value)
        }
    }

    const reset = () => {
        form.value = { ...initialState }
    }

    return { form, submit, reset }
}
