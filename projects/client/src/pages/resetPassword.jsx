import { ResetPasswordView } from "../views/Reset"
import { AuthLayout } from "../components/authLayout"

const ResetPasswordPage = () => {
    return (
        <>
        {/* <Image w={"full"} h={"100vh"} src={bgImage} position={"absolute"} /> */}
        <AuthLayout component={(<ResetPasswordView />)} />
        </>
    )
}

export default ResetPasswordPage