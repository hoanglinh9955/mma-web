<script setup>

const datadata = ref(null);
const state = reactive({
  email: 'user@example.com',
  password: 'stringst',
  errors: []
});

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
    },
    headers: {
      'Content-Type': 'application/json',
    }
  });
  datadata.value = data;
  console.log(data);
}

async function onError(event) {
  const element = document.getElementById(event.errors[0]?.id);
  element?.focus();
  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
</script>

<template>
  <div class="flex flex-col h-screen items-center justify-center">
    <h1 class="text-4xl font-bold mb-4">Login</h1>
    {{ datadata }}
    <UForm :validate="validate" :state="state" class="space-y-5 w-2/6" @submit="onSubmit" @error="onError">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>
      <UButton type="submit" block>
        Submit
      </UButton>
    </UForm>
  </div>
</template>
