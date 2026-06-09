import { useState } from "react";

type Filters = {
  category: string;
  organizer: string;
  types: string[];
  date: string | null;
};

type FilterProps = {
  initial?: Partial<Filters>;
  onChange?: (filters: Filters) => void;
};

const CATEGORY_OPTIONS = ["AllCategories", "Academic", "Social", "Career"];
const ORGANIZER_OPTIONS = ["AllOrganizers", "Student Org", "Community"];
const EVENT_TYPES = ["Workshop", "Competition", "Seminar"];

function Filter({ initial, onChange }: FilterProps) {
  const [category, setCategory] = useState<string>(initial?.category ?? "AllCategories");
  const [organizer, setOrganizer] = useState<string>(initial?.organizer ?? "AllOrganizers");
  const [types, setTypes] = useState<Set<string>>(new Set(initial?.types ?? []));
  const [date, setDate] = useState<string | null>(initial?.date ?? null);

  const emit = () =>
    onChange?.({
      category,
      organizer,
      types: Array.from(types),
      date,
    });

  const toggleType = (t: string) => {
    const s = new Set(types);
    if (s.has(t)) s.delete(t);
    else s.add(t);
    setTypes(s);
    setTimeout(emit, 0);
  };

  const reset = () => {
    setCategory("AllCategories");
    setOrganizer("AllOrganizers");
    setTypes(new Set());
    setDate(null);
    setTimeout(emit, 0);
  };

  return (
    <aside className="w-72 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-2">
        <span className="text-xl">⚝</span> FILTERS
      </h3>

      <div className="mb-5">
        <div className="text-sm font-medium text-gray-700 mb-2">Category</div>
        <div className="space-y-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-3 text-sm text-gray-600">
              <input
                type="radio"
                name="category"
                value={opt}
                checked={category === opt}
                onChange={() => {
                  setCategory(opt);
                  setTimeout(emit, 0);
                }}
                className="form-radio h-4 w-4 text-orange-400"
              />
              <span>{opt === "AllCategories" ? "All Categories" : opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-sm font-medium text-gray-700 mb-2">Organizer</div>
        <div className="space-y-2">
          {ORGANIZER_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-3 text-sm text-gray-600">
              <input
                type="radio"
                name="organizer"
                value={opt}
                checked={organizer === opt}
                onChange={() => {
                  setOrganizer(opt);
                  setTimeout(emit, 0);
                }}
                className="form-radio h-4 w-4 text-orange-400"
              />
              <span>{opt === "AllOrganizers" ? "All Organizers" : opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-sm font-medium text-gray-700 mb-2">Event Type</div>
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((t) => {
            const active = types.has(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                className={`text-sm px-3 py-1 rounded-full border ${
                  active
                    ? "bg-orange-400 text-white border-orange-400"
                    : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                }`}
                aria-pressed={active}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Date</div>
        <input
          type="date"
          value={date ?? ""}
          onChange={(e) => {
            const val = e.target.value || null;
            setDate(val);
            setTimeout(emit, 0);
          }}
          className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={reset}
          className="w-full bg-black text-white rounded-full px-4 py-2 text-sm"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}

export default Filter;