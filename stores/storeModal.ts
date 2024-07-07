import { defineStore } from 'pinia'

export const reloadState = defineStore('state', () => {
  const reloadState = ref(1)
  const token = ref('')
  const userInfor = ref(null)
  return { reloadState, token, userInfor }
})
