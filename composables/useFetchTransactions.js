export const useFetchTransactions = () => {
	const supabase = useSupabaseClient();
	const transactions = ref([]);
	const pending = ref(false);

	const income = computed(() =>
		transactions.value.filter((t) => t.type === "Income")
	);

	const expense = computed(() =>
		transactions.value.filter((t) => t.type === "Expense")
	);

	const incomeCount = computed(() => income.value.length);
	const expenseCount = computed(() => expense.value.length);

	const incomeTotal = computed(() =>
		income.value.reduce((acc, current) => acc + current.amount, 0)
	);
	const expenseTotal = computed(() =>
		expense.value.reduce((acc, current) => acc + current.amount, 0)
	);
};
