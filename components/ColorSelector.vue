<!-- ColorSelector.vue -->
<template>
  <div>
    <UInput
      v-model="colorFilter"
      placeholder="Search your color"
      color="indigo"
      variant="outline"
      size="sm"
      class="my-2 w-fit"
    />
    <div class="flex gap-2 flex-wrap max-h-[300px] overflow-y-auto p-2 rounded">
      <div
        v-for="color in filteredColor"
        :key="color.id"
        class="border w-[50px] h-[50px] rounded-full flex flex-col items-center justify-center hover:border-primary cursor-pointer"
        :style="{ backgroundColor: color.hex }"
        :class="{ 'ring-4 ring-orange-500 border-none': modelValue === color }"
        role="button"
        :aria-label="`Select ${color.name} color`"
        :aria-selected="modelValue === color.name.toLowerCase()"
        @click="selectColor(color)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { CLOTHING_COLORS } from "~/constants/clothing";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const colorFilter = ref("");
const colors = ref(CLOTHING_COLORS);

const filteredColor = computed(() => {
  if (!colorFilter.value.trim()) {
    return colors.value;
  }
  return colors.value.filter((color) =>
    color.name.toLowerCase().includes(colorFilter.value.trim().toLowerCase())
  );
});

const selectColor = (value) => {
  emit("update:modelValue", value);
};
</script>
