<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-24" />
      <div v-else>{{ currency }}</div>
    </div>
    <div>
      <USkeleton v-if="loading" class="h-6 w-full" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          :name="trendIcon"
          class="w-6 h-6"
          :class="{ green: trendingUp, red: !trendingUp }"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});

const trendingUp = computed(() => props.amount >= props.lastAmount);

const trendIcon = computed(() =>
  trendingUp.value
    ? "i-heroicons-arrow-trending-up"
    : "i-heroicons-arrow-trending-down"
);

const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) {
    return "";
  }

  const biggerValue = Math.max(props.amount, props.lastAmount);
  const smallerValue = Math.min(props.amount, props.lastAmount);

  const ratio = ((biggerValue - smallerValue) / smallerValue) * 100;

  return `${Math.ceil(ratio)}%`;
});

const { currency } = useCurrency(props.amount);
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}

.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
