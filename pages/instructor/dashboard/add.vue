<template>
    <div>
        <UContainer class="relative">
            <UButton @click="goBack" class="absolute top-3 z-10" icon="i-heroicons-arrow-uturn-left" />



            <UForm :validate="validate" :state="course" @error="onError" class="pt-20 flex flex-col space-y-8">
                <!-- image and title -->
                <div class="flex w-full justify-around">
                    <div class="flex flex-col space-y-4 w-1/3 items-center">
                        <UFormGroup class="w-full" label="Image Product" name="image_url">
                            <UButtonGroup size="lg" orientation="horizontal">
                                <UInput type="file" @change="onFileChange" />
                                <UButton @click="uploadFile" :disabled="!isHaveImage" icon="i-heroicons-arrow-up-circle"
                                    color="gray" />
                            </UButtonGroup>
                        </UFormGroup>
                        <div class="w-full">
                            <img v-if="checkImage" :src="course.courseData.image_url"
                                class="w-80 h-full object-cover rounded-xl" />
                            <div v-if="isUploadImage"
                                class="animate-spin w-8 h-8 border-4 border-dashed rounded-full border-gray-400 mx-auto mt-4">
                            </div>
                        </div>
                    </div>
                    <!-- right side -->
                    <div class="w-1/2 flex flex-col space-y-3">
                        <UFormGroup label="Title" name="title">
                            <UInput size="lg" v-model="course.courseData.title" />
                        </UFormGroup>
                        
                        <UFormGroup label="Price" name="price">
                            <UInput size="lg" v-model="course.courseData.price" />
                        </UFormGroup>
                        <div class="flex w-full space-x-1"> 
                            <UFormGroup class="w-1/2" label="Choose Category" name="category">
                                <USelect placeholder="Category" size="lg" :options="categories" v-model="course.courseData.category" />
                            </UFormGroup>
                            <UFormGroup class="w-1/2" label="Is Trial" name="is_trial">
                                <USelect placeholder="Is Trial" size="lg" :options="[true, false]" v-model="course.courseData.is_trial"  />
                            </UFormGroup>
                        </div>
                        
                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <UFormGroup class="w-full px-10" label="Description" name="description">
                        <UTextarea size="lg" v-model="course.courseData.description" />
                    </UFormGroup>
                </div>
                
                
            </UForm>
        </UContainer>
    </div>
</template>

<script setup>
const router = useRouter()
//image upload
const fileImage = ref(null);
const isHaveImage = ref(false);
const isUploadImage = ref(false);

//category
const categories = ['Basic', 'Intermediate', 'Advanced'];

const checkImage = computed(() => {
    return course.value.courseData.image_url && !isUploadImage.value;
});

const course = ref({
    courseData: {
        title: "",
        description: "",
        price: 0,
        category: "",
        is_trial: null,
        is_verify: false,
        is_submit: false,
        image_url: "",
        create_at: 0
    },
    chapterData: [
        {
            title: "",
            description: "",
            content_url: "",
            fileVideo: null
        }
    ]
});


const addChapter = () => {
    course.value.chapterData.push({
        title: '',
        description: '',
        content_url: ''
    });
};

const removeChapter = (index) => {
    course.value.chapterData.splice(index, 1);
};
const validate = (state) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    state.errors = [];

    if (!state.email) {
        state.errors.push({ path: 'email', message: 'Email is required' });
    } else if (!emailRegex.test(state.email)) {
        state.errors.push({ path: 'email', message: 'Please enter a valid email address' });
    }

    if (!state.password) {
        state.errors.push({ path: 'password', message: 'Password is required' });
    } else if (state.password.length < 8 || state.password.length > 16) {
        state.errors.push({ path: 'password', message: 'Password must be 8-16 characters long' });
    }

    return state.errors;
};

async function onSubmit(event) {
    const { data } = await useFetch('https://mma.hoanglinh9955.workers.dev/api/auth/login', {
        method: 'POST',
        body: {
            email: state.email,
            password: state.password
        }
    });
    console.log(data);
    localStorage.setItem('userData', JSON.stringify(data.value.result));
    router.push('/instructor/dashboard/home');
}

async function onError(event) {
    const element = document.getElementById(event.errors[0]?.id);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
const goBack = () => {
    router.push('/instructor/dashboard/home')
}

const onFileChange = (event) => {
    fileImage.value = event[0];
    console.log(fileImage.value);
    isHaveImage.value = true;

};


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
        course.value.courseData.image_url = 'https://1st-store.uk/files/' + response.filename;

    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image.');
    }
};
</script>