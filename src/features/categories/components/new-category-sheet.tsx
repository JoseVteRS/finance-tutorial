import { z } from "zod"
import { insertCategorySchema } from "@/db/schema"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { useCreateCategory } from "@/features/categories/api/use-create-category"
import { useNewCategory } from "@/features/categories/hooks/use-new-category"
import { CategoryForm } from "@/features/categories/components/category-form"

const formSchema = insertCategorySchema.pick({
  name: true,
})

type FormValues = z.input<typeof formSchema>

export const NewCategoySheet = () => {
  const { isOpen, onClose } = useNewCategory()
  const mutation = useCreateCategory()

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
          <SheetTitle>New category</SheetTitle>
          <SheetDescription>
            Create new category to track your categories.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  )
}
