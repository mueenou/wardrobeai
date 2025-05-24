<template>
  <div class="flex gap-2 text-primary">
    <div
      class="border w-[10rem] h-[10rem] p-2 grid place-content-center rounded cursor-pointer hover:border-primary overflow-hidden"
      :class="{ 'ring-2 ring-orange-500 border-none': modelValue == 'Man' }"
      @click="$emit('update:modelValue', 'Man')"
    >
      <UTooltip text="Man" :openDelay="300">
        <Icon name="i-ion:man" class="text-9xl" />
      </UTooltip>
    </div>
    <div
      class="border w-[10rem] h-[10rem] p-2 grid place-content-center rounded cursor-pointer hover:border-primary overflow-hidden"
      :class="{ 'ring-2 ring-orange-500 border-none': modelValue == 'Woman' }"
      @click="$emit('update:modelValue', 'Woman')"
    >
      <UTooltip text="Woman" :openDelay="300">
        <Icon name="i-ion:woman" class="text-9xl" />
      </UTooltip>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});
</script>
