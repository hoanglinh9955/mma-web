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
            <div> 
              <UButton icon="i-heroicons-plus" variant="outline" @click="openAdd"/>
            </div>
          </div>
          <!-- amount price -->
          <div class="flex justify-around p-4 border-b border-gray-200 dark:border-gray-700">

            <div class="flex justify-center items-center space-x-2">
              <UBadge 
                size="md" 
                label="Total Amount :"
                color="purple"
                variant="subtle"
                />
              <h3>{{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}}</h3>
            </div>
      
            <div class="flex justify-center items-center space-x-2">
              <UBadge 
                size="md" 
                label="Total Order :"
                color="yellow"
                variant="subtle"
                />
              <h3>{{totalOrders}}</h3>
            </div>
            <div class="flex justify-center items-center space-x-2">
              <UBadge 
                size="md" 
                label="Profit :"
                color="cyan"
                variant="subtle"
                />
              <h3>{{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount/2)}}</h3>
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

                <template #status-data="{ row }">
                  <!-- <UBadge
                    size="xs"
                    :label="row.status === true ? 'Active' : 'Inactive'"
                    :color="row.status === true ? 'green' : 'red'"
                    variant="subtle"
                  /> -->
                  <UButton
                    class="w-16 block h-8"
                    :color="getColorButton(row.status)"
                    :ui="{ size: 'xs' }"
                    :label="getLabelButton(row.status)"
                    variant="outline"
                    @click="changeStatus(row)"
                  />
                </template>
              </UTable>
        </UContainer>
        <UModal v-model="isOpen">
          <div class="flex flex-col p-10 items-center space-y-5">
            <h3 class="text-xl font-medium text-center">Are you sure to {{ modalData.status == true ? 'Ban' : 'UnBan'  }} This User an Email will sent to User ?</h3>
            <div class="flex justify-around w-full"> 
              <UButton
                class="w-16 block h-8"
                color="red"
                :ui="{ size: 'xs' }"
                :label="getLabelButton(modalData.status)"
                variant="outline"
                @click="changeStatusFetch"
                :loading="isSubmit"
              />
              <UButton
                class="w-16 block h-8"
                color="green"
                :ui="{ size: 'xs' }"
                label="Cancel"
                variant="outline"
                @click="isOpen = false"
              />
            </div>
          </div>
        </UModal>
        <UModal v-model="isAddUser">
          <div class="flex flex-col p-10 items-center space-y-5">
            <h3 class="text-xl font-medium text-center">Add New User ?</h3>
            <h3>The default password will be <span class="font-medium text-red-500"> password </span></h3>
              <div class="flex flex-col space-y-2 w-full"> 
                <UFormGroup label="User Name" name="user_name">
                  <UInput placeholder="Nguyen Van A" v-model="user_name" />
                </UFormGroup>
                <UFormGroup label="Email" name="email">
                  <UInput placeholder="mma-web@gmail.com" v-model="email" />
                </UFormGroup>
                <UFormGroup class="pb-2" label="Role" name="role">
                  <USelect placeholder="choose role" :options="['INSTRUCTOR']" v-model="role" />
                </UFormGroup>
                
              </div>
              <UButton
                  block
                  icon="i-heroicons-check"
                  color="green"
                  :ui="{ size: 'xs' }"
                  label="Submit"
                  variant="outline"
                  @click="addNewUser"
                  :loading="isSubmit"
                />
          </div>
        </UModal>
    </div>  
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const token = storeToRefs(reloadState()).token
const reload = storeToRefs(reloadState()).reloadState
const checkAuth = storeToRefs(reloadState()).checkAuth
const arrayRole = ['All', 'User', 'Instructor']
const users = ref(null)
const userList = ref(null)
const totalUsers = ref(0)
const totalInstructors = ref(0)
const totalStaffs = ref(0) 
const isOpen = ref(false)
const isSubmit = ref(false)
const modalData = ref(null)
const isAddUser = ref(false)
const toast = useToast()
const totalAmount = ref(0)
const totalOrders = ref(0)

const orderArray = ref(null)
checkAuth.value++
const reloadSelect = ref(0)
const openAdd = () => {
  isAddUser.value = true
}

const getColorButton = (bool) => {
  if (bool == true) {
    return 'green'
  }
  else if (bool == false) {
    return 'red'
  }
}
const getLabelButton = (bool) => {
  if (bool == true) {
    return 'Ban'
  }
  else if (bool == false) {
    return 'UnBan'
  }
}

