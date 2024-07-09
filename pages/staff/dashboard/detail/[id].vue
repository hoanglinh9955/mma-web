<template>
  <div>
    <UContainer v-if="course" class="flex flex-col space-y-8 items-center">
      <h1 class="text-3xl font-bold py-4 text-center">Course Detail</h1>
      <div class="flex space-x-10 pt-2">
        <div class="w-1/2 flex flex-col space-y-2 ">
          <img class="w-full rounded-xl" :src="course.image_url" alt="img">
        </div>
        <div class="flex flex-col items-start w-1/2 space-y-2">
          <h1 class="text-2xl "><span class="font-medium"> Title: </span> {{ course.title }}</h1>
          <h3 class="text-lg"><span class="font-medium"> Description: </span> {{ course.description }}</h3>
        </div>

      </div>
      <div class="flex space-x-10 w-full">
        <div class="w-1/2">
          
            
        </div>
        <div class="flex flex-col space-y-2">
          <h3 class="text-lg"> <span class="font-medium"> Category: </span> {{ course.category }}</h3>
          <h3 class="text-lg"> <span class="font-medium"> Price: </span> {{ Intl.NumberFormat('vi-VN', {
            style:
            'currency', currency: 'VND'
            }).format(course.price) }}</h3>
          <h3 class="text-lg "> <span class="font-medium"> Time: </span> <span> {{ new
              Date(course.create_at).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
              }) }} </span></h3>
          <h3 class="text-lg"><span class="font-medium"> Is Verify: </span> {{ course.is_verify }}</h3>
        </div>
      </div>

      <h1 class="text-3xl font-bold py-4 text-center">Chapters</h1>

      <div class="flex flex-col space-y-8">
        <div v-for="(item, index) in course.chapters" :key="item.chapter_id"
          class="flex shadow-2xl bg-grey-50 rounded-2xl p-10">
          <div class="w-1/2 flex flex-col space-y-2">

            <h3 class="text-lg">
              <UBadge class="rounded-3xl" :color="color[Math.floor(Math.random() * color.length)]" variant="subtle"
                size="sm">Chapter: {{ index + 1 }}</UBadge>
            </h3>
            <h3 class="text-lg"> <span class="font-medium"> Title: </span> {{ item.title }}</h3>
            <h3 class="text-lg"> <span class="font-medium"> Description: </span> {{ item.description }}</h3>
          </div>
          <div class="w-1/2">
            <video :src="item.content_url" class="w-full h-full object-cover rounded-xl" controls>
            </video>

          </div>
        </div>
      </div>


      <!-- comment part  -->
      <div class="w-3/4 py-14">
        <!-- case reject submit course -->
        <div class="flex flex-col w-full items-start space-y-5" v-if="course.is_submit"> 
          <UFormGroup class="w-full" label="Comment">
          <UTextarea v-model="commentReply" resize placeholder="Comment here..."/>
          
          </UFormGroup>
          <div class="w-full flex justify-between"> 
            <UFormGroup label="Verify">
            <USelect v-model="isVerify" placeholder="Verify" :options="verifyOption" />
            </UFormGroup>
            <UButton :loading="isSubmit" variant="outline" class="p-2 rounded-xl"
            icon="i-heroicons-paper-airplane" label="Submit" @click="submitComment" />
          </div>
          
        </div>
        <!-- course is verified -->
        <div class="flex flex-col w-full space-y-4 shadow-2xl bg-grey-50 rounded-2xl p-10" v-if="!course.is_submit && course.is_verify && !course.is_update"> 
          <!-- first row -->
          <div class="flex space-y-5 w-full justify-between">
            <div class="flex space-x-2 items-center"> 
              <UAvatar :src="course.comment_owner_avatar" size="md" />
              <UBadge class="h-4" size="sm" :label="'Role: '+ course.comment_owner.split('|')[0]" color="red" variant="subtle" />
              <h3>Name: {{ course.comment_owner.split('|')[1] }}</h3>
            </div>
            <h3>{{ new Date(course.comment_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }} - {{new Date(course.comment_at).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}}</h3>
          </div>
          
          <div class="flex space-x-5"> 
            <UBadge size="xs" label="Verified" color="green" variant="subtle" />
            <h3>{{ course.comments}}</h3>
            
          </div>
        </div>
        <!-- course is not verified -->
         <!-- <div v-if="!course.is_submit && course.is_verify && !course.is_update"> 

         </div> -->
        <!-- course is update -->
        <div class="relative" v-if="course.is_update"> 
          <UFormGroup label="Comment update">
          <UTextarea resize placeholder="Comment here..."/>
          <UButton :loading="isSubmit" variant="soft" class="absolute right-2 bottom-2 p-2 rounded-full"
            icon="i-heroicons-paper-airplane" @click="submitReply" />
          </UFormGroup>
        </div>
      </div>
    
      <UModal v-model="isDelete">
        <div class="p-4">
        <h1 class="text-xl font-bold text-center py-10">Are You Sure To Delete This Comment?</h1>
        <div class="flex justify-around pb-5"> 
            <UButton block class="w-32" size="lg" @click="isDelete = false" color="gray">Close</UButton>
            <UButton :loading="isSubmit" block class="w-32" @click="deleteComment" color="red">Remove</UButton>
        </div>
        </div>
      </UModal>
    </UContainer>
    {{ error }}
  </div>
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const checkAuth = storeToRefs(reloadState()).checkAuth
import { Icon } from '@iconify/vue'
import Course from '../course.vue';
const isSubmit = ref(false)
const token = storeToRefs(reloadState()).token
const color = ['red', 'yellow', 'blue', 'purple', 'emerald', 'orange', 'amber', 'violet', 'cyan', 'pink', 'indigo', 'teal', 'lime', 'rose', 'fuchsia', 'gray',]
const route = useRoute()
const id = route.params.id
const course = ref(null)
const error = ref(null)
const userInfor = storeToRefs(reloadState()).userInfor
const isDelete = ref(false)
const toast = useToast()
const verifyOption = ['Verified', 'Not Verified']
const commentReply = ref('')  
const isVerify = ref(verifyOption[0])

checkAuth.value++
// const reloadPage = async () => {
//   const commentList = await $fetch('https://mma.hoanglinh9955.workers.dev/api/user/getCommentByCourseId', {
//         query: { course_id: `${id}` },
//         headers: {
//           'Authorization': `Bearer ${token.value}`
//         }
//       })
//       if (commentList.success) {
//         comments.value = commentList.comments
//       }
// }

// const items = (comment) => [
//   [{
//     label: 'Edit',
//     icon: 'i-heroicons-pencil-square-20-solid',
//     click: () => {
//       console.log(comment)
//       replyText.value = comment.children[0].comment
//       comment_id_reply.value = comment.children[0].comment_id
//       console.log('Edit')
//     }
//   }], [{
//     label: 'Delete',
//     icon: 'i-heroicons-trash-20-solid',
//     click: () => {
//       isDelete.value = true
//       deleteId.value = comment.children[0].comment_id
//       console.log('Delete')
//     }
//   }]
// ]

const dataCourse = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/getCourseDetail', {
  query: { course_id: `${id}` },
  headers: {
    'Authorization': `Bearer ${token.value}`
  },
});

