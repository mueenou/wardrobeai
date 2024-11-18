<!-- ClothTable.vue -->
<template>
  <div class="border rounded-lg mt-4" v-if="items.length > 0">
    <div class="flex px-3 py-3.5 border-b border-slate200 dark:border-slate700">
      <USelectMenu
        v-model="selectedColumns"
        :options="columns"
        multiple
        placeholder="Select columns"
      />
    </div>

    <UTable
      :columns="selectedColumns"
      class="w-full"
      rowClass="text-center"
      :rows="items"
      :loading="isLoading"
    >
      <!-- Custom cell rendering for color preview -->
      <template #color-data="{ row }">
        <!-- <pre>{{ row.color.color }}</pre> -->
        <div class="flex items-center gap-2">
          <div
            class="w-4 h-4 rounded-full"
            :style="`background-color: ${row.color.hex}`"
          />
          {{ row.color.name }}
        </div>
      </template>

      <!-- Custom cell rendering for actions -->
      <template #actions-data="{ row }">
        <div class="flex items-center w-full">
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            class="mx-auto"
            @click="handleDelete(row)"
          />
        </div>
      </template>
    </UTable>
  </div>
  <div v-else class="text-center py-4 text-slate500">No items available.</div>
</template>

<script setup>
// Props using v-model pattern
const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

console.log(props.modelValue);

const emit = defineEmits(["update:modelValue"]);

// Computed property for items to maintain reactivity
const items = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});

// Internal state
const isLoading = ref(false);
const selectedColumns = ref([]);

// Table configuration
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "color",
    label: "Color",
  },
  {
    key: "style",
    label: "Style",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

// Initialize selected columns
selectedColumns.value = [...columns];

// Internal methods
const handleDelete = async (item) => {
  items.value = items.value.filter((i) => i.id !== item.id);
};
</script>
