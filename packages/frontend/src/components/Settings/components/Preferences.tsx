import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { store } from "@/state";
import { useSelector } from "@xstate/store/react";

function Preferences() {
  const {autoFormat,autoSave,fontSize} = useSelector(store, (state) => state.context.preferences);

  return (
    <div className="">
      <h3 className="text-base text-primary flex justify-between items-center">Preferences</h3>
      <div className="mt-3 grid gap-1">
        <div className="flex justify-between items-center">
          <h3 className="text-base">Font Size</h3>
          <Input
            className="w-16 h-7 border-none"
            value={fontSize}
            type="number"
            placeholder="Font Size"
            max={90}
            onChange={(e) => store.send({ type: "changeFontSize", fontSize: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-base">Auto Save</h3>
          <Checkbox checked={autoSave} />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-base">Auto Format</h3>
          <Checkbox checked={autoFormat} />
        </div>
      </div>
    </div>
  );
}

export default Preferences;
