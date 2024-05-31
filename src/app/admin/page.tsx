import { Nav } from "@/components/Nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  // get total amount of sales and total price by using Prisma's .aggregate() method.
  // it provides different methods within it to perform various calculations, like sum and count.
  // for sum, we only want to sum the orders where pricePaidInCents exists.
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  })

  return {
    // we access the value of the sum of pricePaidInCents and format it for currency.
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count
  }
}

async function getUserData() {
  // This is in-efficient so we can consolidate it in a Promise.all()
  // const userCount = await db.user.count()
  // const orderData = await db.order.aggregate({
  //   _sum: { pricePaidInCents: true }
  // })
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({_sum: { pricePaidInCents: true }})
  ])

  return {userCount, averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100}
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true }}),
    db.product.count({ where: { isAvailableForPurchase: false }})
  ])

  return {activeCount, inactiveCount}
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData()
  ])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="Sales" subtitle={`${formatNumber(salesData.numberOfSales)} orders`} body={formatCurrency(salesData.amount)}></DashboardCard>
      <DashboardCard title="Customer" subtitle={`${formatNumber(userData.averageValuePerUser)} average value`} body={formatCurrency(userData.userCount)}></DashboardCard>
      <DashboardCard title="Active Products" subtitle={`${formatNumber(productData.inactiveCount)} inactive`} body={`${formatNumber(productData.activeCount)} active`}></DashboardCard>
    </div>
  )
}

// I could copy and paste this component however many times I need or I could do this
type DashboardCardProps = {
  title: string,
  subtitle: string,
  body: string
}

function DashboardCard({title, subtitle, body}: DashboardCardProps) {
  return (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{body}</p>
    </CardContent>
  </Card>
)}