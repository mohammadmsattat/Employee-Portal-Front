import { TFunction } from "i18next";

const InfoRow = ({
  t,
  userName,
}: {
  t: TFunction;
  userName?: string | number;
}) => (
  <div>
    <h1 className="text-2xl font-bold text-portal-header">
      {t("homePage.welcome")}, {userName}!
    </h1>
    <p className="text-muted-foreground mt-1">{t("homePage.overview")}</p>
  </div>
);

export default InfoRow;
