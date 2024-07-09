<template>
    <div> 
        <div v-if="isAdmin">
            <div v-if="!isEdit"> 
                <UContainer class="flex shadow-2xl bg-grey-50 rounded-2xl m-10 p-10">
                    <div class="flex w-1/2 justify-center items-center"><img
                            class="w-52 h-52 rounded-full border-2 border-primary-500" :src="userInfor.image_url" /></div>
                    <div class="w-1/2 flex flex-col space-y-2">
                        <h1 class="text-3xl font-bold">Instructor Name: {{ userInfor.user_name }}</h1>
                        <h3 class="text-lg">Email: {{ userInfor.email }}</h3>
                        <h3 class="text-lg">Description: {{ userInfor.instruction_description }}</h3>
                        <h3 class="text-lg">Date Of Birth: {{ userInfor.date_of_birth }}</h3>
                    </div>
                </UContainer>
                <UContainer class="flex w-full justify-end">
                    <UButton icon="i-heroicons-pencil-square" size="lg" block  class="pr-10 mr-10 h-12 w-40" @click="Edit" label="Edit" />
                    <UButton v-if="!isChangePassword" icon="i-heroicons-lock-closed" size="lg" block  class="pr-10 mr-10 w-40 h-12" @click="isChangePassword = true" label="Change Password" />
                </UContainer>
            </div>
            <div v-if="isEdit"> 
                <UContainer>
                    <UForm :validate="validateCourse" @error="onError"
                    class="pt-20 flex flex-col space-y-8">
                    <!-- image and title -->
                    <div class="flex w-full justify-around">
                        <div class="flex flex-col space-y-4 w-1/3 items-center">
                            <UFormGroup class="w-full" label="Image Product" name="course_content_url">
                                <UButtonGroup size="lg" orientation="horizontal">
                                    <UInput type="file" @change="onFileChange" />
                                    <UButton @click="uploadFile" :disabled="!isHaveImage" :loading="isUploadImage"
                                        icon="i-heroicons-arrow-up-circle" color="gray" />
                                </UButtonGroup>
                            </UFormGroup>
                            
                            <div class="w-full">
                                <h3 class="text-red-500 animate-bounce" v-if="checkFormImage">Please Upload Image Before Submit Form</h3>
                                <h3 class="text-primary-300 animate-pulse" v-if="isUploadImage" >Image Is Upload To Server Please Wait a seconds</h3>
                                <img v-if="imageUrl" :src="imageUrl"
                                    class="w-80 h-full object-cover rounded-xl" />
                            
                            </div>
                        </div>
                        <!-- right side -->
                        <div class="w-1/2 flex flex-col space-y-3">
                            <UFormGroup class="w-full" label="Instructor Name" name="user_name">
                                <UInput placeholder="This is Title" v-model="user_name" />
                            </UFormGroup>
                            <UFormGroup class="w-full" label="Email" name="email">
                                <UInput placeholder="This is Category" v-model="email" />
                            </UFormGroup>
                            <UFormGroup class="w-full" label="Date Of Birth" name="date_of_birth">
                                <UInput type="date" v-model="date_of_birth" />
                            </UFormGroup>
                        </div>
                    </div>
                    <div class="flex justify-center items-center">
                        <UFormGroup class="w-full px-10" label="Description" name="instruction_description">
                            <UTextarea placeholder="This is Description" resize size="lg" v-model="instruction_description" />
                        </UFormGroup>
                    </div>
                    <UContainer class="flex justify-end space-x-5 w-full"> 
                        <UButton :loading="isSubmit" @click="checkForm" label="Submit" />
                        <UButton @click="isEdit = false" label="Cancel" />
                    </UContainer>
                </UForm>
                    
                </UContainer>
            </div>
            <div v-if="isChangePassword"> 
                <UContainer class="w-1/2 flex flex-col space-y-4">
                    <UFormGroup class="w-full" label="Old Password">
                        <UInput placeholder="Old Password" v-model="oldPassword" />
                    </UFormGroup>
                    <UFormGroup class="w-full" label="New Password">
                        <UInput placeholder="New Password" v-model="password" />
                    </UFormGroup>
                    
                    <div class="flex space-x-2 justify-end">
                        <UButton :loading="isSubmit" label="Change Password" @click="changePassword" />
                        <UButton label="Cancel" @click="isChangePassword = false" />
                    </div>
                    
                </UContainer>
            </div>
        </div>
        <div v-else> 
            <UProgress animation="carousel" />
        </div>
    </div>
    
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const checkAuth = storeToRefs(reloadState()).checkAuth

