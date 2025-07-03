import LoginForm from "@/components/auth/LoginForm"
import { currentProfile } from "@/lib/current-profile"

const LoginPage = async () => {
  const profile = await currentProfile();
  console.log(profile)
  return (
    <LoginForm/>
  )
}

export default LoginPage