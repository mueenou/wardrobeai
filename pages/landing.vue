<!-- landing.vue -->
<template>
  <div
    :class="`min-h-screen flex flex-col items-center ${
      colorMode.value === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-primary-50 to-primary-100'
    }`"
  >
    <!-- Logo and Brand -->
    <div class="w-full relative pt-12">
      <div class="absolute right-8 top-12">
        <ClientOnly>
          <UTooltip
            :text="
              colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            "
          >
            <Icon
              :name="colorMode.value === 'dark' ? 'lucide:moon' : 'lucide:sun'"
              @click="
                () =>
                  (colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark')
              "
              :class="`${
                colorMode.value === 'dark' ? 'text-primary-400' : 'text-primary-600'
              } text-2xl cursor-pointer drop-shadow-md hover:opacity-80 transition-opacity`"
            />
          </UTooltip>
          <template #fallback>
            <div class="w-8 h-8" />
          </template>
        </ClientOnly>
      </div>
      <div class="flex justify-center">
        <div class="flex items-center gap-3">
          <span
            :class="`text-4xl font-bold ${
              colorMode.value === 'dark' ? 'text-primary-100' : 'text-primary-900'
            }`"
            >Wardrobe.AI</span
          >
        </div>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="flex flex-col items-center justify-center flex-1 w-full px-4 mt-12">
      <h1 class="text-4xl md:text-5xl font-bold text-center mb-4">
        <span
          :class="colorMode.value === 'dark' ? 'text-primary-100' : 'text-primary-900'"
          >AI-Powered Wardrobe</span
        >
        <span
          :class="`block text-transparent bg-clip-text ${
            colorMode.value === 'dark'
              ? 'bg-gradient-to-r from-primary-400 via-purple-400 to-blue-400'
              : 'bg-gradient-to-r from-primary-500 via-purple-500 to-blue-500'
          }`"
          >Purpose-Built for Travel</span
        >
      </h1>
      <p
        :class="`text-lg text-center mb-8 max-w-2xl ${
          colorMode.value === 'dark' ? 'text-gray-200' : 'text-primary-950'
        }`"
      >
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
            class="px-8 py-3 text-lg duration-300 !text-gray-50"
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

const colorMode = useColorMode();
</script>
