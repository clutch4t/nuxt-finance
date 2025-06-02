<template>
  <div>
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelectMenu v-model="selectedView" :options="transactionViewOptions" />
      </div>
    </section>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16">
      <FinanceTrend
        color="green"
        title="Income"
        :amount="4000"
        :last-amount="3000"
        :loading="false"
      />
      <FinanceTrend
        color="red"
        title="Expense"
        :amount="4000"
        :last-amount="5000"
        :loading="false"
      />
      <FinanceTrend
        color="red"
        title="Investments"
        :amount="4000"
        :last-amount="4100"
        :loading="false"
      />
      <FinanceTrend
        color="green"
        title="Savings"
        :amount="4000"
        :last-amount="3000"
        :loading="false"
      />
    </section>
    <section>
      <FinanceTransaction />
      <FinanceTransaction />
      <FinanceTransaction />
      <FinanceTransaction />
    </section>
  </div>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";

const selectedView = ref(transactionViewOptions[1]);
</script>
