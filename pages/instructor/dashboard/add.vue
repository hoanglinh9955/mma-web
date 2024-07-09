<template>
    <div>
        <UContainer class="relative">
            <UButton @click="goBack" class="absolute top-3 z-10" icon="i-heroicons-arrow-uturn-left" />



            <UForm :validate="validateCourse" :state="course.courseData" @error="onError"
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
                            <img v-if="checkImage" :src="course.courseData.image_url"
                                class="w-80 h-full object-cover rounded-xl" />
                            <!-- <div v-if="isUploadImage"
                                class="animate-spin w-8 h-8 border-4 border-dashed rounded-full border-gray-400 mx-auto mt-4">
                            </div> -->
                        </div>
                    </div>
                    <!-- right side -->
                    <div class="w-1/2 flex flex-col space-y-3">
                        <UFormGroup label="Title" name="course_title">
                            <UInput placeholder="Advance Component" size="lg" v-model="course.courseData.title" />
                        </UFormGroup>
                        <div class="flex w-full space-x-1">
                            <UFormGroup class="w-1/2" label="Price" name="course_price">
                                <UInput placeholder="90000" type="number" size="lg" v-model="course.courseData.price" />
                            </UFormGroup>
                            <UFormGroup class="w-1/2" label="Minute" name="course_hour">
                                <UInput placeholder="300" type="number" size="lg" v-model="course.courseData.hour" />
                            </UFormGroup>
                        </div>
                        
                        <div class="flex w-full space-x-1">
                            <UFormGroup class="w-1/2" label="Choose Category" name="course_category">
                                <USelect placeholder="Category" size="lg" :options="categories"
                                    v-model="course.courseData.category" />
                            </UFormGroup>
                            <UFormGroup class="w-1/2" label="Is Trial" name="course_is_trial">
                                <USelect placeholder="Is Trial" size="lg" :options="yesNo"
                                    v-model="isTrialString" />
                            </UFormGroup>
                        </div>

                    </div>
                </div>
                <div class="flex justify-center items-center">
                    <UFormGroup class="w-full px-10" label="Description" name="course_description">
                        <UTextarea placeholder="This is Description" resize size="lg" v-model="course.courseData.description" />
                    </UFormGroup>
                </div>
            </UForm>

            <h1 class="text-2xl font-bold text-center py-10">Add Chapter</h1>

            <div v-for="(chapter, index) in course.chapterData" :key="index">
                <UDivider  size="sm"
                                :label="(chapter.id + 1).toString() + '. ' + chapter.title"
                                :ui="{ label: 'text-primary-500 dark:text-primary-400 text-lg' }"
                                class="py-8" />

                <UForm :validate="validateChapter" :state="chapter" class="pt-5 flex flex-col space-y-8">
                    <!-- image and title -->
                    <div class="flex w-full justify-around">
                        <div class="w-1/3 flex flex-col space-y-3">
                            <UFormGroup label="Title" name="chapter_title">
                                <UInput size="lg" v-model="chapter.title" />
                            </UFormGroup>
                            <UFormGroup label="Description" name="chapter_description">
                                <UTextarea size="lg" v-model="chapter.description" />
                            </UFormGroup>
                        </div>
                        <!-- right side -->
                        <div class="flex flex-col space-y-4 w-1/2 items-center">
                            <UFormGroup class="w-full" label="File Video" name="image_url">
                                <UButtonGroup size="lg" orientation="horizontal">
                                    <UInput type="file" @change="(event) => onFileVideoChange(event, chapter.id)" />
                                    <UButton @click="uploadFileChapter(chapter.id)" 
                                            :disabled="!chapter.isHaveFile"
                                            icon="i-heroicons-arrow-up-circle"
                                            color="gray"
                                            :loading="chapter.isUploadFile" />
                                </UButtonGroup>
                            </UFormGroup>
                            <div class="w-full flex flex-col items-start">
                                <h3 class="text-red-500 animate-bounce" v-if="checkFormFile(chapter)">Please Upload Video Before Submit Form</h3>
                                <h3 class="text-primary-300 animate-pulse" v-if="chapter.isUploadFile" >Video Is Upload To Server Please Wait a seconds</h3>
                                <video v-if="chapter.content_url && !chapter.isUploadFile" :src="chapter.content_url"
                                    class="w-full h-full object-cover rounded-xl" controls></video>
                                <!-- <div v-if="chapter.isUploadFile"
                                    class="animate-spin w-8 h-8 border-4 border-dashed rounded-full border-gray-400 mx-auto mt-4">
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-end py-10">
                        <div></div>
                        <div v-if="chapter.id == course.chapterData.length - 1" class="flex flex-col space-y-2">
                            <UButton block class="w-48" @click="addChapter" icon="i-heroicons-plus" color="gray">Add Chapter</UButton>
                            <UButton block v-if="chapter.id < course.chapterData.length && chapter.id != 0" class="w-48" @click="checkChapter(index)" icon="i-heroicons-minus" color="primary">Remove Chapter {{ chapter.id + 1 }} </UButton>
                        </div>
                        <UButton block v-if="chapter.id == course.chapterData.length - 1" class="w-48" @click="checkForm" icon="i-heroicons-check" color="red">Submit</UButton>
                    </div>
                    


                </UForm>
            </div>
      

        </UContainer>
        <UModal v-model="isOpen">
            <div class="p-4">
            <h1 class="text-xl font-bold text-center py-10">Are you sure, this action can not be reversed?</h1>
            <div class="flex justify-around pb-5"> 
                <UButton block class="w-32" size="lg" @click="isOpen = false" color="gray">Close</UButton>
                <UButton :loading="isSubmit" block class="w-32" @click="onSubmit" color="red">Submit</UButton>
            </div>
            </div>
          </UModal>
          <UModal v-model="isRemoveChapter">
            <div class="p-4">
            <h1 class="text-xl font-bold text-center py-10">Are You Sure To Remove This Chapter?</h1>
            <div class="flex justify-around pb-5"> 
                <UButton block class="w-32" size="lg" @click="isRemoveChapter = false" color="gray">Close</UButton>
                <UButton :loading="isSubmit" block class="w-32" @click="removeChapter(removeChapterId)" color="red">Remove</UButton>
            </div>
            </div>
          </UModal>
    </div>
