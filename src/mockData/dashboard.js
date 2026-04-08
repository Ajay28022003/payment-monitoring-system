export const dashboardData = {
  sales: [
    { title: "Today's Follow-ups", value: "14", type: "neutral", filterKey: "sales-today-followup" },
    { title: "Current Month Follow-ups", value: "156", type: "neutral", filterKey: "sales-month-followup" },
    { title: "Current Month Pending Amount", value: "AED 45,200", type: "bad", filterKey: "sales-month-pending" },
    { title: "Current Month Amount Received", value: "AED 128,500", type: "good", filterKey: "sales-month-received" },
    { title: "Balance Amount", value: "AED 12,400", type: "neutral", filterKey: "sales-balance" },
    { title: "Overall Pending Amount", value: "AED 342,900", type: "bad", filterKey: "sales-overall-pending" },
  ],
  purchases: [
    { title: "Today's Due", value: "8", type: "bad", filterKey: "purchase-today-due" },
    { title: "Current Month Due", value: "45", type: "bad", filterKey: "purchase-month-due" },
    { title: "Amount to be Paid", value: "AED 18,500", type: "bad", filterKey: "purchase-amount-paid" },
    { title: "Current Month Payable Amount", value: "AED 92,000", type: "neutral", filterKey: "purchase-month-payable" },
    { title: "Current Month Amount Paid", value: "AED 73,500", type: "good", filterKey: "purchase-month-paid" },
    { title: "Balance Amount", value: "AED 18,500", type: "neutral", filterKey: "purchase-balance" },
    { title: "Overall Due Amount", value: "AED 156,200", type: "bad", filterKey: "purchase-overall-due" },
  ],
  general: { totalCustomers: 842, totalStaff: 24 }
};