if (dataCourse.success) {
  course.value = dataCourse.courses[0]
} else {
  error.value = dataCourse.message
}


const reloadPage = async () => {
  const dataCourse = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/getCourseDetail', {
  query: { course_id: `${id}` },
  headers: {
    'Authorization': `Bearer ${token.value}`
  },
});

if (dataCourse.success) {
  course.value = dataCourse.courses[0]
} else {
  error.value = dataCourse.message
}
}

// const commentList = await $fetch('https://mma.hoanglinh9955.workers.dev/api/user/getCommentByCourseId', {
//   query: { course_id: `${id}` },
//   headers: {
//     'Authorization': `Bearer ${token.value}`
//   }
// })
// if (commentList.success) {
//   comments.value = commentList.comments
// }

// const checkReply = (comment_id) => {
//   if (comment_id_reply.value == comment_id) {
//     comment_id_reply.value = 0
//   } else {
//     comment_id_reply.value = comment_id
//     replyText.value = ''
//   }
// }
// toast.add({title: 'Error', description: 'Please Upload All File And Type All Data Before Submit Form', icon: 'i-heroicons-information-circle', color: 'red', duration: 5000, isClosable: true})
// const deleteComment = async () => {
//   isSubmit.value = true
//   const dataSent = {
//     comment_id: deleteId.value
//   }

//   const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/deleteComment', {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token.value}`
//       },
//       body: JSON.stringify(dataSent)
//     })
//     console.log(response)
//     if (response.success) {
//       // Refresh comments or update the commentList with the new reply

//       await reloadPage()
//       toast.add({title: 'Success', description: 'Delete Comment Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
//       isDelete.value = false
//       replyText.value = ''
//       comment_id_reply.value = 0
//       isSubmit.value = false
//     }
// }

const submitComment = async () => {
  if(commentReply.value == ''){
    toast.add({title: 'Error', description: 'Please Type Comment Before Submit', icon: 'i-heroicons-information-circle', color: 'red', duration: 5000, isClosable: true})
  }else
  if(isVerify.value == ''){
    toast.add({title: 'Error', description: 'Please Choose Verify Before Submit', icon: 'i-heroicons-information-circle', color: 'red', duration: 5000, isClosable: true})
  }else if (commentReply.value.trim()) {
    isSubmit.value = true
    const time = new Date().getTime()
    const dataSent = {
      course_id: id,
      comment: commentReply.value,
      comment_at: time,
      comment_owner: userInfor.value.role + '|' + userInfor.value.user_name,
      comment_owner_avatar: userInfor.value.image_url,
      is_submit: false,
      is_update: false,
      is_verify: isVerify.value == 'Verified' ? true : false
    }

    const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/staff/addComment', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(dataSent)
    })
    if (response.success) {
      // Refresh comments or update the commentList with the new reply
      toast.add({title: 'Success', description: 'Verify Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
      await reloadPage()
      console.log(response.results)
      // replyText.value = ''
      // comment_id_reply.value = 0
      isSubmit.value = false
    } else {
      console.error('Failed to submit reply:', response.message)
    }
  }
}

// const submitEdit = async () => {
//   if (replyText.value.trim()) {
//     isSubmit.value = true
//     const time = new Date().getTime()
//     const dataSent = {
//       comment: {
//         comment_id: comment_id_reply.value,
//         comment: replyText.value,
//       }
//     }

//     const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/editComment', {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${token.value}`
//       },
//       body: JSON.stringify(dataSent)
//     })
//     if (response.success) {
//       // Refresh comments or update the commentList with the new reply
//       await reloadPage()
//       toast.add({title: 'Success', description: 'Edit Comment Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
//       replyText.value = ''
//       comment_id_reply.value = 0
//       isSubmit.value = false
//     } else {
//       console.error('Failed to Edit Comment:', response.message)
//     }
//   }
// }

</script>
