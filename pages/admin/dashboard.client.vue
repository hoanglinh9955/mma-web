<template>
  <div>
    <div v-if="isAdmin" class="flex">
      <div class="w-1/6 h-screen bg-primary-100 p-2 flex flex-col justify-between">
        <div class="w-full flex flex-col space-y-10 items-center">
          <img
            class="w-40 cursor-pointer"
            src="~/public/logo2.png"
            alt="img"
            @click="goToHome"
          >
          <UVerticalNavigation :ui="{
            label: 'text-lg',
            active: 'bg-white',
            base: 'bg-white gap-2',
            padding: 'my-1'
          }" 
          class="w-full" 
          :links="links"/>
        </div>

        <div>
          <div class="rounded p-3 flex justify-between space-x-3 bg-white">
            <img class="rounded-full w-12 h-12 border-2 border-primary-500 " :src="user.user.image_url">
            <div class="text-right">
              <h1 class="font-medium">
                {{ user.user.user_name }}
              </h1>
              <button class="text-sm underline text-slate-500" @click="logout">
                Log out
              </button>
            </div>
          </div>
        </div>

      </div>
      <div class="w-5/6 h-screen overflow-auto">
        <NuxtPage />
      </div>
    </div>
    <div v-else>
      <UProgress animation="carousel" />
    </div>
  </div>
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const router = useRouter()
const isAdmin = ref(false)
const userDataString = localStorage.getItem('userData')
const userData = JSON.parse(userDataString)
const user = ref(userData)
const toast = useToast()

const token = storeToRefs(reloadState()).token
const userInfor = storeToRefs(reloadState()).userInfor

const goToHome = () => {
  router.push('/instructor/dashboard/home')
}
const logout = () => {
  localStorage.removeItem('userData')
  router.push('/login')
}

onMounted( async () => {
  // Ensure this code runs only on the client side
  if (typeof window !== 'undefined') {
    const userDataString = localStorage.getItem('userData')
    if (userDataString) {
      const userData = JSON.parse(userDataString)

      if(Date.now() > userData.session.expires_at){
        localStorage.removeItem('userData');
        router.push('/login')
      }

      // Continue with your logic here...
      const response = await $fetch('https://mma.hoanglinh9955.workers.dev/api/auth/check', {
        query: { tokenSession: `${userData.session.token}` },
      });
      console.log(response);
      if(!response.success){
        localStorage.removeItem('userData');
        router.push('/login')
      }
      const role = userData?.user?.role
      if (role !== 'ADMIN') {
        // Navigate to login if the role is not admin
        toast.add({ title: 'You are not Admin', timeout: 3000 })
        localStorage.removeItem('userData');
        router.push('/login')
      } else {
        // Set isAdmin to true if the role is admin (or any other logic you need)
        isAdmin.value = true
        token.value = userData.session.token
        userInfor.value = userData.user
      }
    } else {
      // If there's no userData in localStorage, navigate to login
      router.push('/login')
    }
  }
})

const links = [
//   {
//   label: 'Home',
//   icon: 'i-heroicons-home',
//   to: '/admin/dashboard/home',
// },
{
  icon: 'i-heroicons-cube',
  label: 'User',
  to: '/admin/dashboard/user',
},
{
  label: 'Course',
  icon: 'i-heroicons-home',
  to: '/admin/dashboard/course',
}
]
</script>
