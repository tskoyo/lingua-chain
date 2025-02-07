// import React, { useState } from "react";
// import { z } from "zod";
// import { Vote } from "./App";
// import { useWeb3 } from "./context";
//
// const formSchema = z.object({
//   range: z.number().min(0, { message: "Couldn't be zero" }),
// });
//
// type ProposalFormP = {
//   vote: Vote;
//   close: () => void;
// };
//
// export const VotingForm = ({ vote, close }: ProposalFormP) => {
//   const { tokens, contract } = useWeb3();
//
//   // const [formData, setFormData] = useState({ title: "", description: "" });
//   const [errors, setErrors] = useState({ range: "" });
//   const [range, setRange] = useState(0);
//   // const handleChange = (
//   //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   // ) => setFormData({ ...formData, [event.target.name]: event.target.value });
//   const handleSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     // const result = formSchema.safeParse(formData);
//     // if (!result.success) {
//     //   const fieldErrors = result.error.flatten().fieldErrors;
//     //   setErrors({
//     //     title: fieldErrors.title ? fieldErrors.title[0] : "",
//     //     description: fieldErrors.description ? fieldErrors.description[0] : "",
//     //   });
//     //   return;
//     // }
//     setErrors({ range: "" });
//     close();
//   };
//
//   return (
//     <form
//       onSubmit={handleSubmit}
//       noValidate
//       className="text-base max-w-md mx-auto p-6 bg-black text-white border border-gray-600 shadow rounded-xs grid"
//     >
//       <h1 className="text-lg font-bold mb-1">Cast your vote</h1>
//       <p className="text-gray-400 mb-5 text-sm">
//         Choose your voting power and submit the vote
//       </p>
//       <div className="mb-4">
//         <label htmlFor="title" className="block mb-2 font-bold">
//           Choice
//         </label>
//         {vote}
//       </div>
//       <div className="flex-col items-center mr-5 mb-10">
//         <label htmlFor="title" className="block mb-2 font-bold">
//           Voting power
//         </label>
//         <input
//           type="range"
//           min="0"
//           max={tokens ?? 0}
//           value={range}
//           onChange={(event) => setRange(Number(event.target.value))}
//           className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer"
//         />
//         <div className="ml-2 text-lg text-gray-200 w-2">{range}</div>
//         {errors.range && (
//           <p className="text-red-400 text-sm h-0 text-right">{errors.range}</p>
//         )}
//       </div>
//       <button
//         type="submit"
//         className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//       >
//         Submit
//       </button>
//     </form>
//   );
// };
//
// export default VotingForm;
