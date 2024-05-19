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
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { AccountForm } from "@/features/accounts/components/account-form"
import { useCreateAccount } from "../api/use-create-account"

const formSchema = insertAccountSchema.pick({
  name: true,
})

type FormValues = z.input<typeof formSchema>

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount()
  const mutation = useCreateAccount()

  const onSubmit = (values: FormValues) => {
  
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger>crear</SheetTrigger> */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New account</SheetTitle>
          <SheetDescription>
            Create new account to track your accounts.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  )
}
