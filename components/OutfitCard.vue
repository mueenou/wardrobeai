<template>
  <UCard class="hover:ring hover:ring-primary duration-300">
    <template #header>
      <div class="flex gap-2 items-center font-bold">
        <UBadge class="font-bold min-w-[55px] grid place-content-center">{{
          day
        }}</UBadge>
        <p class="flex-grow">{{ outfit.Outfit }}</p>
        <UTooltip text="See how it looks in an image!">
          <UButton
            size="2xs"
            variant="outline"
            class="self-end"
            :icon="isLoading ? 'lucide:loader-2' : 'lucide:sparkles'"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleGenerateImage"
          >
            {{ isLoading ? "Generating" : "Generate look" }}
          </UButton>
        </UTooltip>
      </div>
    </template>
    <div class="flex w-full items-center justify-between">
      <div class="flex gap-2">
        <p>{{ outfit["Style Theme"] }}</p>
        <p>{{ outfit["Weather"] }}</p>
        <p>{{ outfit["Accessories"] ? outfit["Accessories"] : "" }}</p>
      </div>
      <div
        v-if="outfit.imageUrl"
        class="rounded ring-2 ring-primary overflow-hidden shadow w-[100px] h-[100px]"
      >
        <img
          :src="outfit.imageUrl"
          alt="Outfit"
          class="cursor-pointer w-full h-full object-cover"
          @click="handleShowImage(outfit.imageUrl)"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex gap-x-2 w-full justify-end">
        <UBadge color="blue" class="font-bold" v-for="pf in outfit['Perfect for']">{{
          pf
        }}</UBadge>
      </div>
    </template>
  </UCard>
</template>

<script setup>
import { useOutfitStore } from '~/stores/outfit';

const props = defineProps({
  day: String,
  outfit: Object,
  isLoading: Boolean,
  tripId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["generateImage", "showImage"]);
const outfitStore = useOutfitStore();

const handleShowImage = (imageUrl) => {
  emit("showImage", imageUrl);
};

const handleGenerateImage = async () => {
  try {
    emit("generateImage", props.day, props.outfit);
  } catch (error) {
    console.error("Error generating image:", error);
  }
};
</script>
