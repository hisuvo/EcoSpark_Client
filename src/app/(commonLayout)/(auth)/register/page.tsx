import RegisterForm from "@/components/module/Auth/RegisterForm";

interface RegisterParams {
  searchParams: Promise<{ redirect?: string }>;
}

const RegisterPage = async ({ searchParams }: RegisterParams) => {
  const param = await searchParams;
  const redirectpath = param.redirect;

  return <RegisterForm redirectpath={redirectpath} />;
};

export default RegisterPage;