</template>

<script setup>
import { reloadState } from '~/stores/storeModal'
const checkAuth = storeToRefs(reloadState()).checkAuth
const router = useRouter()
const toast = useToast()
const isSubmit = ref(false)
const isRemoveChapter = ref(false);
const removeChapterId = ref(null)

const userDataString = localStorage.getItem('userData')
const userData = JSON.parse(userDataString)
const token = userData.session.token
//image upload
const fileImage = ref(null);
const isHaveImage = ref(false);
const isUploadImage = ref(false);
const isTrialString = ref('')
//modal
const isOpen = ref(false)

checkAuth.value++
const checkForm = () => {
    const errors = []
    for (let i = 0; i < course.value.chapterData.length; i++) {
        if (course.value.chapterData[i].content_url == '' 
        || course.value.chapterData[i].title == ''
        || course.value.chapterData[i].description == '') {
            errors.push(course.value.chapterData[i])
        }
    }
    if(course.value.courseData.image_url == ''
    || course.value.courseData.title == ''
    || course.value.courseData.description == ''
    || course.value.courseData.price < 0
    || !course.value.courseData.price
    || course.value.courseData.hour < 0
    || !course.value.courseData.hour
    || course.value.courseData.category == ''
    || isTrialString.value == ''
    ){
        errors.push('Image')
    }  
    if(errors.length > 0){
        toast.add({title: 'Error', description: 'Please Upload All File And Type All Data Before Submit Form', icon: 'i-heroicons-information-circle', color: 'red', duration: 5000, isClosable: true})
    }else{
        isOpen.value = true
    }
};

