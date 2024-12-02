<template>
  <div class="relative">
    <div
      class="absolute bg-primary/40 text-gray-900 dark:text-gray-50 bottom-0 left-0 rounded-tr-sm p-1 shadow text-xs font-bold backdrop-blur-lg"
    >
      <nuxt-link to="https://www.flaticon.com/">
        <p>Illustrations by flaticon.com</p>
      </nuxt-link>
    </div>
    <UInput
      placeholder="Search your cloth"
      label="Submit"
      color="indigo"
      variant="outline"
      size="sm"
      class="my-2 w-fit"
      v-model="clothesFilter"
    />
    <div
      class="flex gap-2 flex-wrap max-h-[300px] overflow-y-auto p-2 pb-8 border border-primary rounded"
    >
      <div
        class="border w-[100px] h-[100px] rounded flex flex-col items-center gap-y-1 justify-center hover:border-primary cursor-pointer"
        :class="{ 'ring-2 ring-orange-500 border-none': modelValue === cloth.value }"
        v-for="cloth in filteredData"
        :key="cloth.id"
        @click="selectCloth(cloth.value)"
      >
        <p class="text-xs font-bold">{{ cloth.name }}</p>
        <img :src="`/images/${cloth.image}`" class="w-[70%]" />
      </div>
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

const emit = defineEmits(["update:modelValue"]);

const clothesFilter = ref("");

const clothes = ref([
  { id: 1, name: "T-shirt", image: "shirt.png", value: "t-shirt" },
  { id: 37, name: "Polo shirt", image: "polo-shirt.png", value: "polo-shirt" },
  { id: 2, name: "Pants", image: "pants.png", value: "pants" },
  { id: 27, name: "Jeans", image: "jeans.png", value: "jeans" },
  { id: 40, name: "Joggers pants", image: "jogger-pants.png", value: "joggers-pants" },
  { id: 20, name: "Socks", image: "socks.png", value: "socks" },
  { id: 3, name: "Sneakers", image: "sneakers.png", value: "shoes" },
  { id: 38, name: "High heels", image: "high-heels.png", value: "high-heels" },
  { id: 4, name: "Cap", image: "cap.png", value: "cap" },
  { id: 39, name: "Winter hat", image: "winter-hat.png", value: "winter-hat" },
  // hijab
  { id: 42, name: "Hijab", image: "hijab.png", value: "hijab" },
  { id: 5, name: "Sunglasses", image: "sunglasses.png", value: "sunglasses" },
  { id: 41, name: "Long sleeve", image: "long-sleeve.png", value: "long-sleeve" },
  { id: 6, name: "Jacket", image: "jacket.png", value: "jacket" },
  { id: 24, name: "Cardigan", image: "cardigan.png", value: "cardigan" },
  { id: 28, name: "Hoodie", image: "hoodie.png", value: "hoodie" },
  { id: 29, name: "Sweater", image: "sweater.png", value: "sweater" },
  { id: 30, name: "Blouse", image: "blouse.png", value: "blouse" },
  { id: 31, name: "Blazer", image: "blazer.png", value: "blazer" },
  { id: 32, name: "Suit", image: "suit.png", value: "suit" },
  { id: 33, name: "Trench coat", image: "trench-coat.png", value: "trench-coat" },
  { id: 34, name: "Umbrella", image: "umbrella.png", value: "umbrella" },
  { id: 35, name: "Waistcoat", image: "waistcoat.png", value: "waistcoat" },
  { id: 36, name: "Sweatpants", image: "sweatpants.png", value: "sweatpants" },
  { id: 7, name: "Shorts", image: "shorts.png", value: "shorts" },
  { id: 8, name: "Shirt", image: "shirt.png", value: "shirt" },
  { id: 9, name: "Dress", image: "dress.png", value: "dress" },
  { id: 10, name: "Skirt", image: "skirt.png", value: "skirt" },
  { id: 11, name: "Boots", image: "boots.png", value: "boots" },
  { id: 12, name: "Scarf", image: "scarf.png", value: "scarf" },
  { id: 13, name: "Gloves", image: "gloves.png", value: "gloves" },
  { id: 14, name: "Umbrella", image: "umbrella.png", value: "umbrella" },
  { id: 15, name: "Raincoat", image: "raincoat.png", value: "raincoat" },
  { id: 16, name: "Swimsuit M", image: "swimsuit.png", value: "swimsuit" },
  {
    id: 41,
    name: "Swimsuit F",
    image: "swimsuit-woman.png",
    value: "swimsuit-woman",
  },
  { id: 17, name: "Flip-flops", image: "flip-flops.png", value: "flip-flops" },
  { id: 18, name: "Tie", image: "tie.png", value: "tie" },
  { id: 19, name: "Watch", image: "wrist-watch.png", value: "watch" },
  { id: 22, name: "Smart watch", image: "smart-watch.png", value: "smart-watch" },
  { id: 21, name: "Belt", image: "belt.png", value: "belt" },
  { id: 23, name: "Kurta", image: "kurta.png", value: "kurta" },
  { id: 25, name: "Saree", image: "saree.png", value: "saree" },
  { id: 26, name: "Qamis", image: "qamis.png", value: "qamis" },
]);

const filteredData = computed(() => {
  if (!clothesFilter.value) {
    return clothes.value;
  }
  return clothes.value.filter((cloth) =>
    cloth.name.toLowerCase().includes(clothesFilter.value.toLowerCase())
  );
});

const selectCloth = (value) => {
  emit("update:modelValue", value);
};
</script>