const route = useRoute()
const id = route.params.id
const isChangePassword = ref(false)
const isAdmin = ref(false)
const oldPassword = ref('')
const password = ref('')

const router = useRouter()
const userInfor = storeToRefs(reloadState()).userInfor
const token = storeToRefs(reloadState()).token
const toast = useToast()
const isEdit = ref(false)

const isSubmit = ref(false);
const isHaveImage = ref(false);
const isUploadImage = ref(false);
const fileImage = ref(null);
const imageUrl = ref(userInfor.value.image_url);
const user_name = ref(userInfor.value.user_name)
const email = ref(userInfor.value.email)
const instruction_description = ref(userInfor.value.instruction_description)
const date_of_birth = ref(userInfor.value.date_of_birth)

checkAuth.value++
const Edit = () => {
    isEdit.value = true
}

if(userInfor.value.user_id != id){
    toast.add({title: 'Error', description: 'You are not allowed to access', icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
    router.push('/instructor/dashboard/home')
}else{
    isAdmin.value = true
}

const onFileChange = (event) => {
    fileImage.value = event[0];
    console.log(fileImage.value);
    isHaveImage.value = true;

};

async function onError(event) {
    const element = document.getElementById(event.errors[0]?.id);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

const validateCourse = (state) => {
    const errors = []
    if (!user_name.value) errors.push({ path: 'user_name', message: 'Required' })
    if (!email.value) errors.push({ path: 'email', message: 'Required' })
    if (!instruction_description.value) errors.push({ path: 'instruction_description', message: 'Required' })
    if (!date_of_birth.value) errors.push({ path: 'date_of_birth', message: 'Required' })
    return errors
};

const changePassword = async () => {
    isSubmit.value = true;
    if(oldPassword.value === password.value){
        toast.add({title: 'Error', description: 'New Password and Old password is match use another one', icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
    }else if(password.value.length < 8 || password.value.length > 16){
        toast.add({title: 'Error', description: 'Password must be at least 8 characters and less than 16 characters', icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
    }else if(oldPassword.value === ''){
        toast.add({title: 'Error', description: 'Old Password is required', icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
    }else if(password.value === ''){
        toast.add({title: 'Error', description: 'New Password is required', icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
    }else{
        const data = await $fetch(`https://mma.hoanglinh9955.workers.dev/api/user/changePassword`, {
            method: 'PUT',
            body: {
                oldPassword: oldPassword.value,
                password: password.value
            },
            headers: {
            'Authorization': 'Bearer ' + token.value,
        }
        });
        if(data.success){
            toast.add({title: 'Success', description: 'Change Password Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
            isChangePassword.value = false
        }else{
            toast.add({title: 'Error', description: data.message, icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
        }
    
    }
    
    isSubmit.value = false;
}

const checkForm = async () => {
    isSubmit.value = true;
    if(user_name.value && email.value && instruction_description.value && date_of_birth.value && imageUrl.value){
        const userData = {
            user_name: user_name.value,
            email: email.value,
            instruction_description: instruction_description.value,
            date_of_birth: date_of_birth.value,
            image_url: imageUrl.value
        }

        console.log(userData)
        const data = await $fetch(`https://mma.hoanglinh9955.workers.dev/api/instructor/updateProfile`, {
            method: 'PUT',
            body: {
                userData : userData,    
            },
            headers: {
            'Authorization': 'Bearer ' + token.value,
        }
        });
        console.log(data)
        if(data.success){
            const userDataString = localStorage.getItem('userData')
            const userData = JSON.parse(userDataString)
            userData.user = data.data[0]
            localStorage.setItem('userData', JSON.stringify(userData));
            
            userInfor.value = data.data[0]
            isEdit.value = false
            toast.add({title: 'Success', description: 'Update Instructor Profile Successfully', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
            router.push(`/instructor/dashboard/profile/${userInfor.value.user_id}`)
        }else{
            toast.add({title: 'Error', description: data.message, icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
        }
    }else{
        toast.add({title: 'Error', description: 'Please Fill All Form', icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
    }
    isSubmit.value = false;
}

const uploadFile = async () => {

isUploadImage.value = true;
const formData = new FormData();
formData.append('file', fileImage.value);
formData.append('type', fileImage.value.type);


try {
    const response = await $fetch('https://1st-store.uk/files/upload', {
        method: 'POST',
        body: formData,
    });
    isUploadImage.value = false;
    imageUrl.value = 'https://1st-store.uk/files/' + response.filename;

} catch (error) {
    console.error('Error uploading image:', error);
    isUploadImage.value = false;
    fileImage.value = null;
    isHaveImage.value = false;
    alert('Error uploading image.');
}
};
</script>