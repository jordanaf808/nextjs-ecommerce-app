import { Nav, NavLink } from "@/components/Nav";

// Next.js will see this and not cache any pages on this route, so the data is always fresh.
export const dynamic = "force-dynamic";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <Nav>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/products">Products</NavLink>
      <NavLink href="/orders">My Orders</NavLink>
    </Nav>
    <div className="container my-6">
      {children}
    </div>
  </>
}