<template>
  <div
    class="grid grid-cols-2 py-3 text-gray-500 dark:text-gray-400 mt-8 font-bold"
  >
    <div class="flex items-center justify-between">
      <p class="border-b border-gray-200 dark:border-gray-800">
        {{ date }}
      </p>
    </div>
    <div class="flex items-center justify-end mr-12">
      <p class="border-b border-gray-200 dark:border-gray-800">
        {{ currency }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  date: String,
  transactions: Array,
});

const sum = computed(() => {
  let sum = 0;

  for (const transaction of props.transactions) {
    if (transaction.type === "Income") {
      sum += transaction.amount;
    } else {
      sum -= transaction.amount;
    }
  }

  return sum;
});

const { currency } = useCurrency(sum);
</script>
