import { UserHeader } from "@/components/user/UserHeader";
import { UserFooter } from "@/components/user/UserFooter";
import { SupportWidget } from "@/components/user/SupportWidget";

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
      <SupportWidget />
    </div>
  );
}

