import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Journal } from "@birdman/shared-types";
import { createJournal } from "../api/birdApi";

interface CreateJournalContentProps {
  userId: string;
  onCreated: (journal: Journal) => void;
}

const inputClass =
  "rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100";

export default function CreateJournalContent({
  userId,
  onCreated,
}: CreateJournalContentProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const mutation = useMutation({
    mutationFn: createJournal,
    onSuccess: async (journal) => {
      await queryClient.invalidateQueries({ queryKey: ["journals", userId] });
      onCreated(journal);
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({
      userId,
      name: name.trim(),
      ...(description.trim() && { description: description.trim() }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
      <h2 className="text-xl font-bold">Create Journal</h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="journal-name" className="text-sm font-semibold">
          Name
        </label>
        <input
          id="journal-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="journal-description" className="text-sm font-semibold">
          Description
        </label>
        <textarea
          id="journal-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>
      {mutation.error && (
        <p role="alert" className="text-red-300">
          Unable to create journal: {mutation.error.message}
        </p>
      )}
      <button
        type="submit"
        disabled={mutation.isPending || !name.trim()}
        className="self-end rounded bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
      >
        {mutation.isPending ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
