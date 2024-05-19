import { z } from "zod"
import { insertAccountSchema } from "@/db/schema"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { AccountForm } from "@/features/accounts/components/account-form"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account"
import { useGetAccount } from "@/features/accounts/api/use-get-account"
import { Loader2 } from "lucide-react"
import { useEditAccount } from "../api/use-edit-account"
import { useDeleteAccount } from "../api/use-delete-account"
import { useConfirm } from "../../../../hooks/use-confirm"

const formSchema = insertAccountSchema.pick({
  name: true,
})

type FormValues = z.input<typeof formSchema>

export const EditAccountSheet = () => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this account"
  )
  const { isOpen, onClose, id } = useOpenAccount()

  const accountQuery = useGetAccount(id)
  const editMutation = useEditAccount(id)
  const deleteMutation = useDeleteAccount(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = accountQuery.isLoading

  const onSubmit = (values: FormValues) => {

    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: "" }

  const onDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose()
        },

      })
    }
  }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit account {defaultValues.name}</SheetTitle>
            <SheetDescription>
              Edit account to track your account.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
