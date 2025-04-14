interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] text-destructive">
      {message || "There was an error loading the data"}
    </div>
  );
};
