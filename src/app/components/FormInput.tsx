'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  id?: string;
}

export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  error,
  rows,
  id,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isTextarea = rows && rows > 1;

  const baseClasses = `w-full px-4 py-3.5 rounded-2xl border-2 bg-slate-50 dark:bg-slate-950 outline-none font-medium transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
    error
      ? 'border-red-400 dark:border-red-500'
      : isFocused
        ? 'border-blue-500 dark:border-blue-500'
        : 'border-slate-200 dark:border-slate-800'
  }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      <label
        htmlFor={id}
        className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 pl-1"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
          className={baseClasses}
        />
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs font-bold pl-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
