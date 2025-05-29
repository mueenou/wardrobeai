export default defineNuxtRouteMiddleware((to) => {
  try {
    const user = useSupabaseUser();

    // If user is logged in and tries to access landing or login pages, redirect to home
    if (user.value && (to.path === "/landing" || to.path === "/login")) {
      return navigateTo("/");
    }

    // If user is not logged in and tries to access protected pages, redirect to landing
    if (
      !user.value &&
      to.path !== "/landing" &&
      to.path !== "/login" &&
      to.path !== "/register"
    ) {
      return navigateTo("/landing");
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    // In case of error, redirect to landing page as a fallback
    return navigateTo("/landing");
  }
});
