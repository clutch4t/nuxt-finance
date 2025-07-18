export const useFetchTransactions = (period) => {
	const supabase = useSupabaseClient();
	const transactions = ref([]);
	const pending = ref(false);

	watch(period, async () => {
		await refresh();
	});

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

	const fetchTransactions = async () => {
		pending.value = true;

		try {
			const { data } = await useAsyncData(
				`transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
				async () => {
					try {
						const { data, error } = await supabase
							.from("transactions")
							.select()
							.gte("created_at", period.value.from.toISOString())
							.lte("created_at", period.value.to.toISOString())
							.order("created_at", { ascending: false });

						if (error) return [];

						return data;
					} catch (error) {
						console.error(error);
					}
				}
			);

			return data.value;
		} finally {
			pending.value = false;
		}
	};

	const refresh = async () => {
		transactions.value = await fetchTransactions();
	};

	const transactionsGroupedByDate = computed(() => {
		const grouped = {};

		for (const transaction of transactions.value) {
			const date = transaction.created_at.split("T")[0];

			if (!grouped[date]) {
				grouped[date] = [];
			}

			grouped[date].push(transaction);
		}

		return grouped;
	});

	return {
		transactions: {
			all: transactions,
			grouped: {
				byDate: transactionsGroupedByDate,
			},
			income,
			expense,
			incomeTotal,
			expenseTotal,
			incomeCount,
			expenseCount,
		},
		refresh,
		pending,
	};
};
