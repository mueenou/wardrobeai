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
const props = defineProps({
  outfitSuggestions: Object,
  isLoading: Boolean,
  sexe: String,
  skinColor: String,
});

const emit = defineEmits(["updateOutfit"]);

// États locaux
const isSliderOpen = ref(false);
const currentImage = ref("");
const loadingStates = ref(new Map());

// Fonctions pour la gestion du chargement
const setOutfitLoading = (day, loading) => {
  loadingStates.value.set(day, loading);
};

const isOutfitLoading = (day) => {
  return loadingStates.value.get(day) || false;
};

// Fonction pour afficher l'image
const showImage = (imageUrl) => {
  currentImage.value = imageUrl;
  isSliderOpen.value = true;
};

// Fonction pour générer l'image
const generateOutfitImage = async (day, outfit) => {
  try {
    setOutfitLoading(day, true);
    const imagePrompt = createImagePrompt(outfit);

    const response = await $fetch("/api/generate-image", {
      method: "POST",
      body: { prompt: imagePrompt },
    });

    emit("updateOutfit", day, {
      ...outfit,
      imageUrl: response.data[0].url,
    });
  } catch (error) {
    console.error("Error generating outfit image:", error);
  } finally {
    setOutfitLoading(day, false);
  }
};

// Fonction pour créer le prompt d'image
const createImagePrompt = (outfitDetails) => {
  return `Create a realistic fashion photography for a ${props.skinColor} skinned ${
    props.sexe
  } wearing an outfit consisting of ${outfitDetails.Outfit}. 
  The style is ${outfitDetails["Style Theme"]}, suitable for ${outfitDetails.Weather}. 
  The outfit should be photographed on a simple background.
  Focus on showcasing the outfit's details and how the pieces work together.
  ${
    outfitDetails.Accessories !== "None"
      ? `Include these accessories: ${outfitDetails.Accessories}.`
      : ""
  }
  Style this as a modern fashion magazine photo shoot.`;
};
</script>
