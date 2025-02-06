import { useWeb3 } from "./context";

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
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
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
