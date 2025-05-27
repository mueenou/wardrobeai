export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Skip middleware for auth-related pages
  if (to.path === "/login" || to.path === "/register") {
    return;
  }

  // If user is not logged in, redirect to login
  if (!user.value) {
    return navigateTo("/login");
  }
});
