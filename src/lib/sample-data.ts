export type Bike = {
  id: string;
  brand: string;
  model: string;
  color: string;
  serialNumber: string;
  registeredAt: string;
  status: "registered" | "pending" | "reported";
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  campus: string;
};

export const sampleBikes: Bike[] = [
  {
    id: "1",
    brand: "Giant",
    model: "Escape 3",
    color: "Black",
    serialNumber: "GT-2024-88421",
    registeredAt: "2026-03-12",
    status: "registered",
  },
  {
    id: "2",
    brand: "Trek",
    model: "FX 2",
    color: "Blue",
    serialNumber: "TR-2025-11092",
    registeredAt: "2026-08-01",
    status: "pending",
  },
  {
    id: "3",
    brand: "Specialized",
    model: "Sirrus",
    color: "Silver",
    serialNumber: "SP-2023-55201",
    registeredAt: "2025-11-20",
    status: "reported",
  },
];

export const sampleProfile: UserProfile = {
  name: "Alex Rivera",
  email: "alex.rivera@example.edu",
  phone: "+1 (555) 010-2048",
  studentId: "S20261234",
  campus: "Main Campus",
};
