import { defineStore } from 'pinia'

export const reloadState = defineStore('state', () => {
  const reloadState = ref(1)
  const token = ref('')
  const userInfor = ref(null)
  const checkAuth = ref(1)
  return { reloadState, token, userInfor, checkAuth }
})
