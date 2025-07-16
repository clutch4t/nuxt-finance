<template>
	<UModal v-model="isAddModalOpen">
		<UCard>
			<template #header
				>{{ isEditing ? "Edit" : "Add" }} transaction</template
			>
			<UForm
				ref="form"
				:state="state"
				:schema="schema"
				@submit="saveForm"
			>
				<UFormGroup
					label="Transaction Type"
					name="type"
					class="mb-4"
					:required="true"
				>
					<USelect
						v-model="state.type"
						:disabled="isEditing"
						placeholder="Select the transaction type"
						:options="types"
					/>
				</UFormGroup>
				<UFormGroup
					label="Amount"
					:required="true"
					name="amount"
					class="mb-4"
				>
					<UInput
						v-model.number="state.amount"
						type="number"
						placeholder="Enter the amount"
					/>
				</UFormGroup>
				<UFormGroup
					label="Transaction date"
					:required="true"
					name="created_at"
					class="mb-4"
				>
					<UInput
						v-model="state.created_at"
						type="date"
						icon="i-heroicons-calendar-days-20-solid"
					/>
				</UFormGroup>
				<UFormGroup
					label="Description"
					hint="Optional"
					name="description"
					class="mb-4"
				>
					<UInput
						v-model="state.description"
						placeholder="Description"
					/>
				</UFormGroup>
				<UFormGroup
					v-if="state.type === 'Expense'"
					label="Category"
					name="category"
					class="mb-4"
					:required="true"
				>
					<USelect
						v-model="state.category"
						placeholder="Category"
						:options="categories"
					/>
				</UFormGroup>

				<UButton
					type="submit"
					color="black"
					variant="solid"
					label="Save"
					:loading="isLoading"
				/>
			</UForm>
		</UCard>
	</UModal>
</template>

<script setup>
	import { categories, types } from "~/constants";
	import { z } from "zod";

	const supabase = useSupabaseClient();
	const { toastSuccess, toastError } = useAppToast();

	const props = defineProps({
		modelValue: Boolean,
		transaction: {
			type: Object,
			required: false,
		},
	});

	const emit = defineEmits(["update:modelValue", "saved"]);

	const isEditing = computed(() => !!props.transaction);

	const defaultSchema = z.object({
		created_at: z.string(),
		description: z.string().optional(),
		amount: z.number().positive("Amount needs to be more than 0"),
	});

	const incomeSchema = z.object({
		type: z.literal("Income"),
	});

	const expenseSchema = z.object({
		type: z.literal("Expense"),
		category: z.enum(categories),
	});

	const investmentSchema = z.object({
		type: z.literal("Investment"),
	});

	const savingsSchema = z.object({
		type: z.literal("Savings"),
	});

	const schema = z.intersection(
		z.discriminatedUnion("type", [
			incomeSchema,
			expenseSchema,
			investmentSchema,
			savingsSchema,
		]),
		defaultSchema
	);

	const form = ref(null);
	const isLoading = ref(false);

	const initialState = isEditing.value
		? {
				type: props.transaction.type,
				amount: props.transaction.amount,
				created_at: props.transaction.created_at.split("T")[0],
				description: props.transaction.description,
				category: props.transaction.category,
		  }
		: {
				type: undefined,
				amount: 0,
				created_at: undefined,
				description: undefined,
				category: undefined,
		  };
	const state = ref({ ...initialState });

	const isAddModalOpen = computed({
		get: () => props.modelValue,
		set: (value) => {
			if (!value) resetForm();
			emit("update:modelValue", value);
		},
	});

	const saveForm = async () => {
		if (form.value.errors.length) return;

		isLoading.value = true;

		try {
			const { error } = await supabase
				.from("transactions")
				.upsert({ ...state.value, id: props.transaction?.id });

			if (!error) {
				toastSuccess({
					title: "Transaction saved",
				});
				isAddModalOpen.value = false;
				emit("saved");
				return;
			}

			throw error;
		} catch (error) {
			toastError({
				title: `Error saving transaction`,
				description: `${error.message}`,
				icon: "i-heroicons-exclamation-circle",
				color: "red",
			});
		} finally {
			isLoading.value = false;
		}
	};

	const resetForm = () => {
		Object.assign(state.value, initialState);
		form.value.clear();
	};
</script>
