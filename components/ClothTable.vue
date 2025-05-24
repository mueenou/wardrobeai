<!-- ClothTable.vue -->
<template>
  <div class="border border-primary rounded-lg mt-4" v-if="clothesList.length > 0">
    <div class="flex px-3 py-3.5 border-b border-primary dark:border-primary">
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
      :rows="clothesList"
      :loading="isLoading"
    >
      <template #color-data="{ row }">
        <div class="flex items-center gap-2">
          <div
            class="w-4 h-4 rounded-full"
            :style="`background-color: ${row.color.hex}`"
          />
          {{ row.color.name }}
        </div>
      </template>

      <template #actions-data="{ row }">
        <div class="flex items-center w-full">
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-trash"
            @click="handleDelete(row)"
          />
        </div>
      </template>
    </UTable>
  </div>
  <div v-else class="text-center py-4 text-slate-500">
    No items available in your luggage.
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useOutfitStore } from "~/stores/outfit";

const outfitStore = useOutfitStore();
const { clothesList } = storeToRefs(outfitStore);

// State interne du composant
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

const toast = useToast();
// Suppression d'un élément de la liste
const handleDelete = async (item) => {
  outfitStore.removeCloth(item.id);
  toast.add({
    title: "Item deleted",
    description: `Item with ID ${item.id} has been deleted.`,
    timeout: 3000,
    icon: "i-bx-trash",
  });
};
</script>
