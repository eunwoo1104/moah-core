import * as Yup from "yup";

export const userRegistrationSchema = Yup.object({
  email: Yup.string().email().max(128).required("Missing email."),
  password: Yup.string()
    .required("Missing password.")
    .length(64, "Invalid password encyption."),
  username: Yup.string().required("Missing username."),
  nickname: Yup.string().optional(),
});
