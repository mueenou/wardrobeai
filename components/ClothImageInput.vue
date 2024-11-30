<template>
  <div class="flex gap-2 flex-wrap">
    <div
      class="border w-[100px] h-[100px] rounded flex flex-col items-center justify-center hover:border-primary cursor-pointer"
      :class="{ 'ring-2 ring-primary': modelValue === cloth.value }"
      v-for="cloth in clothes"
      :key="cloth.id"
      @click="selectCloth(cloth.value)"
    >
      <p class="text-xs font-bold">{{ cloth.name }}</p>
      <img :src="`/images/${cloth.image}`" class="w-[70%]" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  required: true,
});

const emit = defineEmits(["update:modelValue"]);

const clothes = ref([
  { id: 1, name: "T-shirt", image: "shirt.png", value: "t-shirt" },
  { id: 2, name: "Pants", image: "jeans.png", value: "pants" },
  { id: 3, name: "Sneakers", image: "sneakers.png", value: "shoes" },
  { id: 4, name: "Cap", image: "cap.png", value: "cap" },
  { id: 5, name: "Sunglasses", image: "sunglasses.png", value: "sunglasses" },
  { id: 6, name: "Jacket", image: "jacket.png", value: "jacket" },
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
    id: 16,
    name: "Swimsuit F",
    image: "swimsuit-woman.png",
    value: "swimsuit-woman",
  },
  { id: 17, name: "Flip-flops", image: "flip-flops.png", value: "flip-flops" },
  { id: 18, name: "Tie", image: "tie.png", value: "tie" },
  { id: 19, name: "Watch", image: "wrist-watch.png", value: "watch" },
  { id: 22, name: "Smart watch", image: "smart-watch.png", value: "smart-watch" },
  { id: 20, name: "Socks", image: "socks.png", value: "socks" },
  { id: 21, name: "Belt", image: "belt.png", value: "belt" },
  { id: 23, name: "Kurta", image: "kurta.png", value: "kurta" },
  { id: 25, name: "Saree", image: "saree.png", value: "saree" },
  { id: 26, name: "Qamis", image: "qamis.png", value: "qamis" },
]);

const selectCloth = (value) => {
  emit("update:modelValue", value);
};
</script>
