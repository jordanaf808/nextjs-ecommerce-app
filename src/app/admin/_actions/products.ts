"use server"

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";

const fileSchema = z.instanceof(File, {message: "Required"});
// if no image file submitted don't do check, otherwise check that it's type starts with "image/"
const imageSchema = fileSchema.refine(file => file.size === 0 || file.type.startsWith("image/"))

// for this form in particular, we check the file size down here, because it's required when adding a product, but if we're just editing a product, we don't need to require a file upload.
const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine(file => file.size > 0, "Required"),
  image: imageSchema.refine(image => image.size > 0, "Required")
})

// add prevState prop, so we can use this action in the useFormState hook. set it to unknown because we don't care right now.
export async function addProduct(prevState: unknown, formData: FormData) {
  // convert formData into an object, then use our zod schema to parse this data to check if it's valid or not.
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  console.log(formData);
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  // set recursive to true if we're creating multiple files
  await fs.mkdir("products", {recursive: true})
  // create unique filename and place in products file directory
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`
  // convert file to a buffer that node.js knows how to save.
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()))

  await fs.mkdir("public/products", {recursive: true})
  const imagePath = `products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(`public/${imagePath}`, Buffer.from(await data.image.arrayBuffer()))

  // add product to database
  await db.product.create({ 
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    }, 
  })

  // after creating product
  redirect("/admin/products")
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({where: {id}, data: {isAvailableForPurchase}})
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({where: {id}})
  if (product === null) return notFound()

  await fs.unlink(product.filePath)
  await fs.unlink(`public/${product.imagePath}`)
}