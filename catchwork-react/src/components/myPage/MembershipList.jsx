import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import MembershipItem from "./MembershipItem";

function MembershipList({ handleCheckout }) {
  const [membershipList, setMembershipList] = useState("");

  const getMembershipList = async () => {
    try {
      const resp = await axiosApi.get("/membership/getMembershipList");

      if (resp.status === 200) {
        setMembershipList(resp.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMembershipList();
  }, []);

  return (
    <>
      {membershipList &&
        membershipList.map((membership) => (
          <MembershipItem
            key={membership.memGrade}
            membership={membership}
            handleCheckout={() => handleCheckout(membership.memGrade)}
          />
        ))}
    </>
  );
}

export default MembershipList;
