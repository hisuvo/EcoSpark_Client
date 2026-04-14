import { getUserInfo } from "@/services/auth.service";

const CreateIdeaPage = async () => {
  const user = await getUserInfo();
  return <div>this create idea page</div>;
};

export default CreateIdeaPage;
