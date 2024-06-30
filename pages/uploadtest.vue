<script setup>
const course = ref({
  title: '',
  description: '',
  chapters: [
    {
      title: '',
      content: ''
    }
  ]
});

const addChapter = () => {
  course.value.chapters.push({
    title: '',
    content: ''
  });
};

const removeChapter = (index) => {
  course.value.chapters.splice(index, 1);
};

const uploadCourse = async () => {
  try {
    const { data, error } = await useFetch('/api/upload-course', {
      method: 'POST',
      body: JSON.stringify(course.value),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log('Course uploaded successfully:', data);
  } catch (error) {
    console.error('Failed to upload course:', error);
  }
};
</script>

<template>
    <div>
      <form @submit.prevent="uploadCourse">
        <div>
          <label for="title">Course Title:</label>
          <input v-model="course.title" id="title" type="text" required />
        </div>
        <div>
          <label for="description">Course Description:</label>
          <textarea v-model="course.description" id="description" required></textarea>
        </div>
        
        <div v-for="(chapter, index) in course.chapters" :key="index">
          <h3>Chapter {{ index + 1 }}</h3>
          <div>
            <label :for="'chapter-title-' + index">Title:</label>
            <input v-model="chapter.title" :id="'chapter-title-' + index" type="text" required />
          </div>
          <div>
            <label :for="'chapter-content-' + index">Content:</label>
            <textarea v-model="chapter.content" :id="'chapter-content-' + index" required></textarea>
          </div>
          <button type="button" @click="removeChapter(index)">Remove Chapter</button>
        </div>
  
        <button type="button" @click="addChapter">Add Chapter</button>
        <button type="submit">Upload Course</button>
      </form>
    </div>
  </template>
  