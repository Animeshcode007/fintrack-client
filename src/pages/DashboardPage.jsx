import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import api from "../lib/api";
import Aurora from "../bit-components/Aurora";

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async (expenseData) => {
    try {
      const res = await api.post("/expenses", expenseData);
      setExpenses([res.data, ...expenses]); // Add new expense to the top
    } catch (err) {
      console.error("Failed to add expense:", err.response.data);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <Aurora
            dotSize={2}
            gap={36}
            baseColor="#FFFFFF"
            activeColor="#7D7891"
            proximity={100}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
      </div>
      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 z-40">
          {loading ? (
            <p>Loading expenses...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                <ExpenseForm onAddExpense={handleAddExpense} />
                <ExpenseList
                  expenses={expenses}
                  onDeleteExpense={handleDeleteExpense}
                />
              </div>
              {/* Right Column */}
              <div className="lg:col-span-1">
                <AnalyticsDashboard expenses={expenses} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
