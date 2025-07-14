import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PIE_COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#ff4d4d",
];
const BAR_COLOR = "#8884d8";

const AnalyticsDashboard = ({ expenses }) => {
  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const categoryChartData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  const dailyChartData = useMemo(() => {
    const dailyTotals = expenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + expense.amount;
      return acc;
    }, {});

    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        name: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        amount,
      }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));
  }, [expenses]);

  const avgExpensePerDay = useMemo(() => {
    const uniqueDays = new Set(
      expenses.map((e) => new Date(e.date).toISOString().split("T")[0])
    );
    return uniqueDays.size > 0 ? totalExpense / uniqueDays.size : 0;
  }, [expenses, totalExpense]);

  const exportPDF = () => {
    if (expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Expense Report", 14, 22);

    doc.setFontSize(12);
    // --- FIX #1: Corrected .toFixed() to .toFixed() ---
    doc.text(`Total Expenses: ${totalExpense.toFixed(2)}`, 14, 32);
    doc.text(`Average Daily Expense: ${avgExpensePerDay.toFixed(2)}`, 14, 40);

    // --- FIX #2: Call autoTable as an explicit function ---
    doc.autoTable({
      startY: 50,
      head: [["Date", "Category", "Description", "Amount"]],
      body: expenses.map((e) => [
        new Date(e.date).toLocaleDateString("en-US", { timeZone: "UTC" }),
        e.category,
        e.description || "-",
        e.amount.toFixed(2),
      ]),
      theme: "striped",
      headStyles: { fillColor: [30, 130, 76] },
    });

    doc.save("expense-report-anime.pdf");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Analytics</h2>
        <button
          onClick={exportPDF}
          className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md disabled:bg-green-400"
          disabled={expenses.length === 0}
        >
          Export to PDF
        </button>
      </div>

      {/* Key Metrics Display */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Spent
          </p>
          <p className="text-2xl font-bold">₹{totalExpense}</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Avg. Daily Spend
          </p>
          <p className="text-2xl font-bold">₹{avgExpensePerDay.toFixed(2)}</p>
        </div>
      </div>

      {expenses.length > 0 ? (
        <>
          {/* Daily Expense Bar Chart */}
          <div>
            <h3 className="font-semibold mb-2">Daily Expenses</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={dailyChartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  cursor={{ fill: "rgba(206, 206, 206, 0.2)" }}
                />
                <Bar dataKey="amount" fill={BAR_COLOR} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Pie Chart */}
          <div>
            <h3 className="font-semibold mb-2">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-gray-500 mt-8">
            No expense data yet. Add an expense to see your analytics!
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
