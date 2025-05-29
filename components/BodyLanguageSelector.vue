<template>
  <div class="flex gap-2 text-primary">
    <div
      class="border w-[10rem] h-[10rem] p-2 grid place-content-center rounded cursor-pointer hover:border-primary overflow-hidden"
      :class="{ 'ring-2 ring-orange-500 border-none': modelValue == 'obese' }"
      @click="$emit('update:modelValue', 'obese')"
    >
      <UTooltip text="Obese" :openDelay="300">
        <img
          :src="obeseImage"
          alt="Obese body type"
          class="w-full h-full object-contain p-4 max-h-[14rem] max-w-[7rem] mx-auto"
          :class="obeseImage.includes('man') ? 'scale-125' : ''"
        />
      </UTooltip>
    </div>
    <div
      class="border w-[10rem] h-[10rem] p-2 grid place-content-center rounded cursor-pointer hover:border-primary overflow-hidden"
      :class="{ 'ring-2 ring-orange-500 border-none': modelValue == 'normal' }"
      @click="$emit('update:modelValue', 'normal')"
    >
      <UTooltip text="Normal" :openDelay="300">
        <img
          :src="normalImage"
          alt="Normal body type"
          class="w-full h-full object-contain p-4 max-h-[14rem] max-w-[7rem] mx-auto"
          :class="obeseImage.includes('man') ? 'scale-125' : ''"
        />
      </UTooltip>
    </div>
    <div
      class="border w-[10rem] h-[10rem] p-2 grid place-content-center rounded cursor-pointer hover:border-primary overflow-hidden"
      :class="{ 'ring-2 ring-orange-500 border-none': modelValue == 'skinny' }"
      @click="$emit('update:modelValue', 'skinny')"
    >
      <UTooltip text="Skinny" :openDelay="300">
        <img
          :src="skinnyImage"
          alt="Skinny body type"
          class="w-full h-full object-contain p-4 max-h-[14rem] max-w-[7rem] mx-auto"
          :class="obeseImage.includes('man') ? 'scale-125' : ''"
        />
      </UTooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
});

const obeseImage = computed(() => {
  return props.gender === "Man"
    ? "/images/man_body_obese.png"
    : "/images/female_body_obese.png";
});

const normalImage = computed(() => {
  return props.gender === "Man"
    ? "/images/man_body_normal.png"
    : "/images/female_body_normal.png";
});

const skinnyImage = computed(() => {
  return props.gender === "Man"
    ? "/images/man_body_skinny2.png"
    : "/images/female_body_skinny.png";
});
</script>
