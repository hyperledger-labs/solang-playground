import GoogleBackup from "./components/GoogleBackup";
import Preferences from "./components/Preferences";
import ThemeSwitcher from "./components/ThemeSwitcher";

function Settings() {
  return (
    <div className="px-3">
      <h2 className="text-base uppercase">Settings</h2>
      <div className="mt-10 grid gap-5 text-xs">
        <ThemeSwitcher />
        <Preferences />
        <GoogleBackup />
      </div>
    </div>
  );
}

export default Settings;
