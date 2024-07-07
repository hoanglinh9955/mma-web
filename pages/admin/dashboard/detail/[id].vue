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
          <h3 v-if="course.comments" class="text-lg"> <span class="font-medium"> {{ course.comment_owner }}:
            </span>{{ course.comments }}</h3>
        </div>
        <div class="flex flex-col space-y-2 w-1/2">
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
      
      <h3 class="text-center text-3xl font-medium py-5">Comments</h3>
      <h3 class="text-center text-xl py10" v-if="comments == null">No Comment Found</h3>
      <div class="flex flex-col space-y-6 pb-10 w-3/4">
        <div v-for="item in comments" :key="item.comment_id" class="flex shadow-lg bg-white rounded-xl p-6">
          <div class="w-12 h-12 rounded-full overflow-hidden">
            <img :src="item.userData.image_url" alt="avatar" class="w-full h-full object-cover">
          </div>
          <div class="flex flex-col ml-4 w-full">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium">{{ item.userData.user_name }}</h3>
              <span class="text-sm text-gray-500">{{ new Date(item.comment_at).toLocaleString() }}</span>
            </div>
            <p class="text-gray-700">{{ item.comment }}</p>
            <div class="flex items-center mt-3">
              <span class="font-medium">Rate: </span>
              <div v-for="i in item.rate" :key="i">
                <Icon icon="twemoji:star" width="1.2em" height="1.2em" class="ml-1 text-yellow-500" />
              </div>
            </div>
            <!-- Add like, reply buttons -->
            <div v-if="item.children.length == 0" class="flex items-end justify-end mt-2 space-x-4 mr-4">
              <button @click="checkReply(item.comment_id)" class="cursor-pointer flex items-center text-primary-500">
                <Icon icon="mdi:comment-outline" class="mr-1" /> Reply
              </button>
            </div>
            <!-- reply  -->
            <div v-if="item.comment_id == comment_id_reply" class="ml-6 relative flex items-start space-x-2">
              <img :src="userInfor.image_url" alt="avatar" class="mt-4 w-12 h-12 rounded-full overflow-hidden">
              <UTextarea resize v-model="replyText" @keyup.enter="submitReply"
                class="w-full border-gray-200 rounded-lg py-4" placeholder="Reply here..." />
              <UButton :loading="isSubmit" variant="soft" class="absolute right-2 bottom-6 p-2 rounded-full"
                icon="i-heroicons-paper-airplane" @click="submitReply" />
            </div>

            <UDivider v-if="item.children.length > 0" class="mt-4" />

            <!-- Display replies -->
            <div v-if="item.children" class="mt-4 pl-8 border-gray-200">
              <div v-for="reply in item.children" :key="reply.comment_id" class="flex items-start mt-2">
                <div class="w-12 h-12 rounded-full overflow-hidden">
                  <img :src="reply.userData.image_url" alt="avatar" class="w-full h-full object-cover">
                </div>
                <div v-if="reply.comment_id != comment_id_reply" class="flex flex-col ml-3 w-full space-y-2">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-medium">{{ reply.userData.user_name }}</h3>
                    <div class="flex">
                      <span class="text-sm text-gray-500 flex items-center">{{ new
                        Date(reply.comment_at).toLocaleString() }}</span>
                      <UDropdown :items="items(item)" :popper="{ placement: 'auto' }">
                        <UButton variant="ghost" color="white" trailing-icon="i-heroicons-ellipsis-vertical-20-solid" />
                      </UDropdown>
                    </div>
                  </div>
                  <p class="text-gray-600">{{ reply.comment }}</p>
                </div>
                <div v-else-if="comment_id_reply == reply.comment_id" class="relative w-full ml-2">
                  <UTextarea resize v-model="replyText" @keyup.enter="submitEdit"
                    class="w-full border-gray-200 rounded-lg py-2" placeholder="Edit here..." />
                  <UButton :loading="isSubmit" variant="soft" class="absolute right-2 bottom-6 p-2 rounded-full"
                    icon="i-heroicons-paper-airplane" @click="submitEdit" />
                </div>
              </div>
            </div>
          </div>
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
import { Icon } from '@iconify/vue'
const isSubmit = ref(false)
const token = storeToRefs(reloadState()).token
const color = ['red', 'yellow', 'blue', 'purple', 'emerald', 'orange', 'amber', 'violet', 'cyan', 'pink', 'indigo', 'teal', 'lime', 'rose', 'fuchsia', 'gray',]
const route = useRoute()
const id = route.params.id
const course = ref(null)
const comments = ref(null)
const error = ref(null)
const comment_id_reply = ref(0)
const userInfor = storeToRefs(reloadState()).userInfor
const replyText = ref('')
const isDelete = ref(false)
const editId = ref(0)
const deleteId = ref(0)
const toast = useToast()

