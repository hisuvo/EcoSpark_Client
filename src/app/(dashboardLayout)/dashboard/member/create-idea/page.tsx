import { getUserInfo } from "@/services/auth.service";
import React from "react";

const CreateIdeaPage = async () => {
  const user = await getUserInfo();
  console.log("user information ->", user);
  return <div>this create idea page</div>;
};

export default CreateIdeaPage;
