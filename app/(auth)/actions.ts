"use server";

import { z } from "zod";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "success" | "failed" | "invalid_data";
}

export async function login(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const validatedData = authFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedData.success) {
      return { status: "invalid_data" };
    }

    // TODO: Implement actual authentication logic
    // For now, simulate a successful login for demo purposes
    const { email, password } = validatedData.data;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo: Accept any valid email/password combination
    if (email && password) {
      return { status: "success" };
    }

    return { status: "failed" };
  } catch (error) {
    console.error("Login error:", error);
    return { status: "failed" };
  }
}

export async function register(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const validatedData = authFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedData.success) {
      return { status: "invalid_data" };
    }

    // TODO: Implement actual registration logic
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { status: "success" };
  } catch (error) {
    console.error("Registration error:", error);
    return { status: "failed" };
  }
}
