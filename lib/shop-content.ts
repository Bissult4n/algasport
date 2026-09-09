export type Owner = {
  id: string;
  name: string | null;
  photo: string | null;
  dan: string | null;
  description: string | null;
};

// Add only the owners' confirmed information. Photo paths are relative to public/.
export const owners: Owner[] = [
  { id: "owner-1", name: null, photo: null, dan: null, description: null },
  { id: "owner-2", name: null, photo: null, dan: null, description: null },
];
