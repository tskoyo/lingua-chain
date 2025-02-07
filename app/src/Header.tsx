import { useWeb3 } from "./context";
import { useMemo, HTMLAttributes } from "react";
import { minidenticon } from "minidenticons";

type MinidenticonP = { username: string } & HTMLAttributes<HTMLImageElement>;

export const Avatar = ({ username }: MinidenticonP) => {
  const svg = useMemo(() => minidenticon(username), [username]);

  return (
    <img
      className="bg-gray-900 w-10 h-10 rounded-full"
      src={"data:image/svg+xml;utf8," + svg}
      alt="avatar"
    />
  );
};

const Header = () => {
  const { account, connectWallet, tokens } = useWeb3();
  const truncatedAddress = account
    ? account.slice(0, 5) + ".." + account.slice(-3)
    : "";

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gray-900 border-b border-gray-500 shadow-2xl">
      <div className="flex gap-4 text-white text-xl font-bold">
        lingua-chain
      </div>
      {account ? (
        <div className="flex gap-4 items-center">
          <span>Balance: {tokens}</span>
          <div className="bg-gray-700 flex items-center gap-4 rounded-full p-1">
            <Avatar username={account} />
            <span className="text-white mr-4">{truncatedAddress}</span>
          </div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="text-white border border-white px-4 py-2 rounded hover:bg-white hover:text-gray-900 transition"
        >
          connect
        </button>
      )}
    </header>
  );
};

export default Header;
