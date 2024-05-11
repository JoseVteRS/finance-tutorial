"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { Loader2, Plus } from "lucide-react"

import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { Skeleton } from "@/components/ui/skeleton"
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete"

export default function TransactionsPage() {
  const accountsQuery = useGetAccounts()
  const deleteAccounts = useBulkDeleteAccounts()
  const newTransaction = useNewTransaction()

  const accounts = accountsQuery.data || []

  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending

  if (accountsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>
          <Button onClick={newTransaction.onOpen}>
            <Plus className="size-4 mr-2" /> Add new transaction
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={accounts}
            filterKey="email"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteAccounts.mutate({ ids })
            }}
            disabled={isDisabled}
          ></DataTable>
        </CardContent>
      </Card>
    </div>
  )
}
