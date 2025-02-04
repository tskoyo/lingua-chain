import {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
  useCallback,
} from "react";
import { ethers } from "ethers";
import contractArtifact from "../../out/LCTGovernance.sol/LCTGovernance.json";

const daoAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

//
// import { useErrorBoundary } from "react-error-boundary";

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  contract: ethers.Contract | null;
}

interface Web3ContextProps extends Web3State {
  connectWallet: () => Promise<void>;
}

export const Web3Context = createContext<Web3ContextProps>({
  provider: null,
  signer: null,
  account: null,
  connectWallet: async () => {},
  contract: null,
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [web3State, setWeb3State] = useState<Web3State>({
    provider: null,
    signer: null,
    account: null,
    contract: null,
  });

  // const { showBoundary } = useErrorBoundary();

  const connectWallet = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      typeof window.ethereum === "undefined"
    ) {
      alert("MetaMask is not installed. Please install it to use this app.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const tempProvider = new ethers.BrowserProvider(window.ethereum);
      const tempSigner = await tempProvider.getSigner();
      const address = await tempSigner.getAddress();
      const contract = new ethers.Contract(
        daoAddress,
        contractArtifact.abi,
        tempSigner,
      );

      console.log(contract);

      setWeb3State((prevState) => ({
        ...prevState,
        provider: tempProvider,
        signer: tempSigner,
        account: address,
        contract,
      }));

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (error) {
      // showBoundary(error);
    }
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWeb3State({ provider: null, signer: null, account: null });
    } else {
      setWeb3State((prevState) => ({
        ...prevState,
        account: accounts[0],
      }));
    }
  };

  const handleChainChanged = (chainId: string) => {
    window.location.reload();
  };

  useEffect(() => {
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged,
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (
        typeof window === "undefined" ||
        typeof window.ethereum === "undefined"
      )
        return;

      const accounts: string[] = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        connectWallet();
      }
    };

    checkIfWalletIsConnected();
  }, [connectWallet]);

  return (
    <Web3Context.Provider value={{ ...web3State, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
