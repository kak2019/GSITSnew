// LanguageToggle.tsx
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Toggle } from "@fluentui/react";

const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, checked?: boolean): void => {
        // 切换语言到日文或英文
        i18n.changeLanguage(checked ? 'ja' : 'en').catch(() => {
            console.error("Failed to change language");
        });
    };

    return (
        <Toggle
            label=""
            onText="日本語"
            offText="English"
            onChange={handleToggleChange}
        />
    );
};

export default LanguageToggle;
