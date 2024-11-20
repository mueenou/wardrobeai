<template>
  <div
    class="w-full rounded-xl pl-4 flex flex-col gap-y-4 text-sm overflow-y-auto pr-4 py-2 relative"
  >
    <div
      v-if="isLoading"
      class="sticky top-10 text-4xl flex flex-col justify-center items-center h-full"
    >
      <p class="text-sm">Please wait until we find the best outfits for you !</p>
      <Icon name="eos-icons:three-dots-loading" class="text-teal-600" />
    </div>

    <template v-else-if="outfitSuggestions">
      <OutfitCard
        v-for="[day, outfit] in Object.entries(outfitSuggestions)"
        :key="day"
        :day="day"
        :outfit="outfit"
        :is-loading="isOutfitLoading(day)"
        @generate-image="generateOutfitImage"
        @show-image="showImage"
      />
    </template>

    <div v-else>No outfit suggestions available.</div>

    <ImageSlideViewer
      v-model="isSliderOpen"
      :image-url="currentImage"
      image-alt="Outfit Image"
    />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useOutfitStore } from "~/stores/outfit";

const store = useOutfitStore();
const { outfitSuggestions, isLoading } = storeToRefs(store);

// Local UI states
const isSliderOpen = ref(false);
const currentImage = ref("");
const loadingStates = ref(new Map());

// Loading management functions
const setOutfitLoading = (day, loading) => {
  loadingStates.value.set(day, loading);
};

const isOutfitLoading = (day) => {
  return loadingStates.value.get(day) || false;
};

// Image viewer function
const showImage = (imageUrl) => {
  currentImage.value = imageUrl;
  isSliderOpen.value = true;
};

// Image generation function
const generateOutfitImage = async (day, outfit) => {
  try {
    setOutfitLoading(day, true);
    await store.generateOutfitImage(day, outfit);
  } catch (error) {
    console.error("Error generating outfit image:", error);
  } finally {
    setOutfitLoading(day, false);
  }
};
</script>
