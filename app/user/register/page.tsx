"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { sha256encrypt } from "@/utils/encryption/sha256";
import { codes } from "@/utils/response";
import type { MoahResponse } from "@/utils/response";
import { icons } from "@/utils/icons";
import { clientRegistrationSchema } from "@/utils/validation";
import { ValidationError } from "yup";

export default function Register() {
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitDisabled(true);

    let validated;
    try {
      validated = await clientRegistrationSchema.validate({
        email: e.target.email.value,
        password: e.target.password.value,
        username: e.target.username.value,
        nickname: e.target.nickname.value,
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        // TODO: validation ui action
        alert(e.message);
      } else {
        alert(
          "Error while validating data. Please refresh the page and retry.",
        );
      }
      setSubmitDisabled(false);
      return;
    }
    if (validated.password !== e.target.confirmPassword.value) return;

    const encryptedPassword = await sha256encrypt(e.target.password.value);
    const requestBody = {
      email: validated.email,
      password: encryptedPassword,
      username: validated.username,
      nickname: validated.nickname,
    };

    const res = await fetch("/api/v1/user/register", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    const response: MoahResponse = await res.json();
    if (response.code == codes.ok) {
      // TODO: show success message & open login menu
      router.push("/");
    } else {
      // TODO: show error message better
      alert(response.msg);
      setSubmitDisabled(false);
    }
  };

  return (
    <div className="w-full md:px-20 lg:px-44 xl:px-52 2xl:px-64">
      <h1 className="text-left font-bold text-3xl pt-8 pb-1">
        Register to MoAh
      </h1>
      <p className="font-light text-neutral-400 pb-4">
        Need help? Contact service manager.
      </p>
      <form className="space-y-2" onSubmit={onSubmit} noValidate={true}>
        <label>
          <div className="flex flex-row items-center space-x-0.5">
            <div>{icons.email}</div>
            <p>
              Email <span className="text-red-400">*</span>
            </p>
          </div>
          <input
            name="email"
            type="email"
            placeholder="user@example.com"
            autoComplete="email"
            required={true}
          />
        </label>
        <label>
          <div className="flex flex-row items-center space-x-0.5">
            <div>{icons.password}</div>
            <p>
              Password <span className="text-red-400">*</span>
            </p>
          </div>
          <input
            name="password"
            type="password"
            placeholder="password"
            autoComplete="new-password"
            required={true}
          />
        </label>
        <label>
          <div className="flex flex-row items-center space-x-0.5">
            <div>{icons.password}</div>
            <p>
              Confirm Password <span className="text-red-400">*</span>
            </p>
          </div>
          <input
            name="confirmPassword"
            type="password"
            placeholder="password"
            required={true}
          />
        </label>
        <label>
          <div className="flex flex-row items-center space-x-0.5">
            <div>{icons.user}</div>
            <p>
              Username <span className="text-red-400">*</span>
            </p>
          </div>
          <input
            name="username"
            type="text"
            placeholder="@example"
            required={true}
          />
        </label>
        <label>
          <div className="flex flex-row items-center space-x-0.5">
            <div>{icons.nick}</div>
            <p>Display Name (Nickname)</p>
          </div>
          <input
            name="nickname"
            type="text"
            placeholder="nickname (optional)"
          />
        </label>
        {/* TODO: add ToS and Privacy Policy confirm */}
        <input
          className="clickable bg-neutral-200 dark:bg-neutral-800 rounded-lg w-full py-3"
          type="submit"
          value="Register"
          disabled={submitDisabled}
        />
      </form>
    </div>
  );
}
