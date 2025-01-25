import React, { useEffect, useState } from "react";
import Image from "next/image";

interface LightDarkIconProps {
  lightIconPath: string;
  darkIconPath: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const LightDarkIcon: React.FC<LightDarkIconProps> = ({
  lightIconPath,
  darkIconPath,
  alt,
  width = 200,
  height = 200,
  className = "w-full h-full",
}) => {
  const [iconPath, setIconPath] = useState<string>("");

  useEffect(() => {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIconPath(isDarkMode ? darkIconPath : lightIconPath);

    const listener = (event: MediaQueryListEvent) => {
      setIconPath(event.matches ? darkIconPath : lightIconPath);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", listener);

    return () => mediaQuery.removeEventListener("change", listener);
  }, [lightIconPath, darkIconPath]);

  if (!iconPath) return null;

  return (
    <Image
      src={iconPath}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default LightDarkIcon;
