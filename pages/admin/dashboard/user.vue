<template>
    <div>
        <UContainer>
          <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <UInput v-model="q" placeholder="Filter Order..." />
            <USelect v-model="selectedRole" :options="arrayRole" placeholder="Choose Role" />
          </div>
          <div class="flex justify-between p-4 border-b border-gray-200 dark:border-gray-700">

            <div class="flex justify-center items-center space-x-2">
              <UBadge 
                size="md" 
                label="Total User :"
                color="emerald"
                variant="subtle"
                />
              <h3>{{totalUsers}}</h3>
            </div>
      
            <div class="flex justify-center items-center space-x-2">
              <UBadge 
                size="md" 
                label="Total Instructor :"
                color="blue"
                variant="subtle"
                />
              <h3>{{totalInstructors}}</h3>
            </div>
            <div class="flex justify-center items-center space-x-2">
              <UBadge 
                size="md" 
                label="Total Staff :"
                color="orange"
                variant="subtle"
                />
              <h3>{{totalStaffs}}</h3>
            </div>
          </div>
            
              <UTable class="pt-2" :rows="filteredRows" :columns="columns">

                <template #role-data="{ row }">
                  <UBadge
                    size="xs"
                    :label="row.role"
                    :color="getColor(row.role)"
                    variant="subtle"
                  />
                </template>
              </UTable>
        </UContainer>
    </div>  
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const token = storeToRefs(reloadState()).token
const arrayRole = ['All', 'User', 'Instructor', 'Staff']
const users = ref(null)
const userList = ref(null)
const totalUsers = ref(0)
const totalInstructors = ref(0)
const totalStaffs = ref(0) 
const usersData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/admin/getAllUsers', {
  headers: {
        'Authorization': `Bearer ${token.value}`
    }
})
if(usersData.success){
  
  users.value = usersData.results.map((user, index) => {
    if(user.role === 'INSTRUCTOR'){
      totalInstructors.value += 1
    }
    if(user.role === 'STAFF'){
      totalStaffs.value += 1
    }
    if(user.role === 'USER'){
      totalUsers.value += 1
    }
    return {
      id: index + 1,
      user_name: user.user_name,
      email: user.email,
      role: user.role
    }
  })
  .filter((user) => {
    return user.role !== 'ADMIN'
  })
}

const columns = [{
  key: 'id',
}, {
  key: 'user_name',
  label: 'User Name'
}, 
{
  key: 'email',
  label: 'User Email'
},
{
  key: 'role',
  label: 'Role'
}]

const q = ref('')
const selectedRole = ref(null)
userList.value = users.value

watchEffect(() => {
  if (selectedRole.value === 'All') {
    userList.value = users.value
  }else if(selectedRole.value === 'User'){
    userList.value = users.value.filter((user) => {
      return user.role === 'USER'
    })
  }else if(selectedRole.value === 'Instructor'){
    userList.value = users.value.filter((user) => {
      return user.role === 'INSTRUCTOR'
    })
  }else if(selectedRole.value === 'Staff'){
    userList.value = users.value.filter((user) => {
      return user.role === 'STAFF'
    })
  }
})


const getColor = (role) => {
  if (role == 'USER') {
    return 'emerald'
  }
  else if (role == 'INSTRUCTOR') {
    return 'blue'
  }
  else if (role == 'STAFF') {
    return 'orange'
  }
}

const filteredRows = computed(() => {
  if (!q.value) {
    return userList.value
  }
  // q.value = q.value.trim()
  return userList.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
</script>