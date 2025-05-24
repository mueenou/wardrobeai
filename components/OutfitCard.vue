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
            :icon="isLoading ? 'eos-icons:three-dots-loading' : 'bi:stars'"
            @click="$emit('generateImage', day, outfit)"
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
          class="cursor-pointer"
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
const props = defineProps({
  day: String,
  outfit: Object,
  isLoading: Boolean,
});

const emit = defineEmits(["generateImage", "showImage"]);

const handleShowImage = (imageUrl) => {
  emit("showImage", imageUrl);
};
</script>
