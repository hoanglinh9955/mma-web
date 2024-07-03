<template>
    <div class="shadow-2xl w-auto h-auto rounded-2xl p-2 bg-white">
        <!-- div container -->
        <div class="flex flex-col justify-center items-center">
          <img
            class="p-4 w-80 h-40 transition-transform duration-500 ease-in-out transform hover:scale-105"
            :src="image_url"
            @click="goToDetail(course_id)"
          >
          <!-- product name -->
          <div class="w-3/4 h-14 py-2 mr-3">
            <h3 class="text-xl font-medium">
              {{ title }}
            </h3>
          </div>
          <!-- price -->
          <div class="flex justify-between w-3/4 py-4  mr-3">
            <h3 class="flex space-x-1 text-md font-medium">
                <div v-if="category == 'basic'">
                  <UBadge class="rounded-3xl" color="yellow" variant="subtle" size="sm">Basic</UBadge>
                </div>
                <div v-else-if="category == 'intermediate'">
                  <UBadge class="rounded-3xl" color="blue" variant="subtle" size="sm">Intermediate</UBadge>
                </div>
                <div v-else-if="category == 'advance'">
                  <UBadge class="rounded-3xl" color="purple" variant="subtle" size="sm">Advance</UBadge>
                </div>
                <div v-if="is_verify"> 
                  <UBadge class="rounded-3xl" color="emerald" variant="subtle" size="sm">Verified</UBadge>
                </div>
                <div v-else>
                  <UBadge class="rounded-3xl" color="red" variant="subtle" size="sm">Not Verified</UBadge>
                </div>
            </h3>
          </div>
          <!-- Buy now and add -->
          <div class="flex space-x-2 justify-around items-center w-full py-3">
            <div>
              <div>
                <h3 class="text-xs text-pink-500 font-medium ml-3">
                  {{ new Date(create_at).toLocaleString('vi-VN', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) }}
                </h3>
              </div>
            </div>
          
            <div>
              
              <h3 class="text-lg font-medium">
                {{ Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price) }}
              </h3>
            </div>
          </div>
        </div>
      </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const router = useRouter()

const goToDetail = (id) => {
    router.push(`/instructor/dashboard/detail/${id}`)
}

defineProps({
  course_id: String,
  image_url: String,
  title: String,
  category: String,
  price: Number,
  is_verify: Boolean,
  create_at: Number
})
</script>