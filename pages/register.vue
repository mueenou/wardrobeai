<template>
  <div class="flex min-h-screen items-center justify-center">
    <!-- this is a register form with email and password and Github, Google provider -->
    <UContainer class="border rounded-lg px-10 py-10 w-[500px]">
      <UForm class="space-y-6" @submit="signUp">
        <h2 class="text-center font-bold">Register</h2>
        <UFormGroup label="Email" name="email">
          <UInput v-model="email" />
        </UFormGroup>
        <UFormGroup label="Password" name="password">
          <UInput v-model="password" type="password" />
        </UFormGroup>

        <p>{{ errorMsg }}</p>
        <p>{{ successMsg }}</p>

        <UButton type="submit" color="primary" block> Submit </UButton>
        <p class="text-center text-sm">
          Already have an account?
          <span><nuxt-link to="/login" class="underline">Login</nuxt-link></span>
        </p>
      </UForm>
    </UContainer>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const email = ref("");
const password = ref(null);
const errorMsg = ref(null);
const successMsg = ref(null);

async function signUp(event) {
  errorMsg.value = null;
  successMsg.value = null;
  try {
    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    successMsg.value = "Check your email for the confirmation link.";
  } catch (error) {
    errorMsg.value = error.message;
  }
}
</script>
