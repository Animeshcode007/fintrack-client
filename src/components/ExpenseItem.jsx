import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react'; 

const ExpenseItem = ({ expense, onDelete }) => {
    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring' }}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
            <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{expense.category}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {expense.description || new Date(expense.date).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="font-bold text-lg text-red-500">
                    -₹{expense.amount.toFixed(2)}
                </span>
                <button onClick={() => onDelete(expense._id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.li>
    );
};

export default ExpenseItem;