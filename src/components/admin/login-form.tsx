"use client";

import { LockKey, SignIn as SignInIcon } from "@phosphor-icons/react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signIn, type LoginFormState } from "@/features/auth/actions";

const initialState: LoginFormState = {};

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button className="button button-primary submit-button" type="submit" disabled={pending}>
      <SignInIcon size={20} weight="bold" aria-hidden="true" />
      {pending ? "Đang đăng nhập..." : "Đăng nhập Admin"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(signIn, initialState);

  return (
    <form className="login-form" action={formAction}>
      <span className="login-icon" aria-hidden="true">
        <LockKey size={28} weight="duotone" />
      </span>

      {state.error && (
        <div className="inline-alert" role="alert">
          {state.error}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="email">Email admin</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="password">Mật khẩu</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      <LoginButton />
    </form>
  );
}
