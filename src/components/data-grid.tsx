"use client"
import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { formatDateRange } from "@/lib/utils"
import {
  ArrowUp,
  PiggyBank,
  PiggyBankIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { DataCard, DataCardLoading } from "./data-card"

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary()

  const params = useSearchParams()
  const from = params.get("from") || ""
  const to = params.get("to") || ""

  const dateRangeLabel = formatDateRange({ to, from })
  if (isLoading)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={PiggyBankIcon}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={TrendingUp}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={TrendingDown}
        variant="default"
        dateRange={dateRangeLabel}
      />
    </div>
  )
}
