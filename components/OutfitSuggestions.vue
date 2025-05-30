<template>
  <div class="w-full rounded-xl flex flex-col gap-y-4 overflow-y-auto py-2 relative">
    <div
      v-if="store.isGeneratingOutfits"
      class="sticky top-10 text-4xl flex flex-col justify-center items-center h-full"
    >
      <p class="text-sm">Please wait until we find the best outfits for you !</p>
      <Icon name="eos-icons:three-dots-loading" class="text-primary" />
    </div>

    <template v-else-if="outfitSuggestions">
      <OutfitCard
        v-for="[day, outfit] in Object.entries(outfitSuggestions)"
        :key="day"
        :day="day"
        :outfit="outfit"
        :is-loading="isOutfitLoading(day)"
        :trip-id="tripId"
        @generate-image="generateOutfitImage"
        @show-image="showImage"
      />
    </template>

    <div v-else class="text-slate-500">No outfit suggestions available.</div>

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

const props = defineProps({
  tripId: {
    type: String,
    required: true,
  },
});

const store = useOutfitStore();
const { outfitSuggestions, isGeneratingOutfits, loadingOutfits } = storeToRefs(store);

// Local UI states
const isSliderOpen = ref(false);
const currentImage = ref("");

// Loading management functions
const isOutfitLoading = (day) => {
  return loadingOutfits.value.get(day) || false;
};

// Image viewer function
const showImage = (imageUrl) => {
  currentImage.value = imageUrl;
  isSliderOpen.value = true;
};

// Image generation function
const generateOutfitImage = async (day, outfit) => {
  try {
    await store.generateOutfitImage(day, outfit);
  } catch (error) {
    console.error("Error generating outfit image:", error);
  }
};
</script>
