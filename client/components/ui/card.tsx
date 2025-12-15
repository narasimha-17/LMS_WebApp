export function Card({ className = "", children }: any) {
  return (
    <div className={`border rounded-lg shadow-sm bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: any) {
  return (
    <div className={`border-b px-4 py-3 bg-gray-50 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: any) {
  return <h2 className="font-semibold text-lg">{children}</h2>;
}

export function CardContent({ className = "", children }: any) {
  return <div className={`px-4 py-4 ${className}`}>{children}</div>;
}
