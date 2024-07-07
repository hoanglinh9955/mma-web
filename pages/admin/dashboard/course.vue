<template>
    <div>
        <UContainer>
          <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <UInput v-model="q" placeholder="Filter Order..." />
            <USelect v-model="selected" :options="array" placeholder="Choose" />
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
            
              <UTable class="pt-2" :rows="filteredRows" :columns="columns" >
                <template #actions-data="{ row }">
                    <!-- <UButton
                      :icon="getIcon(row.status)"
                      size="2xs"
                      :color="getColor(row.status)"
                      variant="outline"
                      :ui="{ rounded: 'rounded-full' }"
                      square
                      :disabled="checkStatus(row.status)"
                      @click="update(row)"
                    /> -->
                    <UButton
                      icon="material-symbols:edit"
                      size="2xs"
                      color="blue"
                      variant="outline"
                      :ui="{ rounded: 'rounded-full' }"
                      square
                      class="hover:scale-110"
                      lang="edit"></UButton>
                  </template>
              </UTable>   

          
        
              {{ courseList[0]}}
        </UContainer>
    </div>  
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const token = storeToRefs(reloadState()).token
const array = ['All','Verified','Not Verified', 'Is Update']
const course = ref(null)
const courseList = ref(null)
const totalUsers = ref(0)
const totalInstructors = ref(0)
const totalStaffs = ref(0) 
const courseData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/admin/getAllCourses', {
  headers: {
        'Authorization': `Bearer ${token.value}`
    }
})
if(courseData.success){
    course.value = courseData.results.map((course, index) => {
    return course
    })
}
// { "course_id": 30, "title": "Advanced Components", "description": "\nAdvanced components in Nuxt 3 offer powerful features such as the Composition API for reusable logic, Suspense components for handling asynchronous data, and built-in support for SSR and SSG for better performance and SEO. They also include auto-imported components, modular architecture, TypeScript support, dynamic imports for lazy-loading, custom directives and plugins, reactive state management with Pinia, middleware and route guards for pre-rendering logic, lifecycle hooks for fine-grained control, and various performance optimizations like tree-shaking and code splitting. These features enable the creation of highly interactive, performant, and maintainable web applications.", "instructor_id": 18, "price": 90000, "category": "basic", "is_trial": true, "is_verify": true, "is_submit": false, "is_update": null, "image_url": "https://1st-store.uk/files/1720022303466-nuxt-js.jpg", "hour": 300, "create_at": 1719944470600, "update_at": null, "comments": null, "comment_owner": null }
const columns = [{
  key: 'id',
}, {
  key: 'title',
  label: 'Title'
}, 
{
  key: 'price',
  label: 'Price'
}, {
  key: 'category',
  label: 'Category'
},
{
  key: 'is_verify',
  label: 'Is Verify'
},
{
  key: 'is_update',
  label: 'Is Update'
},
{
  key: 'hour',
  label: 'Hour'
},
{
  key: 'create_at',
  label: 'Create At'
},
{
  key: 'update_at',
  label: 'Update At'
},
{
  key: 'actions',
  label: 'Actions',
}
]

const q = ref('')
const selected = ref(null)
courseList.value = course.value

watchEffect(() => {
  if (selected.value === 'All') {
    courseList.value = course.value
  }
  else if (selected.value === 'Verified') {
    courseList.value = course.value.filter((course) => {
      return course.is_verify === true
    })
  }
  else if (selected.value === 'Not Verified') {
    courseList.value = course.value.filter((course) => {
      return course.is_verify === false
    })
  }else if(selected.value === 'Is Update'){
    courseList.value = course.value.filter((course) => {
      return course.is_update === true
    })
    }
})


// const getColor = (role) => {
//   if (role == 'USER') {
//     return 'emerald'
//   }
//   else if (role == 'INSTRUCTOR') {
//     return 'blue'
//   }
//   else if (role == 'STAFF') {
//     return 'orange'
//   }
// }

const filteredRows = computed(() => {
  if (!q.value) {
    return courseList.value
  }
  // q.value = q.value.trim()
  return courseList.value.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})
</script>