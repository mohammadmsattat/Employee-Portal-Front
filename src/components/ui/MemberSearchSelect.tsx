import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Search, ChevronDown } from "lucide-react";

const MemberSearchSelect = ({
  options = [],
  selectedValue,
  onChange,
  placeholder = "Select employee",
  disabled = false,
}) => {
  console.log(options);

  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  /* =========================
     FILTER
  ========================= */

  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return options.filter((u) =>
      `${u.fullName || ""} ${u.email || ""}`.toLowerCase().includes(q),
    );
  }, [options, searchQuery]);

  /* =========================
     SELECTED LABEL
  ========================= */

  useEffect(() => {
    if (!isOpen) {
      const selected = options.find((u) => u._id === selectedValue);

      setSearchQuery(selected ? selected.fullName || selected.email : "");
    }
  }, [selectedValue, options, isOpen]);

  /* =========================
     OUTSIDE CLICK
  ========================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideRoot = rootRef.current?.contains(e.target);

      const clickedInsideMenu = menuRef.current?.contains(e.target);

      if (!clickedInsideRoot && !clickedInsideMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex-1" ref={rootRef}>
      {/* INPUT */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={searchQuery}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      {/* MENU */}
      {isOpen && !disabled && (
        <div
          ref={menuRef}
          className="absolute left-0 top-[calc(100%+8px)] z-[99999] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          <div
            className="overflow-y-auto p-2"
            style={{
              maxHeight: 220,
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((u) => {
                const active = String(selectedValue) === String(u._id);

                return (
                  <button
                    key={u._id}
                    type="button"
                    onClick={() => {
                      onChange?.(u._id);

                      setSearchQuery(u.fullName || u.email);

                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                      active ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    {/* AVATAR */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      {(u.fullName || u.email || "?").charAt(0).toUpperCase()}
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate text-sm font-medium text-slate-800">
                        {u.fullName}
                      </span>

                      <span className="truncate text-xs text-slate-500">
                        {u.email}
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-slate-400">
                No employee found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSearchSelect;
