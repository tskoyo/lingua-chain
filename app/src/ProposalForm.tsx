import React, { useState } from "react";
import { z } from "zod";
import { useWeb3 } from "./context";
import type { AddProposal } from "./App";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

type ProposalFormP = {
  addProposal: AddProposal;
  close: () => void;
};

export const ProporsalForm = ({ addProposal, close }: ProposalFormP) => {
  const { contract, account } = useWeb3();

  const [formData, setFormData] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({ title: "", description: "" });
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setFormData({ ...formData, [event.target.name]: event.target.value });
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title ? fieldErrors.title[0] : "",
        description: fieldErrors.description ? fieldErrors.description[0] : "",
      });
      return;
    }
    setErrors({ title: "", description: "" });

    await contract?.createProposal(formData.title, formData.description);

    addProposal({ name: formData.title, description: formData.description });

    close();
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="text-base max-w-md mx-auto p-6 bg-black text-white border border-gray-600 shadow rounded-xs grid"
    >
      <h1 className="text-lg font-bold mb-1">Compose a proposal</h1>
      <p className="text-gray-400 mb-5 text-sm">
        Enter title and description to compose a proposal
      </p>
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
        {errors.title && (
          <p className="text-red-400 text-sm h-0 text-right">{errors.title}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block mb-2">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full py-2 px-3 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
        />
        {errors.description && (
          <p className="text-red-400 text-sm h-0 text-right">
            {errors.description}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline self-center"
      >
        Submit
      </button>
    </form>
  );
};

export default ProporsalForm;
