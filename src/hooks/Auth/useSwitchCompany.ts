import { useNavigate } from "react-router-dom";
import { useHrSwitchCompanyMutation } from "@/rtk/Auth/AuthApi";

export const useSwitchCompany = () => {
  const navigate = useNavigate();

  const [switchCompany, { isLoading, error }] = useHrSwitchCompanyMutation();

  const saveLoginData = (res: any) => {
    localStorage.setItem("token", res.token);

    localStorage.setItem("user", JSON.stringify(res.data));

    localStorage.setItem("company", res.data.companyId);

    localStorage.setItem(
      "location",
      JSON.stringify(res.data.groupId?.locationId || null),
    );

    localStorage.setItem("group", JSON.stringify(res.data.groupId || null));
  };

  const handleSwitchCompany = async (staffId: string, companyId: string) => {
    try {
      const res = await switchCompany({
        staffId,
        companyId,
      }).unwrap();

      if (res.token && res.data) {
        saveLoginData(res);

        navigate("/");
      }

      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    handleSwitchCompany,
    isLoading,
    error,
  };
};
