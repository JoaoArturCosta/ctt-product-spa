import React, { ChangeEvent, InputHTMLAttributes } from "react";
import styles from "./InputField.module.css";

// Extend standard InputHTMLAttributes and make onChange specific
interface InputFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "className" // Omit standard onChange/className to redefine
  > {
  label: string;
  id: string; // Make id required for label association
  name: string; // Make name required for form handling
  onChange: (e: ChangeEvent<HTMLInputElement>) => void; // Specific onChange type
  // Allow optional extra className prop for flexibility
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type = "text", // Default type to text
  value,
  onChange,
  className = "", // Default className to empty string
  ...rest // Pass down other standard input props like placeholder, required, disabled, step, min
}) => {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {" "}
      {/* Combine base and extra classes */}
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={styles.input}
        {...rest} // Spread remaining props
      />
    </div>
  );
};

export default InputField;
