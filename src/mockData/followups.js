export const mockFollowUps = [
  { 
    id: "FU-001", 
    invoiceNo: "INV-107", 
    customer: "Cholamandalam", 
    dueAmount: 10000, 
    lastRemark: "Client requested to call back next week after budget approval.", 
    nextDate: "2026-04-07", // Simulating "Today"
    status: "today", 
    employee: "Molina" 
  },
  { 
    id: "FU-002", 
    invoiceNo: "INV-103", 
    customer: "Muscat Express Hotel", 
    dueAmount: 3500, 
    lastRemark: "Awaiting final sign-off from the finance director.", 
    nextDate: "2026-04-02", // Simulating "Overdue"
    status: "overdue", 
    employee: "Paulo Dybala" 
  },
  { 
    id: "FU-003", 
    invoiceNo: "INV-112", 
    customer: "VPS Bakery", 
    dueAmount: 12500, 
    lastRemark: "Sent the automated payment link via email.", 
    nextDate: "2026-04-12", // Simulating "Upcoming"
    status: "upcoming", 
    employee: "Sarah Khan" 
  },
];