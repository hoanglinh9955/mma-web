<template>
    <div>
        <UContainer class="flex flex-col justify-center items-center space-y-5 pt-5">
            <div @click="addCourse" class="course-card bg-gradient-to-r bg-primary-200 w-full h-40 rounded-2xl flex justify-center items-center space-x-3 from-primary-200 to-purple-300">
                <Icon icon="material-symbols:add-box" width="1.6em" height="1.6em" />
                <h3>Add New Course</h3>
            </div>

            <h1 class="text-3xl font-bold py-7">Your Courses</h1>
       
            <div class="grid grid-cols-4 gap-7">
                <div
                  v-for="item in courseData.courses"
                  :key="item.course_id"
                >
                  <Card
                    :course_id="item.course_id"
                    :image_url="item.image_url"
                    :title="item.title"
                    :category="item.category"
                    :price="item.price"
                    :is_verify="item.is_verify"
                    :create_at="item.create_at"
                  />
                </div>
              </div>
  
        </UContainer>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { reloadState } from '~/stores/storeModal'
const token = storeToRefs(reloadState()).token

const router = useRouter()

const courseData = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/getCourseByInstructorId', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token.value}`
    }
  });
const addCourse = () => {
    router.push('/instructor/dashboard/add')
}

</script>

<style>
.course-card {
  transition: transform 0.3s ease, background-color 0.3s ease;
}
.course-card:hover {
  transform: scale(1.02); /* Slightly increase size */
  cursor: pointer; /* Change cursor to indicate it's clickable */
}
</style>