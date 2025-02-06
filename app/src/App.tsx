import { useEffect, useState } from "react";
import ProporsalForm from "./ProposalForm";
import VotingForm from "./VotingForm";
import Header from "./Header";
import { useWeb3 } from "./context";

interface Proposal {
  id: number;
  name: string;
  description: string;
  forVotes: number;
  againstVotes: number;
  proposer: string;
}

export enum Vote {
  For = "for",
  Against = "against",
}

const format = (data) =>
  data.map((p: any) => ({
    id: Number(p[0]),
    name: p[1],
    description: p[2],
    forVotes: Number(p[3]),
    againstVotes: Number(p[4]),
    proposer: p[5],
  }));

export default function ProposalsList() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const { contract, account } = useWeb3();

  console.log(proposals);

  useEffect(() => {
    contract?.getAllProposals().then(format).then(setProposals);
  }, [contract]);

  const addOptimisticProposal: AddProposal = (
    proposal: Pick<Proposal, "name" | "description">,
  ) => {
    setProposals((prev) => [
      ...prev,
      {
        ...proposal,
        forVotes: 0,
        againstVotes: 0,
        id: prev.length,
        proposer: account ?? "",
      },
    ]);
  };

  return (
    <div className="min-h-dvh grid grid-rows-[min-content_1fr] h-full">
      <Header />
      <div className="bg-linear-to-t from-cyan-900 to-gray-900 fixed top-0 z-1 h-full w-full" />
      <main className="container grid grid-rows-[min-content_1fr] mx-auto z-2 h-full py-10">
        <div className="-ml-1 mb-4 text-4xl font-black h-13 font-semibold text-white mt-10 flex justify-between">
          <h1>Proposals</h1>
          <AddButton addProposal={addOptimisticProposal} />
        </div>
        <div className="border-x shadow-3xl border-t border-gray-500 w-full bg-gray-900 rounded-xs">
          <div className="flex flex-col-reverse divide-gray-700 divide-y-1 divide-y-reverse px-6">
            {proposals.map((proposal) => (
              <Proposal {...proposal} key={proposal.id} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export type FormButtonP = { addProposal: AddProposal };
export type AddProposal = (
  proposal: Pick<Proposal, "name" | "description">,
) => void;

const ClosePseudoButton = ({ close }: { close: () => void }) => (
  <button
    onClick={close}
    className="text-gray-600 absolute absolute -top-2 -right-10 text-base select-none"
  >
    [ <span className="text-red-500">x</span> ]
  </button>
);

export const AddButton = ({ addProposal }: FormButtonP) => {
  const [shown, setShowForm] = useState(false);

  const close = () => setShowForm(false);

  return (
    <>
      <button
        className={`mt-1 px-6 grid place-items-center border-2 border-gray-400 rounded-xs`}
        onClick={() => setShowForm(true)}
      >
        <span className="text-base">Compose a proposal</span>
      </button>
      {shown && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-20 flex items-center justify-center z-50">
          <div className="relative min-w-75">
            <ProporsalForm addProposal={addProposal} close={close} />
            <ClosePseudoButton close={close} />
          </div>
        </div>
      )}
    </>
  );
};

const buttonStyle = (visible: boolean) =>
  `w-9 h-9 grid place-items-center rounded-full border-2 ${visible ? "" : "pointer-events-none in"}visible`;
const VotingButtons = () => {
  const [vote, setVote] = useState<Vote | undefined>(undefined);

  const close = () => setVote(undefined);

  return (
    <div className="flex gap-3 items-center">
      <button
        className={`${buttonStyle(vote !== Vote.For)} border-green-800 text-green-800`}
        onClick={() => setVote(Vote.For)}
      >
        <For />
      </button>
      <button
        className={`${buttonStyle(vote !== Vote.Against)} border-red-800 text-red-800`}
        onClick={() => setVote(Vote.Against)}
      >
        <Against />
      </button>
      {vote && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-20 flex items-center justify-center z-50">
          <div className="relative min-w-75">
            <VotingForm vote={vote} close={close} />
            <ClosePseudoButton close={close} />
          </div>
        </div>
      )}
    </div>
  );
};

const Proposal = (p: Proposal) => {
  const { id, name, description, forVotes, againstVotes, proposer } = p;
  return (
    <div key={id} className="py-3.5 text-white">
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <div className=" text-gray-700 text-xs">By: {proposer}</div>
          <p className="text-gray-300 mt-3">{description}</p>
        </div>
        <div>
          <VotingButtons />
          <Scale forVotes={forVotes} againstVotes={againstVotes} />
        </div>
      </div>
    </div>
  );
};

const Scale = ({
  forVotes,
  againstVotes,
}: {
  forVotes: number;
  againstVotes: number;
}) => {
  const totalVotes = forVotes + againstVotes;
  const forPercentage = totalVotes ? (forVotes / totalVotes) * 100 : 1;
  const againstPercentage = totalVotes ? (againstVotes / totalVotes) * 100 : 1;

  return (
    <div className="mt-4">
      <div className="relative w-full h-1 bg-gray-700 rounded-lg overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-green-500"
          style={{ width: `${forPercentage}%` }}
        />
        <div
          className="absolute top-0 right-0 h-full bg-red-500"
          style={{ width: `${againstPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs mt-1 text-gray-400">
        <span>{forVotes}</span>
        <span>{againstVotes}</span>
      </div>
    </div>
  );
};

const For = () => (
  <svg
    viewBox="0 0 24 24"
    width="20px"
    height="20px"
    className="stroke-current"
  >
    <path
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m5 13l4 4L19 7"
    ></path>
  </svg>
);

const Against = () => (
  <svg viewBox="0 0 24 24" width="20px" height="20px">
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    ></path>
  </svg>
);
