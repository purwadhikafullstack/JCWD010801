import { ForgotPasswordView } from "../views/Forgot"
import { AuthLayout } from "../components/authLayout"

export const ForgotPasswordPage = () => {
    return (
        <AuthLayout component={(<ForgotPasswordView />)} />
    )
}