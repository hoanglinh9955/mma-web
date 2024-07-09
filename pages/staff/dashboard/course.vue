<template>
  <div>
    <UContainer>
      <div class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <UInput v-model="q" placeholder="Filter Course..." />
        <USelect v-model="selected" :options="array" placeholder="Choose" />
      </div>
      <div class="flex justify-between p-4 border-b border-gray-200 dark:border-gray-700">

        <div class="flex justify-center items-center space-x-2">
          <UBadge size="md" label="Total User :" color="emerald" variant="subtle" />
          <h3>{{totalUsers}}</h3>
        </div>

        <div class="flex justify-center items-center space-x-2">
          <UBadge size="md" label="Total Instructor :" color="blue" variant="subtle" />
          <h3>{{totalInstructors}}</h3>
        </div>
        <div class="flex justify-center items-center space-x-2">
          <UBadge size="md" label="Total Staff :" color="orange" variant="subtle" />
          <h3>{{totalStaffs}}</h3>
        </div>
      </div>

      <UTable class="pt-2" :rows="filteredRows" :columns="columns">
        <template #details-data="{ row }">
          <UButton @click="goToDetail(row)" :icon="getIcon(row)" size="2xs" :color="getColor(row)" variant="outline"
            :ui="{ rounded: 'rounded-full' }" square class="hover:scale-125 hover:-translate-y-1 duration-300">
          </UButton>
        </template>

        <template #details-header>
          <UDropdown :items="items" mode="hover" :popper="{ placement: 'auto' }">
            <UButton label="Detail" variant="ghost" color="white"/>
            <template #detail>
              <div class="font-mono">
                <h3>Please Click Button at the end of the row to verify course </h3>
              </div>
            </template>
          </UDropdown>
        </template>

        <template #is_verify-data="{ row }">
          <UBadge size="xs" :label="row.is_verify ? 'Verified' : 'Not Verified'"
            :color="row.is_verify ? 'green' : 'red'" variant="subtle" />
        </template>

        <template #is_update-data="{ row }">
          <UBadge size="xs" :label="row.is_update ? 'Update' : 'None'" :color="row.is_update ? 'yellow' : 'blue'"
            variant="subtle" />
        </template>

        <template #create_at-data="{ row }">
          <p>{{ new Date(row.create_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }} - {{ new
            Date(row.create_at).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
          </p>
        </template>
<!-- 
        <template #update_at-data="{ row }">
          <UBadge size="xs"
            :label="row.update_at ? new Date(row.update_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(row.update_at).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'None'"
            :color="row.update_at ? 'orange' : 'purple'" variant="subtle" />
        </template> -->

      </UTable>

    </UContainer>
  </div>
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const token = storeToRefs(reloadState()).token
const checkAuth = storeToRefs(reloadState()).checkAuth
const router = useRouter()
const array = ['All','Verified','Not Verified']
const course = ref(null)
const courseList = ref(null)
const totalUsers = ref(0)
const totalInstructors = ref(0)
const totalStaffs = ref(0) 
checkAuth.value++
const courseData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/getAllCourses', {
  headers: {
        'Authorization': `Bearer ${token.value}`
    }
})

if (courseData.success) {
  course.value = courseData.results.filter((course) => {
    return course.is_verify === true || (course.is_verify === false && course.is_submit === true);
  });
    course.value.reverse()
}else{
    course.value = []

}

const goToDetail = (row) => {
  router.push(`/staff/dashboard/detail/${row.course_id}`)
}

// { "course_id": 30, "title": "Advanced Components", "description": "\nAdvanced components in Nuxt 3 offer powerful features such as the Composition API for reusable logic, Suspense components for handling asynchronous data, and built-in support for SSR and SSG for better performance and SEO. They also include auto-imported components, modular architecture, TypeScript support, dynamic imports for lazy-loading, custom directives and plugins, reactive state management with Pinia, middleware and route guards for pre-rendering logic, lifecycle hooks for fine-grained control, and various performance optimizations like tree-shaking and code splitting. These features enable the creation of highly interactive, performant, and maintainable web applications.", "instructor_id": 18, "price": 90000, "category": "basic", "is_trial": true, "is_verify": true, "is_submit": false, "is_update": null, "image_url": "https://1st-store.uk/files/1720022303466-nuxt-js.jpg", "hour": 300, "create_at": 1719944470600, "update_at": null, "comments": null, "comment_owner": null }
const items = [
  [{
    label: 'Detail',
    slot: 'detail'
  }]
]

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
  key: 'hour',
  label: 'Hour'
},
{
  key: 'create_at',
  label: 'Create At'
},
{
  key: 'details',
  label: 'Details',
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

const getIcon = (row) => {
  if (row.is_verify == true && row.is_update != true) {
    return 'i-heroicons-check'
  }
  else if (row.is_verify == false) {
    return 'i-heroicons-arrow-path'
  }
  else if (row.is_update == true) {
    return 'i-heroicons-cloud-arrow-up'
  }
}

const getColor = (row) => {
  if (row.is_verify == true && row.is_update != true) {
    return 'green'
  }
  else if (row.is_verify == false) {
    return 'orange'
  }
  else if (row.is_update == true) {
    return 'blue'
  }
}

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