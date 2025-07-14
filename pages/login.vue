<template>
	<UCard v-if="!success">
		<template #header> Sign into Nuxt Finance </template>
		<form @submit.prevent="handleLogin">
			<UFormGroup
				label="Email"
				name="email"
				class="mb-4"
				:required="true"
				help="You will receive an email with the confirmation link."
			>
				<UInput
					v-model="email"
					type="email"
					placeholder="Email"
					:required="true"
				/>
			</UFormGroup>
			<UButton
				:loading="pending"
				:disabled="pending"
				type="submit"
				variant="solid"
				color="black"
			>
				Sign in
			</UButton>
		</form>
	</UCard>
	<UCard v-else>
		<template #header> Email has been sent. </template>
		<div class="text-center">
			<p class="mb-4">
				We have sent an email to <b>{{ email }}</b> with a link to sign
				in.
			</p>
			<p><b>Important:</b> The link will expire in 5 minutes.</p>
		</div>
	</UCard>
</template>

<script setup>
	const { toastError } = useAppToast();
	const supabase = useSupabaseClient();

	const success = ref(false);
	const email = ref("");
	const pending = ref(false);

	useUserLoggedIn();

	const handleLogin = async () => {
		pending.value = true;

		try {
			const { error } = supabase.auth.signInWithOtp({
				email: email.value,
			});

			if (error) {
				toastError({
					title: "Error while being authenticated",
					description: error.message,
				});
			} else {
				success.value = true;
			}
		} catch (error) {
			toastError({
				title: "Error logging in",
				description: error.message,
			});
		}
	};
</script>
