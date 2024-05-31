"use client"
// we are building are own form, but @shadcn-ui provides a very robust form of their own built with React Hook Form and Zod, and packaged with several form components so you don't have to install each one separately.
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/formatters"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"

// form to set price
export function ProductForm() {
  // When using this hook your Form Action needs 2 props, prevState and currState
  const [error, action] = useFormState(addProduct, {})
  // by setting the input type to number we don't have to set a default value.
  const [priceInCents, setPriceInCents] = useState<number>()

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required />
        {error.name && <div className="text-sm opacity-75 text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Price In Cents</Label>
        <Input type="number" id="priceInCents" name="priceInCents" required value={priceInCents} onChange={e => setPriceInCents(Number(e.target.value))} />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && <div className="text-sm opacity-75 text-destructive">{error.priceInCents}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" required />
      </div>        
      {error.description && <div className="text-sm opacity-75 text-destructive">{error.description}</div>}

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required />
      </div>        
      {error.file && <div className="text-sm opacity-75 text-destructive">{error.file}</div>}

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required />
      </div>        
      {error.image && <div className="text-sm opacity-75 text-destructive">{error.image}</div>}

      <SubmitButton />
    </form>
)}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending} >{pending ? "Saving..." : "Save"}</Button>
}