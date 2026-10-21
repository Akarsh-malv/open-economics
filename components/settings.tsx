"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type BooleanSettingKey,
  useSettingsStore,
} from "@/stores/settings-store";

const switchSettings: ReadonlyArray<{
  key: BooleanSettingKey;
  label: string;
  description: string;
}> = [
  {
    key: "desmosForceDarkMode",
    label: "Force Graph Dark Mode",
    description:
      "Force all Desmos graphs to dark mode when theme is set to dark.",
  },
  {
    key: "coloredMarkdown",
    label: "Colored Lesson Markup",
    description: "Apply custom colors to formulas and highlighted notation.",
  },
  {
    key: "largeMath",
    label: "Large Formulas",
    description: "Increase the font size of formulas in lesson content.",
  },
] as const;

export function Settings() {
  const {
    desmosForceDarkMode,
    coloredMarkdown,
    largeMath,
    toggle,
  } = useSettingsStore();

  const settings = { desmosForceDarkMode, coloredMarkdown, largeMath };
  return (
    <div className="space-y-6 py-2">
      {switchSettings.map(({ key, label, description }) => (
        <div key={key}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <Label
                htmlFor={key}
                className="text-base font-semibold cursor-pointer"
              >
                {label}
              </Label>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Switch
              id={key}
              checked={settings[key]}
              onCheckedChange={() => toggle(key)}
              className="mt-1"
            />
          </div>
        </div>
      ))}

      <p className="text-sm text-muted-foreground">Typography: Manrope</p>
    </div>
  );
}
