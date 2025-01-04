export function getSystemTheme(): "dark" | "light" {
  // Check if the `window` and `matchMedia` APIs are available
  if (typeof window !== "undefined" && window.matchMedia) {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return darkModeQuery.matches ? "dark" : "light";
  }

  // Default fallback if the system theme can't be determined
  return "light";
}

export function isDarkTheme(): boolean {
  return getSystemTheme() === "dark";
}
