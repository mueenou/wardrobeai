<template>
  <UCard>
    <template #header>
      <div class="flex gap-2 items-center font-bold">
        <UBadge class="font-bold min-w-[55px] grid place-content-center">{{
          day
        }}</UBadge>
        <p class="text-xs flex-grow">{{ outfit.Outfit }}</p>
        <UTooltip text="See how it looks in an image!">
          <UButton
            size="2xs"
            variant="outline"
            class="self-end"
            :icon="isLoading ? 'eos-icons:three-dots-loading' : 'bi:stars'"
            @click="$emit('generateImage', day, outfit)"
          >
            {{ isLoading ? "Generating" : "" }}
          </UButton>
        </UTooltip>
      </div>
    </template>
    <div class="grid grid-cols-2 w-full items-center">
      <div class="flex gap-2">
        <p>{{ outfit["Style Theme"] }}</p>
        <p>{{ outfit["Weather"] }}</p>
        <p>{{ outfit["Accessories"] ? outfit["Accessories"] : "" }}</p>
      </div>
      <div>
        <!-- <div v-if="isGenerating" class="mt-4">
              <UProgress :value="progressValue" color="primary" />
              <p class="text-sm text-gray-500 mt-2">
                {{ generationStatus }}
              </p>
            </div> -->
        <img
          v-if="outfit.imageUrl"
          :src="outfit.imageUrl"
          alt="Outfit"
          class="cursor-pointer"
          @click="showImage(outfit.imageUrl)"
        />
      </div>
    </div>
    <template #footer>
      <div class="flex gap-x-2 w-full justify-end">
        <UBadge color="blue" v-for="pf in outfit['Perfect for']">{{ pf }}</UBadge>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts">
import { defineProps, defineEmits } from "vue";
const props = defineProps<{
  day: string;
  outfit: OutfitDetails;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  generateImage: [day: string, outfit: OutfitDetails];
  showImage: [imageUrl: string];
}>();

const handleGenerateImage = () => {
  emit("generateImage", props.day, props.outfit);
};

const handleShowImage = (imageUrl: string) => {
  emit("showImage", imageUrl);
};
</script>
