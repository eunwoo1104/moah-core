"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferType } from "yup";

import { RHFInput } from "@/components/form/RHFInput";
import { sha256encrypt } from "@/utils/encryption/sha256";
import { icons } from "@/utils/icons";
import { codes } from "@/utils/response";
import type { MoahResponse } from "@/utils/response";
import { clientUserRegistrationSchema } from "@/utils/validation";

export default function Register() {
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: yupResolver(clientUserRegistrationSchema),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<
    InferType<typeof clientUserRegistrationSchema>
  > = async (data) => {
    setSubmitDisabled(true);

    const encryptedPassword = await sha256encrypt(data.password);
    const requestBody = {
      email: data.email,
      password: encryptedPassword,
      username: data.username,
      nickname: data.nickname,
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
      <form
        className="space-y-2"
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
          autoComplete="new-password"
          icon={icons.password}
        />
        <RHFInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          errors={errors}
          required={true}
          placeholder="password"
          icon={icons.password}
        />
        <RHFInput
          label="Username"
          name="username"
          type="text"
          register={register}
          errors={errors}
          required={true}
          placeholder="displays as @example"
          icon={icons.user}
        />
        <RHFInput
          label="Display Name (Nickname)"
          name="nickname"
          type="text"
          register={register}
          errors={errors}
          required={false}
          placeholder="nickname (optional)"
          icon={icons.nick}
        />
        {/* TODO: add ToS and Privacy Policy confirm */}
        <input
          className="clickable bg-neutral-200 dark:bg-neutral-800 rounded-lg w-full py-3 mt-5"
          type="submit"
          value="Register"
          disabled={submitDisabled}
        />
      </form>
    </div>
  );
}
