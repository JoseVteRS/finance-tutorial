"use client"
import { useState } from "react"
import { transactions as transactionsSchema } from "@/db/schema"
import { Loader2, Plus } from "lucide-react"

import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions"
import { UploadButton } from "./upload-button"
import { ImportCard } from "./import-card"
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account"
import { toast } from "sonner"
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions"

enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
}

export default function TransactionsPage() {
  const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setImportResults] = useState<
    typeof INITIAL_IMPORT_RESULTS
  >(INITIAL_IMPORT_RESULTS)

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    console.log(results)
    setImportResults(results)
    setVariant(VARIANTS.IMPORT)
  }

  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS)
    setVariant(VARIANTS.LIST)
  }

  const newTransaction = useNewTransaction()
  const transationBulCrate = useBulkCreateTransactions()
  const transactionsBulkDelete = useBulkDeleteTransactions()
  const transactionsQuery = useGetTransactions()

  const transactions = transactionsQuery.data || []

  const isDisabled =
    transactionsQuery.isLoading || transactionsBulkDelete.isPending

  const onSubmitImport = async (
    values: (typeof transactionsSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm()
    if (!accountId) {
      toast.error("Please select an account to continue")
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }))

    transationBulCrate.mutate(data, {
      onSuccess: ()=> {
        onCancelImport()
      }
    })


  }

  if (transactionsQuery.isLoading) {
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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="flex items-center gap-x-2">
            <Button
              onClick={newTransaction.onOpen}
              size="sm"
              className="w-full"
            >
              <Plus className="size-4 mr-2" /> Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              transactionsBulkDelete.mutate({ ids })
            }}
            disabled={isDisabled}
          ></DataTable>
        </CardContent>
      </Card>
    </div>
  )
}
