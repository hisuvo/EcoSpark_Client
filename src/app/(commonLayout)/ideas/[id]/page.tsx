import IdeaDetails from "@/components/module/idea/IdeaDetails";
import { getUserInfo } from "@/services/auth.service";

const IdeaDetailPage = async () => {
  const userInfo = await getUserInfo();

  return (
    <div>
      <IdeaDetails user={userInfo} />
    </div>
  );
};

export default IdeaDetailPage;
