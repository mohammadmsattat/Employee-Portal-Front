import i18n from "@/i18n";
import { useEffect } from "react";

const RTLWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const updateDirection = () => {
      const lng = i18n.language;

      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lng;

      document.body.classList.toggle("rtl", lng === "ar");
    };

    updateDirection();

    i18n.on("languageChanged", updateDirection);

    return () => {
      i18n.off("languageChanged", updateDirection);
    };
  }, []);

  return <>{children}</>;
};

export default RTLWrapper;