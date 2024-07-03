<template>
    <div> 
        <UContainer v-if="course" class="flex flex-col space-y-8">
            <h1 class="text-3xl font-bold py-4 text-center">Course Detail</h1>
            <div class="flex space-x-5 pt-2">
                <div class="w-1/2 flex flex-col space-y-2 ">
                    <img
                        class="w-full rounded-xl"
                        :src="course.image_url"
                        alt="img"
                        >
                </div>
                <div class="flex flex-col items-start w-1/2 space-y-2">
                    <h1 class="text-2xl "><span class="font-medium"> Title: </span> {{ course.title }}</h1>
                    <h3 class="text-lg"><span class="font-medium"> Description: </span> {{ course.description }}</h3>
                    
                </div>
                
            </div>
            <div class="flex"> 
                <div class="w-1/2">
                    <h3 v-if="course.comments != null" class="text-lg"> <span class="font-medium"> {{ course.comment_owner }}: </span> {{ course.comments }}</h3>
                </div>
                <div class="w-1/2 flex flex-col space-y-2">
                    <h3 class="text-lg"> <span class="font-medium"> Category: </span> {{ course.category }}</h3>
                    <h3 class="text-lg"> <span class="font-medium"> Price: </span> {{ Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price) }}</h3>
                    <h3 class="text-lg "> <span class="font-medium"> Time: </span> <span> {{ new Date(course.create_at).toLocaleString('vi-VN', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) }} </span></h3>
                    <h3 class="text-lg"><span class="font-medium"> Is Verify: </span> {{course.is_verify}}</h3>
                </div>
            </div>

            <h1 class="text-3xl font-bold py-4 text-center">Chapters</h1>

            <div class="flex flex-col space-y-8">
                <div
                  v-for="(item, index) in course.chapters"
                  :key="item.chapter_id"
                  class="flex shadow-2xl bg-grey-50 rounded-2xl p-10"
                >
                  <div class="w-1/2 flex flex-col space-y-2">
                    
                    <h3 class="text-lg"><UBadge class="rounded-3xl" :color="color[Math.floor(Math.random() * color.length)]" variant="subtle" size="sm">Chapter: {{ index + 1}}</UBadge></h3>
                    <h3 class="text-lg"> <span class="font-medium"> Title: </span> {{ item.title }}</h3>
                    <h3 class="text-lg"> <span class="font-medium"> Description: </span> {{ item.description }}</h3>
                  </div>
                  <div class="w-1/2"> 
                    <video :src="item.content_url"
                            class="w-full h-full object-cover rounded-xl" 
                            controls>
                    </video>
                    
                  </div>
                </div>
              </div>

              <h3 class="text-center text-3xl font-medium py-5">Comments</h3>
            {{ course }}
            
        </UContainer>
        {{ error }}
    </div>
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const token = storeToRefs(reloadState()).token
const color = ['red', 'yellow', 'blue', 'purple', 'emerald', 'orange', 'amber', 'violet', 'cyan', 'pink', 'indigo', 'teal', 'lime', 'rose', 'fuchsia', 'gray',]
const route = useRoute()
const id = route.params.id
const course = ref(null)
const error = ref(null)
const dataCourse = await $fetch('https://mma.hoanglinh9955.workers.dev/api/user/getCourseById', {
        query: { course_id: `${id}` },
        headers: {
            'Authorization': `Bearer ${token.value}`
        },
      });
if(dataCourse.success){
    course.value = dataCourse.courses[0]
}else{
    error.value = dataCourse.message
}


</script>