//category
const categories = ['Basic', 'Intermediate', 'Advance'];
const yesNo = ['Yes', 'No'];
const checkFormImage = computed(() => {
    return !course.value.courseData.image_url && fileImage.value && !isUploadImage.value;
});
const checkFormFile = (chapter) => {
    return !chapter.content_url && chapter.fileVideo && !chapter.isUploadFile;
};
const checkImage = computed(() => {
    return course.value.courseData.image_url && !isUploadImage.value;
});


const course = ref({
    courseData: {
        title: "",
        description: "",
        price: null,
        hour: null,
        category: "",
        is_trial: false,
        is_verify: false,
        is_submit: true,
        is_update: false,
        image_url: "",
        create_at: 0,
    },
    chapterData: [
        {
            id: 0,
            title: "",
            description: "",
            content_url: "",
            fileVideo: null,
            isHaveFile: false,
            isUploadFile: false
        }
    ]
});


const addChapter = () => {
    toast.add({title: 'Success', description: 'Add Chapter Success', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
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

const checkChapter = (index) => {
    removeChapterId.value = index
    isRemoveChapter.value = true
    
};

const removeChapter = (index) => {
    isSubmit.value = true
    course.value.chapterData.splice(index, 1);
    toast.add({title: 'Success', description: 'Remove Chapter Success', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
    isRemoveChapter.value = false
    isSubmit.value = false
};

const validateCourse = (state) => {
    const errors = []
  if (!course.value.courseData.title) errors.push({ path: 'course_title', message: 'Required' })
  if (!course.value.courseData.description) errors.push({ path: 'course_description', message: 'Required' })
  if (!course.value.courseData.category) errors.push({ path: 'course_category', message: 'Required' })
  if (!isTrialString) errors.push({ path: 'course_is_trial', message: 'Required' })
  if (!course.value.courseData.price) errors.push({ path: 'course_price', message: 'Required' })
  if (course.value.courseData.price < 0) errors.push({ path: 'course_price', message: 'Price must greater than 0' })
  if (!course.value.courseData.hour) errors.push({ path: 'course_hour', message: 'Required' })
  if (course.value.courseData.hour < 0) errors.push({ path: 'course_hour', message: 'Hours must greater than 0' })
  return errors
};

const validateChapter = (state) => {
    const errors = []
    if (!state.title) errors.push({ path: "chapter_title", message: 'Required' })
    if (!state.description) errors.push({ path: "chapter_description", message: 'Required' })
  
  
  return errors
};

async function onSubmit() {
    isSubmit.value = true
    course.value.courseData.create_at = Date.now();
    if(isTrialString.value == 'Yes'){
        course.value.courseData.is_trial = true
    }else{
        course.value.courseData.is_trial = false
    }
    if(course.value.courseData.category == 'Basic'){
        course.value.courseData.category = 'basic'
    }else if(course.value.courseData.category == 'Intermediate'){
        course.value.courseData.category = 'intermediate'
    }else if(course.value.courseData.category == 'Advance'){
        course.value.courseData.category = 'advance'
    }
    const courseDataUpload = course.value.courseData;
    const chapterDataUpload = course.value.chapterData.map(chapter => {
        return {
            title: chapter.title,
            description: chapter.description,
            content_url: chapter.content_url
        }
    }); 

    const data  = await $fetch('https://mma.hoanglinh9955.workers.dev/api/instructor/course', {
        method: 'POST',
        body: {
            courseData: courseDataUpload,
            chapterData: chapterDataUpload
        },
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    });
    console.log(data);
    if(data.success){
        toast.add({title: 'Success', description: 'Upload Course Success', icon: 'i-heroicons-check-circle', color: 'green', duration: 5000, isClosable: true})
        isSubmit.value = false
        router.push('/instructor/dashboard/home')
    }else{
        toast.add({title: 'Error', description: data.message, icon: 'i-heroicons-x-circle', color: 'red', duration: 5000, isClosable: true})
        isSubmit.value = false
    }
    isSubmit.value = false
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
    course.value.chapterData[chapterId].isUploadFile = false
    course.value.chapterData[chapterId].isHaveFile = false
    course.value.chapterData[chapterId].content_url = ''
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
        course.value.courseData.image_url = '';
        alert('Error uploading image.');
    }
};
</script>