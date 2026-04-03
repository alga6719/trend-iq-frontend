"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="font-medium text-zinc-600 dark:text-zinc-400"
        >
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="font-medium text-zinc-600 dark:text-zinc-400"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          type="password"
          required
        />
      </div>

      {children}
    </form>
  );
}
