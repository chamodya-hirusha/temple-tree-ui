import { UserHeader } from "@/components/user/UserHeader";
import { UserFooter } from "@/components/user/UserFooter";
import { CartDrawer } from "@/components/user/CartDrawer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">{children}</main>
      <UserFooter />
      <CartDrawer />
    </div>
  );
}
