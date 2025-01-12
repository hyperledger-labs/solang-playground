import { AlertTriangle } from "lucide-react";

function Footer() {
  return (
    <div className="h-[26px] bg-[#35576e] text-[10.5px] text-white flex items-center">
      <div className="flex gap-1 bg-[#c97539] items-center px-2 h-full">
        <AlertTriangle size={13} />
        <span className="mt-0.5">Scam Alert</span>
      </div>
      <div className="flex-1 text-center ">
        <span>
          Did you know? To prototype on a uniswap v4 hooks, you can create a Multi Sig Swap Hook workspace. Template
          created by the cookbook team.
        </span>
      </div>
    </div>
  );
}

export default Footer;