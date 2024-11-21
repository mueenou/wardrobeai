<!-- index.vue -->
<template>
  <div class="w-full flex flex-col md:flex-row h-full">
    <ClothingForm @generate="handleGenerate" />
    <UDivider orientation="vertical" type="dashed" />
    <OutfitSuggestions />
  </div>
</template>

<script setup>
import { useOutfitStore } from "~/stores/outfit";

const store = useOutfitStore();
const toast = useToast();

const handleGenerate = async () => {
  try {
    toast.add({
      severity: "info",
      summary: "Generating outfits...",
      description: "Please wait while we generate your outfit suggestions.",
      timeout: 3000,
    });

    await store.generateOutfits();

    toast.add({
      severity: "info",
      summary: "Outfits generated",
      description: "Your outfit suggestions are ready!",
      timeout: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error generating outfits",
      description: "An error occurred while generating outfit suggestions.",
      timeout: 3000,
    });
  }
};
</script>
