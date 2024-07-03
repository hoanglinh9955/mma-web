import { defineStore } from 'pinia'

export const reloadState = defineStore('state', () => {
  const reloadState = ref(1)
  const token = ref('')
  return { reloadState, token }
})
