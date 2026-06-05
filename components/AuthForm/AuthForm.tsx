"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearAuthError, signIn, signUp } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import styles from "./AuthForm.module.css";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { error, isHydrated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const isSignIn = mode === "signin";

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, mode]);

  useEffect(() => {
    if (!isHydrated || user === null) {
      return;
    }

    router.replace("/");
  }, [isHydrated, router, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSignIn) {
      const result = await dispatch(signIn({ email, password }));

      if (signIn.fulfilled.match(result)) {
        router.push("/");
      }

      return;
    }

    const result = await dispatch(signUp({ email, password, username }));

    if (signUp.fulfilled.match(result)) {
      router.push("/signin");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Image
          src="/img/logo_modal.png"
          alt="Skypro Music"
          width={140}
          height={21}
          className={styles.logo}
          priority
        />

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isSignIn ? (
            <input
              className={styles.input}
              type="text"
              name="username"
              placeholder="Имя"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          ) : null}

          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Почта"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="Пароль"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submit} type="submit" disabled={isLoading}>
            {isLoading
              ? "Подождите..."
              : isSignIn
                ? "Войти"
                : "Зарегистрироваться"}
          </button>
        </form>

        <div className={styles.footer}>
          <span className={styles.footerText}>
            {isSignIn ? "Нет аккаунта?" : "Уже есть аккаунт?"}
          </span>
          <Link
            href={isSignIn ? "/signup" : "/signin"}
            className={styles.footerLink}
          >
            {isSignIn ? "Зарегистрироваться" : "Войти"}
          </Link>
        </div>
      </div>
    </div>
  );
}
