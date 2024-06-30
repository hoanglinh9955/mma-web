<template>
    <div>
        <UContainer class="flex flex-col justify-center items-center space-y-5 pt-5">
            <div @click="addCourse" class="course-card bg-gradient-to-r bg-primary-200 w-full h-40 rounded-2xl flex justify-center items-center space-x-3 from-primary-200 to-purple-300">
                <Icon icon="material-symbols:add-box" width="1.6em" height="1.6em" />
                <h3>Add New Course</h3>
            </div>
        </UContainer>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const router = useRouter()
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