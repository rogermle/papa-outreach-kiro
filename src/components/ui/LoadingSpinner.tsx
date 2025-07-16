interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  text,
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <span
        className={`loading loading-spinner text-primary ${sizeClasses[size]}`}
      ></span>
      {text && <p className="mt-2 text-base-content/70">{text}</p>}
    </div>
  );
}
