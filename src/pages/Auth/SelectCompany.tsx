import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useSwitchCompany } from "@/hooks/Auth/useSwitchCompany";

const SelectCompany = () => {
  const location = useLocation();

  const companies = location.state?.companies || [];

  const { handleSwitchCompany, isLoading, error } = useSwitchCompany();

  const handleSelect = async (staffId: string, companyId: string) => {
    await handleSwitchCompany(staffId, companyId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Select Company
            </h1>

            <p className="text-sm text-slate-500 mt-2">
              Choose the company you want to access
            </p>
          </div>

          <div className="space-y-4">
            {companies.length === 0 && (
              <p className="text-center text-sm text-red-500">
                No companies found
              </p>
            )}

            {companies.map((company: any) => (
              <button
                key={company.companyId}
                onClick={() => handleSelect(company.staffId, company.companyId)}
                disabled={isLoading}
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-4
                  hover:border-blue-500
                  hover:bg-blue-50
                  transition
                "
              >
                <div
                  className="
                  h-12
                  w-12
                  rounded-xl
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
                >
                  {company.companyLogo ? (
                    <img
                      src={company.companyLogo}
                      alt={company.companyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-slate-500">
                      {company.companyName?.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="text-left flex-1">
                  <h2 className="font-semibold text-slate-900">
                    {company.companyName}
                  </h2>

                  <p className="text-xs text-slate-500">Select this company</p>
                </div>

                <Button type="button" className="rounded-xl">
                  Enter
                </Button>
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">
              Something went wrong. Please try again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectCompany;
