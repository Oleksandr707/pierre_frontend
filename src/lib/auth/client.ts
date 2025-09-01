'use client';

import type { User } from '@/types/user';

export interface SignInWithPasswordParams {
  userId: string;   // backend expects userId
  password: string;
}

class AuthClient {
  async signInWithPassword(params: { userId: string; password: string }): Promise<{ error?: string; user?: User }> {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Login failed" };
      }

      // Save JWT token
      localStorage.setItem("custom-auth-token", data.token);
      localStorage.setItem("current-user-id", data.admin.id);

      // ✅ Fix: return the user using "data.admin" not "data.user"
      return { user: { id: data.admin.id, email: data.admin.userId } as User };

    } catch (err: any) {
      console.error("Login error:", err);
      return { error: "Network error, please try again" };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem("custom-auth-token");
    return {};
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const token = localStorage.getItem("custom-auth-token");

    if (!token) {
      return { data: null };
    }

    // You could call /api/auth/me later to verify token
    return { data: { id: "LOCAL", email: "admin" } as User };
  }
}


export const authClient = new AuthClient();
