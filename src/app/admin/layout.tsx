import { Nav, NavLink } from "@/components/Nav";

// Next.js will see this and not cache any pages on this route, so the data is always fresh.
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <Nav>
      <NavLink href="/">Dashboard</NavLink>
      <NavLink href="admin/products">Products</NavLink>
      <NavLink href="admin/customers">Customers</NavLink>
      <NavLink href="admin/orders">Sales</NavLink>
    </Nav>
    <div className="container my-6">
      {children}
    </div>
  </>
}