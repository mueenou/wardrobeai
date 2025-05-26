<template>
  <div class="grid min-h-screen w-full lg:grid-cols-[300px_1fr]">
    <!-- Sidebar -->
    <DashboardSidebar />
    <DashboardNavbar>
      <slot />
    </DashboardNavbar>
    <!-- Navbar -->
  </div>
</template>
