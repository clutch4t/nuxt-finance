<template>
	<UForm
		:state="state"
		:schema="schema"
		@submit.prevent="saveSettings"
	>
		<UFormGroup
			class="mb-4"
			label="Full name"
			name="name"
		>
			<UInput v-model="state.name" />
		</UFormGroup>
		<UFormGroup
			class="mb-4"
			label="Email"
			name="Email"
			help="You will receive a confirmation email on both old and new addresses, should you change the email now"
		>
			<UInput v-model="state.email" />
		</UFormGroup>
		<UButton
			type="submit"
			color="black"
			variant="solid"
			label="Save"
			:loading="pending"
			:disabled="pending"
		/>
	</UForm>
</template>

<script setup>
	import { z } from "zod";

	const supabase = useSupabaseClient();
	const user = useSupabaseUser();
	const { toastSuccess, toastError } = useAppToast();

	const pending = ref(false);

	const state = ref({
		name: user.value.user_metadata?.full_name,
		email: user.value.email,
	});

	const schema = z.object({
		name: z.string().min(2).optional(),
		email: z.string().email(),
	});

	const saveSettings = async () => {
		pending.value = true;

		try {
			const data = {
				data: {
					full_name: state.value.name,
				},
			};

			if (state.value.email !== user.value.email) {
				data.email = state.value.email;
			}
			const { error } = await supabase.auth.updateUser(data);

			if (error) throw error;

			toastSuccess({
				title: "User settings updated",
				description:
					"Your profile settings have been successfully updated",
			});
		} catch (error) {
			toastError({
				title: "Error saving user settings",
				description: error.message,
			});
		} finally {
			pending.value = false;
		}
	};
</script>
