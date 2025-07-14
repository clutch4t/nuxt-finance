<template>
	<div
		class="grid grid-cols-3 py-3 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
	>
		<div class="flex items-center justify-between col-span-2">
			<div class="flex items-center gap-2">
				<UIcon
					:name="typeIcon"
					:class="[iconColor]"
				/>
				<div>{{ transaction.description }}</div>
			</div>
			<UBadge
				v-if="transaction.category"
				color="white"
				>{{ transaction.category }}</UBadge
			>
		</div>
		<div class="flex items-center justify-end gap-4">
			<div>{{ currency }}</div>
			<UDropdown
				:items="items"
				:popper="{ placement: 'bottom-start' }"
			>
				<UButton
					color="white"
					variant="ghost"
					trailing-icon="i-heroicons-ellipsis-horizontal"
					:loading="isLoading"
				/>
			</UDropdown>
		</div>
	</div>
</template>

<script setup>
	const { toastSuccess, toastError } = useAppToast();
	const supabase = useSupabaseClient();
	const emit = defineEmits(["deleted"]);

	const props = defineProps({
		transaction: Object,
	});

	const typeIcon = computed(() =>
		props.transaction.type === "Income"
			? "i-heroicons-arrow-up-right"
			: "i-heroicons-arrow-down-right"
	);

	const iconColor = computed(() =>
		props.transaction.type === "Income" ? "text-green-600" : "text-red-600"
	);

	const { currency } = useCurrency(props.transaction.amount);

	const isLoading = ref(false);

	const deleteTransaction = async () => {
		isLoading.value = true;

		try {
			await supabase
				.from("transactions")
				.delete()
				.eq("id", props.transaction.id);

			toastSuccess({
				title: "Transaction deleted",
			});

			emit("deleted", props.transaction.id);
		} catch (error) {
			toastError({
				title: `${error}`,
			});
		} finally {
			isLoading.value = false;
		}
	};
	const items = [
		[
			{
				label: "Edit",
				icon: "i-heroicons-pencil-square-20-solid",
				click: () => console.log("edit"),
			},
			{
				label: "Delete",
				icon: "i-heroicons-trash-20-solid",
				click: () => deleteTransaction(),
			},
		],
	];
</script>
