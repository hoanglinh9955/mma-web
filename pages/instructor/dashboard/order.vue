<template>
    <div>
        <UContainer>
          <div>
            <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-200">Orders</h1>
   
          </div>
            <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <UInput v-model="q" placeholder="Filter Order..." />
                <!-- <USelect v-model="q" :options="mothArray" placeholder="Filter Order..." /> -->
              </div>
              <div class="flex px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                {{ Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount) }}
              </div>
          
              <UTable class="pt-2" :rows="filteredRows" :columns="columns" />
        </UContainer>
    </div>  
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const token = storeToRefs(reloadState()).token
const checkAuth = storeToRefs(reloadState()).checkAuth
const toast = useToast()
const totalAmount = ref(0)
const mothArray = ['July']
const orders = ref(null)
checkAuth.value++
const orderData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/getOrderByInstructor', {
  headers: {
        'Authorization': `Bearer ${token.value}`
    }
})
console.log(orderData)
if(orderData.success){
  orders.value = orderData.orderWithCourseAndChapter.map((order, index) => {
    totalAmount.value += order.price
    return {
      id: index + 1,
      user_name: order.user.user_name,
      email: order.user.email,
      title: order.course.title,
      price: `${order.price} VND`,
      price: Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(order.price),
      enrolled_at: new Date(order.enrolled_at).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
    }
  })

}else{
  // toast.add({title: 'Error', description: 'Please Upload All File And Type All Data Before Submit Form', icon: 'i-heroicons-information-circle', color: 'red', duration: 5000, isClosable: true})
  orders.value = []
  toast.add({title: 'Error', description: orderData.message, icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
}

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
  key: 'title',
  label: 'Course Title'
}, {
  key: 'price',
  label: 'Price'
},
{
  key: 'enrolled_at',
  label: 'Enrolled At'
}
]

const q = ref('')

const filteredRows = computed(() => {
  if (!q.value) {
    return orders.value
  }

  return orders.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
</script>