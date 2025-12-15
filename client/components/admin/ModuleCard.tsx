export default function ModuleCard({
  module,
  checked,
  disabled,
  onToggle,
}: {
  module: any;
  checked: boolean;
  disabled: boolean;
  onToggle: (id: number) => void;
}) {
  return (
    <div
      onClick={() => !disabled && onToggle(module.module_id)}
      className={`cursor-pointer p-6 rounded-xl border shadow-sm hover:shadow-md transition 
      ${disabled ? "opacity-40 cursor-not-allowed" : "bg-white"} `}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="p-3 rounded-full bg-blue-100 border border-blue-200">
          <span className="text-3xl text-blue-600">📦</span>
        </div>

        <h3 className="font-semibold text-lg">{module.module_name}</h3>
        <p className="text-gray-600 text-sm">{module.description || "Module access control"}</p>

        <input
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={() => onToggle(module.module_id)}
        />
      </div>
    </div>
  );
}