const reloadPage = async () => {
  const commentList = await $fetch('https://mma.hoanglinh9955.workers.dev/api/user/getCommentByCourseId', {
        query: { course_id: `${id}` },
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
      if (commentList.success) {
        comments.value = commentList.comments
      }
}

const items = (comment) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      console.log(comment)
      replyText.value = comment.children[0].comment
      comment_id_reply.value = comment.children[0].comment_id
      console.log('Edit')
    }
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      isDelete.value = true
      deleteId.value = comment.children[0].comment_id
      console.log('Delete')
    }
  }]
]

const dataCourse = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/getCourseDetail', {
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

const commentList = await $fetch('https://mma.hoanglinh9955.workers.dev/api/user/getCommentByCourseId', {
  query: { course_id: `${id}` },
  headers: {
    'Authorization': `Bearer ${token.value}`
  }
})
if (commentList.success) {
  comments.value = commentList.comments
}

const checkReply = (comment_id) => {
  if (comment_id_reply.value == comment_id) {
    comment_id_reply.value = 0
  } else {
    comment_id_reply.value = comment_id
    replyText.value = ''
  }
}
// toast.add({title: 'Error', description: 'Please Upload All File And Type All Data Before Submit Form', icon: 'i-heroicons-information-circle', color: 'red', duration: 5000, isClosable: true})
const deleteComment = async () => {
  isSubmit.value = true
  const dataSent = {
    comment_id: deleteId.value
  }

  const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/deleteComment', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(dataSent)
    })
    console.log(response)
    if (response.success) {
      // Refresh comments or update the commentList with the new reply

      await reloadPage()
      toast.add({title: 'Success', description: 'Delete Comment Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
      isDelete.value = false
      replyText.value = ''
      comment_id_reply.value = 0
      isSubmit.value = false
    }
}

const submitReply = async () => {
  if (replyText.value.trim()) {
    isSubmit.value = true
    const time = new Date().getTime()
    const dataSent = {
      comment: {
        course_id: id,
        comment: replyText.value,
        comment_at: time,
        parent_id: comment_id_reply.value
      }
    }

    const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/addComment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(dataSent)
    })
    if (response.success) {
      // Refresh comments or update the commentList with the new reply
      toast.add({title: 'Success', description: 'Reply Comment Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
      comments.value = response.comment
      replyText.value = ''
      comment_id_reply.value = 0
      isSubmit.value = false
    } else {
      console.error('Failed to submit reply:', response.message)
    }
  }
}

const submitEdit = async () => {
  if (replyText.value.trim()) {
    isSubmit.value = true
    const time = new Date().getTime()
    const dataSent = {
      comment: {
        comment_id: comment_id_reply.value,
        comment: replyText.value,
      }
    }

    const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/editComment', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: JSON.stringify(dataSent)
    })
    if (response.success) {
      // Refresh comments or update the commentList with the new reply
      await reloadPage()
      toast.add({title: 'Success', description: 'Edit Comment Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
      replyText.value = ''
      comment_id_reply.value = 0
      isSubmit.value = false
    } else {
      console.error('Failed to Edit Comment:', response.message)
    }
  }
}

</script>
