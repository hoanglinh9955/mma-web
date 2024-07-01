<template>
    <div>
        <UContainer class="relative">
            <UButton @click="goBack" class="absolute top-3 z-10" icon="i-heroicons-arrow-uturn-left" />



            <UForm :validate="validate" :state="course.courseData" @error="onError"
                class="pt-20 flex flex-col space-y-8">
                <!-- image and title -->
                <div class="flex w-full justify-around">
                    <div class="flex flex-col space-y-4 w-1/3 items-center">
                        <UFormGroup class="w-full" label="Image Product" name="image_url">
                            <UButtonGroup size="lg" orientation="horizontal">
                                <UInput type="file" @change="onFileChange" />
                                <UButton @click="uploadFile" :disabled="!isHaveImage" :loading="isUploadImage"
                                    icon="i-heroicons-arrow-up-circle" color="gray" />
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
                                <USelect placeholder="Category" size="lg" :options="categories"
                                    v-model="course.courseData.category" />
                            </UFormGroup>
                            <UFormGroup class="w-1/2" label="Is Trial" name="is_trial">
                                <USelect placeholder="Is Trial" size="lg" :options="[true, false]"
                                    v-model="course.courseData.is_trial" />
                            </UFormGroup>
                        </div>

                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <UFormGroup class="w-full px-10" label="Description" name="description">
                        <UTextarea resize size="lg" v-model="course.courseData.description" />
                    </UFormGroup>
                </div>


            </UForm>

            <h1 class="text-2xl font-bold text-center py-10">Add Chapter</h1>

            <div v-for="(chapter, index) in course.chapterData" :key="index">
                <UDivider  size="sm"
                                :label="chapter.id + 1"
                                :ui="{ label: 'text-primary-500 dark:text-primary-400 text-lg' }"
                                class="py-8" />

                <UForm class="pt-5 flex flex-col space-y-8">
                    <!-- image and title -->
                    <div class="flex w-full justify-around">
                        <div class="w-1/3 flex flex-col space-y-3">
                            <UFormGroup label="Title" name="title">
                                <UInput size="lg" v-model="chapter.title" />
                            </UFormGroup>
                            {{ chapter }}
                            <UFormGroup label="Descriptioin" name="description">
                                <UTextarea size="lg" v-model="chapter.description" />
                            </UFormGroup>
                        </div>
                        <!-- right side -->
                        <div class="flex flex-col space-y-4 w-1/2 items-center">
                            <UFormGroup class="w-full" label="File Video" name="image_url">
                                <UButtonGroup size="lg" orientation="horizontal">
                                    <UInput type="file" @change="(event) => onFileVideoChange(event, chapter.id)" />
                                    <UButton @click="uploadFileChapter(chapter.id)" :disabled="!chapter.isHaveFile"
                                        icon="i-heroicons-arrow-up-circle" color="gray" />
                                </UButtonGroup>
                            </UFormGroup>
                            <div class="w-full flex flex-col items-center">
                                <video v-if="chapter.content_url && !chapter.isUploadFile" :src="chapter.content_url"
                                    class="w-full h-full object-cover rounded-xl" controls></video>
                                <div v-if="chapter.isUploadFile"
                                    class="animate-spin w-8 h-8 border-4 border-dashed rounded-full border-gray-400 mx-auto mt-4">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div v-if="chapter.id == course.chapterData.length - 1" class="flex justify-center items-center pb-10">
                        <UButton @click="addChapter" icon="i-heroicons-plus" color="gray">Add Chapter</UButton>
                    </div>


                </UForm>
            </div>


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
            id: 0,
            title: "LinhHoang",
            description: "",
            content_url: "",
            fileVideo: null,
            isHaveFile: false,
            isUploadFile: false
        }
    ]
});


const addChapter = () => {
    course.value.chapterData.push({
        id: course.value.chapterData.length,
        title: "",
        description: "",
        content_url: "",
        fileVideo: null,
        isHaveFile: false,
        isUploadFile: false
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

const onFileVideoChange = (event, chapterId) => {
    const chapter = course.value.chapterData.find(chapter => chapter.id === chapterId);
    if (chapter) {
        // Assign the first file from the event to the chapter's fileVideo property
        chapter.fileVideo = event[0];
        console.log(chapter.fileVideo); // Assuming you want to log the file, not chapter.fileVideo.value
        chapter.isHaveFile = true; // Set isHaveFile to true
    }
};
const uploadFileChapter = async (chapterId) => {
course.value.chapterData[chapterId].isUploadFile = true
const formData = new FormData();
formData.append('file', course.value.chapterData[chapterId].fileVideo);
formData.append('type', course.value.chapterData[chapterId].fileVideo.type);


try {
    const response = await $fetch('https://1st-store.uk/files/upload', {
        method: 'POST',
        body: formData,
    });
    course.value.chapterData[chapterId].isUploadFile = false
    course.value.chapterData[chapterId].content_url = 'https://1st-store.uk/files/' + response.filename;

} catch (error) {
    console.error('Error uploading image:', error);
    course.value.chapterData[chapterId].fileVideo = null
    course.value.chapterData[chapterId].isUploadFile = null
    course.value.chapterData[chapterId].isHaveFile = null
    
    alert('Error uploading File.');
}
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
        isUploadImage.value = false;
        fileImage.value = null;
        isHaveImage.value = false;
        alert('Error uploading image.');
    }
};
</script>