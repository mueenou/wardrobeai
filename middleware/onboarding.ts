export default defineNuxtRouteMiddleware(async (to) => {
  try {
    // Skip middleware for auth-related pages
    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/onboarding"
    ) {
      return;
    }

    const user = useSupabaseUser();
    if (!user.value) {
      return;
    }

    const client = useSupabaseClient();

    // Check user preferences
    const { data: preferences, error: prefError } = await client
      .from("user_preferences")
      .select("gender, ethnicity")
      .eq("user_id", user.value.id)
      .single();

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      return navigateTo("/onboarding");
    }

    // Check if preferences are complete
    if (!preferences || !preferences.gender || !preferences.ethnicity) {
      return navigateTo("/onboarding");
    }

    // Check user metadata
    const {
      data: { user: userData },
      error: userError,
    } = await client.auth.getUser();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return navigateTo("/onboarding");
    }

    if (!userData?.user_metadata?.username) {
      return navigateTo("/onboarding");
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return navigateTo("/onboarding");
  }
});
