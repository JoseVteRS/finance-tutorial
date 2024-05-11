"use client"

import { useMountedState } from "react-use"
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"
import { NewCategoySheet } from "@/features/categories/components/new-category-sheet"
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"
import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet"

const SheetProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) null
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
      <NewCategoySheet />
      <EditCategorySheet />
      <NewTransactionSheet />
    </>
  )
}

export default SheetProvider
