import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Link from "next/link";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { CheckCircle2, MoreVertical, XCircle, XCircleIcon } from "lucide-react";

export default function AdminProductsPage() {
  return <>
    <div className="flex justify-between items-center gap-4">
      <PageHeader>Products</PageHeader>
      {/* 'asChild' will prevent this from rendering as 2 buttons */}
      <Button asChild>
        <Link href="/admin/products/new">Add Product</Link>
      </Button>
    </div>
    <ProductsTable />
  </>
}

async function getProductData() {
  const products = await db.product.findMany({
    select: {
      id: true, 
      name: true, 
      priceInCents: true, 
      isAvailableForPurchase: true, 
      _count: {select: {orders: true}}
    },
    orderBy: {name: "asc"}
  })

  if (products.length === 0) return false

  return products
}

async function ProductsTable() {
  
  const products = await getProductData()

  if (!products) return <p>No Products Found</p>

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">
              {product.isAvailableForPurchase ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <XCircle />
                </>
              )}
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
            <TableCell className="text-right">{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
              <MoreVertical />
              <span className="sr-only">Actions</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}