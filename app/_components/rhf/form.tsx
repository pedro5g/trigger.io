import type { ReactNode } from "react";
import {
  FormProvider,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

interface FormProps<T extends FieldValues> extends UseFormReturn<T, any, T> {
  children: ReactNode;
}

export function Form<T extends FieldValues>({
  children,
  ...methods
}: FormProps<T>) {
  return <FormProvider {...methods}>{children}</FormProvider>;
}
