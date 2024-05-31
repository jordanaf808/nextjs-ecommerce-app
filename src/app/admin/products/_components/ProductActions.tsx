"use client"

import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteProduct, toggleProductAvailability } from "../../_actions/products";
import { useRouter } from "next/navigation";

// Some actions on products require Client interactions on the products page.tsx which is a server component, so we make a special 'client' component that we can import in to the products page.tsx.
export function ActiveToggleDropdownItem({id, isAvailableForPurchase}: {id: string, isAvailableForPurchase: boolean}) {
  const [isPending, startTransition] = useTransition()
  // make sure to use next/navigation router
  const router = useRouter();
  return (
    <DropdownMenuItem 
      disabled={isPending}
      onClick={() => {
      startTransition(async () => {
        await toggleProductAvailability(id, !isAvailableForPurchase)
        // to show our changes we need to refresh our page
        router.refresh()
      })
    }}>
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
)}

export function DeleteDropdownItem({id, disabled}: {id: string, disabled: boolean}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter();
  return (
    <DropdownMenuItem 
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
      startTransition(async () => {
        await deleteProduct(id)
        router.refresh()
      })
    }}>
      Delete
    </DropdownMenuItem>
)}