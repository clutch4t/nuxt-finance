<template>
	<div>
		<section class="flex items-center justify-between mb-10">
			<h1 class="text-4xl font-extrabold">Summary</h1>
			<div>
				<USelectMenu
					v-model="selectedView"
					:options="transactionViewOptions"
				/>
			</div>
		</section>
		<section
			class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16"
		>
			<FinanceTrend
				color="green"
				title="Income"
				:amount="incomeTotal"
				:last-amount="3000"
				:loading="isLoading"
			/>
			<FinanceTrend
				color="red"
				title="Expense"
				:amount="expenseTotal"
				:last-amount="5000"
				:loading="isLoading"
			/>
			<FinanceTrend
				color="red"
				title="Investments"
				:amount="4000"
				:last-amount="4100"
				:loading="isLoading"
			/>
			<FinanceTrend
				color="green"
				title="Savings"
				:amount="4000"
				:last-amount="3000"
				:loading="isLoading"
			/>
		</section>
		<section class="flex justify-between items-center my-10">
			<div>
				<h2 class="text-2xl font-extrabold">Transactions</h2>
				<div class="text-gray-500 dark:text-gray-400">
					You have {{ incomeCount }} incoming transactions and
					{{ expenseCount }} expenses during this period.
				</div>
			</div>
			<div>
				<UButton
					icon="i-heroicons-plus-circle"
					color="green"
					variant="solid"
					label="Add"
					@click="isAddModalOpen = true"
				/>
				<TransactionModal
					v-model="isAddModalOpen"
					@saved="refreshTransactions()"
				/>
			</div>
		</section>
		<section v-if="!isLoading">
			<div
				v-for="(transactionsDaily, date) in transactionsGroupedByDate"
				:key="date"
				class="mb-10"
			>
				<DailyTransactionSummary
					:date="date"
					:transactions="transactionsDaily"
				/>
				<FinanceTransaction
					v-for="transaction in transactionsDaily"
					:key="transaction.id"
					:transaction="transaction"
					@deleted="refreshTransactions()"
				/>
			</div>
		</section>
		<section v-else>
			<USkeleton
				v-for="i in 4"
				:key="i"
				class="h-12 w-full my-4"
			/>
		</section>
	</div>
</template>

<script setup>
	import { transactionViewOptions } from "~/constants";

	const selectedView = ref(transactionViewOptions[1]);
	const isAddModalOpen = ref(false);

	const fetchTransactions = async () => {
		isLoading.value = true;

		try {
			const { data } = await useAsyncData("transactions", async () => {
				const { data, error } = await supabase
					.from("transactions")
					.select()
					.order("created_at", { ascending: false });

				if (error) return [];

				return data;
			});

			return data.value;
		} finally {
			isLoading.value = false;
		}
	};

	const refreshTransactions = async () => {
		transactions.value = await fetchTransactions();
	};

	await refreshTransactions();

	const transactionsGroupedByDate = computed(() => {
		const grouped = {};

		for (const transaction of transactions.value) {
			const date = new Date(transaction.created_at)
				.toISOString()
				.split("T")[0];

			if (!grouped[date]) {
				grouped[date] = [];
			}

			grouped[date].push(transaction);
		}

		return grouped;
	});
</script>
