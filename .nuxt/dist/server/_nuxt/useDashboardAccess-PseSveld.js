import { l as useState } from "../server.mjs";
import { computed } from "vue";
const ownerPermissions = [
  "orders.view",
  "orders.status.change",
  "orders.kanban.move",
  "menu.manage",
  "marketing.manage",
  "branches.view",
  "branches.create",
  "branches.archive",
  "team.manage",
  "settings.org.edit",
  "integrations.manage"
];
const managerPermissions = [
  "orders.view",
  "orders.status.change",
  "menu.manage",
  "marketing.manage",
  "branches.view",
  "branches.create"
];
function useDashboardAccess() {
  const state = useState("dashboard-access-state", () => null);
  const loading = useState("dashboard-access-loading", () => false);
  const error = useState("dashboard-access-error", () => null);
  const role = computed(() => state.value?.role ?? "manager");
  const permissions = computed(() => {
    const list = role.value === "owner" ? ownerPermissions : managerPermissions;
    return new Set(list);
  });
  const can = (permission) => permissions.value.has(permission);
  const load = async () => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;
    try {
      const access = await $fetch("/api/dashboard/access");
      state.value = access;
    } catch (err) {
      state.value = null;
      error.value = err?.data?.statusMessage || err?.message || "Failed to load dashboard access";
    } finally {
      loading.value = false;
    }
  };
  return {
    access: state,
    role,
    loading,
    error,
    can,
    load
  };
}
export {
  useDashboardAccess as u
};
