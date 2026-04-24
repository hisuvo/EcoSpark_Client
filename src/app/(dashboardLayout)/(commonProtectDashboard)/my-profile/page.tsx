import { getUserInfo } from "@/services/auth.service";
import Profile from "@/shared/Profile";

const MyProfilePage = async () => {
  const userProfile = await getUserInfo();

  if (!userProfile) {
    return null;
  }

  return (
    <div>
      <Profile user={userProfile} />
    </div>
  );
};

export default MyProfilePage;
