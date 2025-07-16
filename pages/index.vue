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
				:last-amount="previousIncomeTotal"
				:loading="pending"
			/>
			<FinanceTrend
				color="red"
				title="Expense"
				:amount="expenseTotal"
				:last-amount="previousExpenseTotal"
				:loading="pending"
			/>
			<FinanceTrend
				color="red"
				title="Investments"
				:amount="4000"
				:last-amount="4100"
				:loading="pending"
			/>
			<FinanceTrend
				color="green"
				title="Savings"
				:amount="4000"
				:last-amount="3000"
				:loading="pending"
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
					@saved="refresh()"
				/>
			</div>
		</section>
		<section v-if="!pending">
			<div
				v-for="(transactionsDaily, date) in byDate"
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
					@deleted="refresh()"
					@edited="refresh()"
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

	const user = useSupabaseUser();

	const selectedView = ref(
		user.value.user_metadata?.transaction_view ?? transactionViewOptions[1]
	);
	const isAddModalOpen = ref(false);
	const { current, previous } = useSelectedTimePeriod(selectedView);

	const {
		pending,
		refresh,
		transactions: {
			incomeCount,
			expenseCount,
			incomeTotal,
			expenseTotal,
			grouped: { byDate },
		},
	} = useFetchTransactions(current);

	await refresh();

	const {
		refresh: refreshPrevious,
		transactions: {
			incomeTotal: previousIncomeTotal,
			expenseTotal: previousExpenseTotal,
		},
	} = useFetchTransactions(previous);

	await refreshPrevious();
</script>
