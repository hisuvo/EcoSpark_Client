import { getUserInfo } from "@/services/auth.service";
import Profile from "@/shared/Profile";

const MyProfilePage = async () => {
  const userProfile = await getUserInfo();

  return (
    <div>
      <Profile user={userProfile} />
    </div>
  );
};

export default MyProfilePage;
