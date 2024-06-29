<template>
  <div>
    <h1>Upload Image</h1>
    <input type="file" @change="onFileChange" />
    <button @click="uploadImage">Upload</button>
    <div v-if="imageUrl">
      <h2>Uploaded Image</h2>
      <img :src="imageUrl" alt="Uploaded Image" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const file = ref(null);
const imageUrl = ref('');

const onFileChange = (event) => {
  file.value = event.target.files[0];
};

const uploadImage = async () => {
  if (!file.value) {
    alert('Please select a file!');
    return;
  }

  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('type', file.value.type);


  try {
    const response = await useFetch('https://1st-store.uk/files/upload', {
      method: 'POST',
      body: formData,
    });

   console.log(response);
  
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image.');
  }
};
</script>
