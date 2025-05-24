<template>
  <div class="grid min-h-screen w-full lg:grid-cols-[200px_1fr]">
    <!-- Sidebar -->
    <DashboardSidebar />
    <DashboardNavbar>
      <slot />
    </DashboardNavbar>
    <!-- Navbar -->
  </div>
</template>
