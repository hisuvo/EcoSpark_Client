import LoginForm from "@/components/module/Auth/LoginForm";

interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginParams) => {
  const param = await searchParams;
  const redirectpath = param.redirect;

  return <LoginForm redirectpath={redirectpath} />;
};

export default LoginPage;
