<template>
  <div class="flex gap-2 text-primary">
    <div
      class="border w-[80px] h-[80px] p-2 grid place-content-center rounded cursor-pointer hover:border-primary overflow-hidden"
      :class="{ 'ring-2 ring-primary': modelValue == 'Man' }"
      @click="$emit('update:modelValue', 'Man')"
    >
      <UTooltip text="Man">
        <Icon name="i-ion:man" class="text-7xl" />
      </UTooltip>
    </div>
    <div
      class="border w-[80px] h-[80px] p-2 grid place-content-center rounded cursor-pointer hover:border-primary overflow-hidden"
      :class="{ 'ring-2 ring-primary': modelValue == 'Woman' }"
      @click="$emit('update:modelValue', 'Woman')"
    >
      <UTooltip text="Woman">
        <Icon name="i-ion:woman" class="text-7xl" />
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
