<!-- landing.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col items-center"
  >
    <!-- Logo and Brand -->
    <div class="w-full flex justify-center pt-12">
      <div class="flex items-center gap-3">
        <span class="text-4xl font-bold text-primary-900">Wardrobe.AI</span>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="flex flex-col items-center justify-center flex-1 w-full px-4 mt-12">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4">
        <span>AI-Powered Wardrobe</span>
        <span
          class="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-purple-500 to-blue-500"
          >Purpose-Built for Travel</span
        >
      </h1>
      <p class="text-lg text-primary-700 text-center mb-8 max-w-2xl">
        Whether it's for business trips, vacations, or daily outfits, Wardrobe AI helps
        you plan, pack, and style with confidence. Get personalized outfit suggestions for
        any destination.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <nuxt-link to="/register">
          <UButton
            size="lg"
            color="primary"
            variant="solid"
            class="px-8 py-3 text-lg duration-300"
            >Let's go</UButton
          >
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "default",
});
</script>
