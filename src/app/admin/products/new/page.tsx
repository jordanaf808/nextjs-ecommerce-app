import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../_components/ProductForm";

// route to add new product
export default function NewProductPage() {
  return <>
    <PageHeader>Add Product</PageHeader>
    <ProductForm />
  </>
}