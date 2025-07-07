export const useUserLoggedIn = (url = "/") => {
	const user = useSupabaseUser();
	const toast = useToast();

	watch(
		user,
		(user) => {
			if (user) {
				toast.add({
					title: "Success",
					icon: "i-heroicons-check-circle",
					description: "You have successfully signed in!",
					color: "green",
				});
				return navigateTo(url);
			}
		},
		{ immediate: true }
	);

	return { user };
};
