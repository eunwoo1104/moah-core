import * as Yup from "yup";

export const userRegistrationSchema = Yup.object({
  email: Yup.string()
    .email()
    .max(128, "Email too long.")
    .required("Missing email."),
  password: Yup.string()
    .required("Missing password.")
    .length(64, "Invalid password encyption."),
  username: Yup.string().required("Missing username."),
  nickname: Yup.string().optional(),
});

export const clientUserRegistrationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .max(128, "Email is too long.")
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Password must be minimal 8 characters long.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords don't match")
    .required("Confirm Password is required"),
  username: Yup.string().required("Username is required."),
  nickname: Yup.string().optional(),
});
