"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType } from "yup";

import { MessageBox } from "@/components/MessageBox";
import { RHFInput } from "@/components/form/RHFInput";
import { SessionContext } from "@/utils/contexts";
import { sha256encrypt } from "@/utils/encryption/sha256";
import { icons } from "@/utils/icons";
import { MoahResponse, codes } from "@/utils/response";
import { PartialUser } from "@/utils/types";
import { clientUserLoginSchema } from "@/utils/validation";

import { HeaderArea } from "./HeaderArea";

export function LoginArea() {
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const sessionCtx = useContext(SessionContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(clientUserLoginSchema),
  });

  const onSubmit: SubmitHandler<
    InferType<typeof clientUserLoginSchema>
  > = async (data) => {
    setSubmitDisabled(true);

    const encryptedPassword = await sha256encrypt(data.password);

    const res = await fetch("/api/v1/user/login", {
      method: "POST",
      body: JSON.stringify({ email: data.email, password: encryptedPassword }),
    });
    const response: MoahResponse<PartialUser> = await res.json();
    if (response.code == codes.ok) {
      if (!sessionCtx) return; // This should not happen
      if (!response.content) return; // This also should not happen
      // TODO: ...but I should set handling for these though

      sessionCtx.setUser(response.content);
    } else {
      setErrorMsg(response.msg as string);
      setSubmitDisabled(false);
    }
  };

  return (
    <HeaderArea className="md:w-96">
      <form
        className="space-y-1"
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
      >
        <RHFInput
          label="Email"
          name="email"
          type="email"
          register={register}
          errors={errors}
          required={true}
          placeholder="user@example.com"
          autoComplete="email"
          icon={icons.email}
        />
        <RHFInput
          label="Password"
          name="password"
          type="password"
          register={register}
          errors={errors}
          required={true}
          placeholder="password"
          autoComplete="current-password"
          icon={icons.password}
        />
        {errorMsg && (
          <MessageBox
            className="clickable mt-2"
            type="error"
            title={errorMsg}
            onClick={() => setErrorMsg(null)}
          />
        )}
        <div className="flex flex-col-reverse md:flex-row items-center mt-2 space-x-0 md:space-x-2 space-y-1 md:space-y-0">
          <div className="flex flex-row items-center space-x-2 text-neutral-400">
            <button className="clickable">Reset Password</button>
          </div>
          <div className="md:flex-1" />
          <Link
            href="/user/register"
            className="clickable bg-neutral-100 dark:bg-neutral-800 rounded-lg py-1 w-full md:w-20 text-center"
          >
            Register
          </Link>
          <input
            className="clickable bg-neutral-100 dark:bg-neutral-800 rounded-lg py-1 w-full md:w-20 mb-2 md:mb-0"
            type="submit"
            value="Login"
            disabled={submitDisabled}
          />
        </div>
      </form>
    </HeaderArea>
  );
}
