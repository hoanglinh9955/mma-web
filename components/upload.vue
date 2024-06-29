<template>
    <div>
      <UInput ref="fileInput" type="file" @change="handleFileChange" />
      <button @click="upLoadImage">Upload</button>
    </div>
    <div>
      <input type="file" @change="handleFileUpload">
      <button @click="fileImage">Upload</button>
    </div>
  </template>
  
  <script setup>

  const fileInput = ref(null)
  const selectedFile = ref(null)
  const selectedImage = ref(null)
  const handleFileChange = (e) => {
    console.log(e)
    selectedFile.value = e[0]
  }
  
const handleFileUpload = (e) => {
  console.log("🚀 ~ handleFileUpload ~ e:", e)
  selectedImage.value = e.target.files[0];
}

  const fileImage = async (e) => {
    const formData = new FormData();
    formData.append('file', selectedImage.value);  
    // formData.append('name', "IMAGE_" + Date.now());

    try {
        const formData = new FormData();
        formData.append('image', selectedImage.value);

        // Make sure to replace 'http://example.com/upload' with your server endpoint
        const response = await useFetch('api/upload',{
          method: 'POST',
          body: formData

        });

        console.log('Image uploaded successfully:', response);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  
  const upLoadImage = async (e) => {
    const formData = new FormData();
    formData.append('file', selectedFile.value);  
    formData.append('type', selectedFile.value.type);   
    formData.append('name', "VIDEO_" + Date.now());

    // const { data } = await useFetch(`https://api.cloudflare.com/client/v4/accounts/7c1852814450c3d39a461af14cce42a8/images/v2/direct_upload`, {
    //   method: 'POST',
    //   mode: 'no-cors',
    //   headers: {
    //     'Authorization': `Bearer fc6wipAC6T-rBqHf7o55dhwSEOX8ZLkJckikAnIC`,
    //   },
    // })
    const {data} = await useFetch('/api/upload', {
      method: 'POST',
      body: {
      file: formData
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  console.log(data)
    

  
    // if (data.value.success) {
    //   console.log(data.value.result.uploadURL)
    //   const { data: data1, status } = await useFetch(`${data.value.result.uploadURL}`, {
    //     method: 'POST',
    //     body: formData,
       
    //   })
    //   console.log(data1)
    //   console.log(status)
    // }
    
  }
  
  const upLoadVideo = async (e) => {
    const formData = new FormData();
    formData.append('file', selectedFile.value);  
    formData.append('type', selectedFile.value.type);   
    formData.append('name', "VIDEO_" + Date.now());

  
  
    const { data } = await useFetch(`https://api.cloudflare.com/client/v4/accounts/7c1852814450c3d39a461af14cce42a8/stream/direct_upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer Zsx7DfagQxmlv5j1o36oooVjsXfWWv0U5kzRQnKL`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "maxDurationSeconds": 3600,
        "creator":"creator-id_abcde12345",
        "meta": {
            "name": "VIDEO_" + Date.now(),
        }
      })
    })
  
    console.log(selectedFile.value)
    
    console.log(data.value)
  
    if (data.value.success) {
      console.log(data.value.result.uploadURL)
      const { data: data1, status } = await useFetch(`${data.value.result.uploadURL}`, {
        method: 'POST',
        body: formData
      })
      console.log(data1)
      console.log(status)
    }
    
  }
  </script>
  