const user_name = ref('')
const email = ref('')
const role = ref('')

const changeStatus = (row) => {
  isOpen.value = true
  modalData.value = row
  console.log(row)
}



const addNewUser = async () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    toast.add({title: 'Error', description: 'Invalid email format', icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
    return
  }
  if(user_name.value === '' || email.value === '' || role.value === ''){
    let data = ''
    if(user_name.value === ''){
      data += 'User Name, '
    }
    if(email.value === ''){
      data += 'Email, '
    }
    if(role.value === ''){
      data += 'Role, '
    }
    toast.add({title: 'Error', description: `Please fill ${data} in form`, icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
  } else{

    isSubmit.value = true
  const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/addNewUser', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.value}`
    },
    body: {
      userData : {
        user_name: user_name.value,
        email: email.value,
        role: role.value
      
      }
    }
  })
  console.log(response)
  if(response.success){
   
    reload.value++
    isAddUser.value = false
    toast.add({title: 'Success', description: 'Add User Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
  }else{
    toast.add({title: 'Error', description: response.message, icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
  }
  isSubmit.value = false
  }

}

const changeStatusFetch = async () => {
  isSubmit.value = true
  const dataSent = {
    user_id: modalData.value.id,
    status: !modalData.value.status,
    email: modalData.value.email
  }

  const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/changeStatus', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.value}`
    },
    body: JSON.stringify(dataSent)
  })
  console.log(response)
  if(response.success){
    isOpen.value = false
    reload.value++
    isSubmit.value = false
    toast.add({title: 'Success', description: 'Change Status Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
  }

}
const orderData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/getOrder', {
  headers: {
    'Authorization': `Bearer ${token.value}`
  }
});

if (orderData.success) {
  const instructorTotals = {};
  totalAmount.value = 0
  totalOrders.value = 0
  orderData.result.forEach((order) => {
    totalAmount.value += order.price
    totalOrders.value += 1
    const { instructor_id, price } = order;
    if (!instructorTotals[instructor_id]) {
      instructorTotals[instructor_id] = 0;
    }
    instructorTotals[instructor_id] += price;
  });

  orderArray.value = Object.entries(instructorTotals).map(([instructor_id, total_price]) => {
    return { instructor_id: parseInt(instructor_id), total_price };
  });
  console.log(orderArray.value)
}

const usersData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/getAllUsers', {
  headers: {
        'Authorization': `Bearer ${token.value}`
    }
})

if(usersData.success){
  totalInstructors.value = 0
  totalStaffs.value = 0
  totalUsers.value = 0
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
      id: user.user_id,
      user_name: user.user_name,
      email: user.email,
      role: user.role,
      status: user.status,
      totalPrice: (orderArray.value.find((order) => order.instructor_id === user.user_id)?.total_price /2 || '').toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    }
  })
  .filter((user) => {
    return user.role !== 'ADMIN'
  }).filter((user) => {
    return user.role !== 'STAFF'
  })
}else{
  users.value = []

}

watch(reload, async () => {
  const usersData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/getAllUsers', {
  headers: {
        'Authorization': `Bearer ${token.value}`
    }
})
console.log(usersData)
if(usersData.success){
  totalInstructors.value = 0
  totalStaffs.value = 0
  totalUsers.value = 0
 userList.value = usersData.results.map((user, index) => {
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
      id: user.user_id,
      user_name: user.user_name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  })
  .filter((user) => {
    return user.role !== 'ADMIN'
  }).filter((user) => {
    return user.role !== 'STAFF'
  })
  if(selectedRole.value === 'All') {
    return userList.value
  }else if(selectedRole.value === 'User'){
    userList.value = userList.value.filter((user) => {
      return user.role === 'USER'
    })
  }else if(selectedRole.value === 'Instructor'){
    userList.value = userList.value.filter((user) => {
      return user.role === 'INSTRUCTOR'
    })
  }else if(selectedRole.value === 'Staff'){
    userList.value = userList.value.filter((user) => {
      return user.role === 'STAFF'
    })
  }
}else{
  users.value = []

}
})


const columns = [{
  key: 'id',
  label: 'ID'
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
},
{
  key: 'totalPrice',
  label: 'Total Price'
},
{
  key: 'status',
  label: 'Status',
  slot: 'status'
}
]

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
  }
})


const getColor = (role) => {
  if (role == 'USER') {
    return 'green'
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