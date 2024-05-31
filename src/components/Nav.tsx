"use client"

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({children}: {children: ReactNode}) {
  return <nav className="bg-primary text-primary-foreground flex justify-center px-4">
    {children}
  </nav>
}

// we are going to construct our own className prop for the Link component, so we use the Omit to unset the types for this
export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  // use cn() to help build a custom pathname based on the url
  // since we're using a hook, this becomes a CLIENT component, because it depends on the client to build it.
  const pathname = usePathname
  return <Link {... props} className={cn("p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground", pathname === props.href && "bg-background text-foreground")} />
}