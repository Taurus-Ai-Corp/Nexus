import { isAdminAuthenticated } from "./actions";
import { AdminLoginForm } from "./AdminLoginForm";
import { AdminDashboard, MOCK_LEADS } from "./AdminDashboard";

export default async function InvestAdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return <AdminLoginForm />;
  return <AdminDashboard leads={MOCK_LEADS} />;
}
