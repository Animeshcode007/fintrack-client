import React from "react";
import { AnimatePresence } from "framer-motion";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ expenses, onDeleteExpense }) => {
  if (expenses.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-8">
        No expenses yet. Add one to get started!
      </p>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
      <ul className="space-y-3">
        <AnimatePresence>
          {expenses.map((expense) => (
            <ExpenseItem
              key={expense._id}
              expense={expense}
              onDelete={onDeleteExpense}
            />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default ExpenseList;
