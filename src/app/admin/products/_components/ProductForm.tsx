"use client"
// we are building are own form, but @shadcn-ui provides a very robust form of their own built with React Hook Form and Zod, and packaged with several form components so you don't have to install each one separately.
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/formatters"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { addProduct, updateProduct } from "../../_actions/products"
import { useFormState, useFormStatus } from "react-dom"
import { Product } from "@prisma/client"
import Image from "next/image"

// form to set price
// optional `product?` prop with same type as the one we set in the Prisma Schema
// this will cause errors from components that use this, because it doesn't account for product being Null, so let's add that type.
export function ProductForm({product}: {product?: Product | null}) {
  // When using this hook your Form Action needs 2 props, prevState and currState
  // now that we are using this same form for the edit page, but a different action, we need to handle that depending on which page we're on.
  // this produces a type error when used in useFormState(), because updateProduct requires one more prop, `id`, than addProduct, so we bind `product.id` to it.
  const formHandler = product == null ? addProduct : updateProduct.bind(null, product.id)
  const [error, action] = useFormState(formHandler, {})
  // by setting the input type to number we don't have to set a default value.
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents)

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" required defaultValue={product?.name || ""}/>
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
        <Textarea id="description" name="description" required defaultValue={product?.description || ""}/>
      </div>        
      {error.description && <div className="text-sm opacity-75 text-destructive">{error.description}</div>}

      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        {/* If were don't have access to the product, then the file or image doesn't exist, and we need to require it */}
        <Input type="file" id="file" name="file" required={product == null} />        
        {product != null && <div className="text-muted-foreground">{product.filePath}</div>}
        {error.file && <div className="text-sm opacity-75 text-destructive">{error.file}</div>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} /> 
        {product != null && 
        <Image height="400" width="400" src={`/${product.imagePath}`} alt="product image" />}
        {error.image && <div className="text-sm opacity-75 text-destructive">{error.image}</div>}
      </div>

      <SubmitButton />
    </form>
)}

function SubmitButton() {
  const { pending } = useFormStatus()
  return <Button type="submit" disabled={pending} >{pending ? "Saving..." : "Save"}</Button>
}