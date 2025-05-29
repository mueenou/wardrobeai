<!-- ImageSlider.vue -->
<template>
  <USlideover v-model="isOpenComputed">
    <div class="p-4 flex-1">
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        icon="lucide:x"
        class="flex sm:hidden absolute end-5 top-5 z-10"
        square
        padded
        @click="closeSlider"
      />
      <div class="h-full">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="imageAlt"
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  </USlideover>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  imageUrl: String,
  imageAlt: String,
});

const emit = defineEmits(["update:modelValue"]);

// Computed property pour gérer v-model
const isOpenComputed = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Méthode pour fermer le slider
const closeSlider = () => {
  emit("update:modelValue", false);
};
</script>
