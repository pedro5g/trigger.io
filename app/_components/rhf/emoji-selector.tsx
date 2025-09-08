"use client";

import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "../ui/emoji-picker";
import { cn } from "@/lib/utils";

interface EmojiPickerProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  name: Path<T>;
}

export const EmojiSelector = <T extends FieldValues>({
  className,
  name,
  readOnly,
}: EmojiPickerProps<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onBlur, onChange, ref, value } }) => {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                data-readonly={readOnly}
                size={"icon"}
                variant={"outline"}
                className={cn(
                  readOnly &&
                    "cursor-default data-[readonly=true]:disabled:opacity-100",
                  className,
                )}
                disabled={readOnly}
              >
                {!value ? <FaceIcon /> : value}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
              <EmojiPicker
                onBlur={onBlur}
                ref={ref}
                className="h-[342px]"
                defaultValue={value}
                onEmojiSelect={({ emoji }) => {
                  if (readOnly) return;
                  if (emoji === value) {
                    onChange("");
                  } else {
                    onChange(emoji);
                  }
                }}
              >
                <EmojiPickerSearch />
                <EmojiPickerContent />
                <EmojiPickerFooter />
              </EmojiPicker>
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
};

export const FaceIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Face</title>
      <path d="M5 3h14v2H5V3zm0 16H3V5h2v14zm14 0v2H5v-2h14zm0 0h2V5h-2v14zM10 8H8v2h2V8zm4 0h2v2h-2V8zm-5 6v-2H7v2h2zm6 0v2H9v-2h6zm0 0h2v-2h-2v2z" />
    </svg>
  );
};
