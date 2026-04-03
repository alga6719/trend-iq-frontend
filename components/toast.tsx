"use client";

import { toast as sonnerToast } from "sonner";

export function toast({
  type,
  description,
}: {
  type: "success" | "error";
  description: string;
}) {
  if (type === "success") {
    sonnerToast.success(description);
  } else {
    sonnerToast.error(description);
  }
}
