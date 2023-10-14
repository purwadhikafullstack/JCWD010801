import { ForgotPasswordView } from "../views/Forgot"
import { AuthLayout } from "../components/authLayout"

const ForgotPasswordPage = () => {
    return (
        <AuthLayout component={(<ForgotPasswordView />)} />
    )
}

export default ForgotPasswordPage