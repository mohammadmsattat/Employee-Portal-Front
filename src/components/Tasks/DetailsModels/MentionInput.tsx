import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

// ======================================
// HELPERS
// ======================================

const toMentionHandle = (fullName = "") => {
  return fullName.replace(/\s+/g, "");
};

const normalizeUser = (user) => {
  if (!user) return null;
  if (typeof user === "string") return { _id: user, fullName: "User" };
  return user;
};

// ======================================
// MENTION INPUT
// ======================================

const MentionInput = ({
  value,
  onChange,
  onSend,
  assignedTo = [],
  isMobile = false,
  placeholder = "Write a comment...",
  disabled = false,
}) => {
  console.log("🟢 [MentionInput] rendered");
  console.log("🟢 [MentionInput] value:", value);
  console.log("🟢 [MentionInput] assignedTo length:", assignedTo?.length);

  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentions, setMentions] = useState([]);

  const users = useMemo(() => {
    const result = (assignedTo || [])
      .map(normalizeUser)
      .filter((u) => u && u._id && u.fullName);

    console.log("🟢 [MentionInput] users normalized:", result);

    return result;
  }, [assignedTo]);

  const filteredUsers = useMemo(() => {
    if (!searchText) return users;
    const lower = searchText.toLowerCase();
    const result = users.filter((u) => {
      const name = (u.fullName || "").toLowerCase();
      return name.includes(lower);
    });

    console.log("🟢 [MentionInput] filteredUsers:", result);

    return result;
  }, [users, searchText]);

  useEffect(() => {
    console.log("🟢 [MentionInput] showDropdown changed:", showDropdown);
  }, [showDropdown]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchText, showDropdown]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;

      console.log("🔴 [MentionInput] handleChange called");
      console.log("🔴 [MentionInput] newValue:", newValue);

      onChange(newValue);

      const cursor = e.target.selectionStart ?? newValue.length;
      console.log("🔴 [MentionInput] cursor:", cursor);

      const textBeforeCursor = newValue.slice(0, cursor);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      console.log("🔴 [MentionInput] lastAtIndex:", lastAtIndex);

      if (lastAtIndex === -1) {
        setShowDropdown(false);
        setSearchText("");
        setMentionStartIndex(-1);
        return;
      }

      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      console.log("🔴 [MentionInput] textAfterAt:", textAfterAt);

      if (/\s/.test(textAfterAt)) {
        console.log("🔴 [MentionInput] space found after @, closing");
        setShowDropdown(false);
        setSearchText("");
        setMentionStartIndex(-1);
        return;
      }

      const charBeforeAt =
        lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : " ";

      if (charBeforeAt && !/\s/.test(charBeforeAt)) {
        console.log("🔴 [MentionInput] char before @ is not space, closing");
        setShowDropdown(false);
        return;
      }

      console.log("🔴 [MentionInput] OPENING DROPDOWN");
      setMentionStartIndex(lastAtIndex);
      setSearchText(textAfterAt);
      setShowDropdown(true);
    },
    [onChange],
  );

  const selectUser = useCallback(
    (user) => {
      console.log("🔵 [MentionInput] selectUser called:", user);

      if (!user || mentionStartIndex === -1) return;

      const handle = toMentionHandle(user.fullName);
      const before = value.slice(0, mentionStartIndex);
      const after = value.slice(mentionStartIndex + searchText.length + 1);

      const newValue = `${before}@${handle} ${after}`;
      console.log("🔵 [MentionInput] newValue:", newValue);

      onChange(newValue);

      setMentions((prev) => {
        if (prev.includes(user._id)) return prev;
        return [...prev, user._id];
      });

      setShowDropdown(false);
      setSearchText("");
      setMentionStartIndex(-1);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    },
    [value, mentionStartIndex, searchText, onChange],
  );

  const handleSend = useCallback(() => {
    console.log("📤 [MentionInput] handleSend called");
    console.log("📤 [MentionInput] mentions:", mentions);

    if (!value.trim() || disabled) return;
    onSend?.(value, mentions);
    setMentions([]);
    setShowDropdown(false);
    setSearchText("");
    setMentionStartIndex(-1);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, mentions, onSend, disabled]);

  const handleKeyDown = useCallback(
    (e) => {
      console.log(
        "⌨️ [MentionInput] key:",
        e.key,
        "showDropdown:",
        showDropdown,
      );

      if (showDropdown && filteredUsers.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredUsers.length - 1 ? prev + 1 : 0,
          );
          return;
        }

        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredUsers.length - 1,
          );
          return;
        }

        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          selectUser(filteredUsers[selectedIndex]);
          return;
        }

        if (e.key === "Escape") {
          e.preventDefault();
          setShowDropdown(false);
          return;
        }
      }

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [showDropdown, filteredUsers, selectedIndex, selectUser, handleSend],
  );

  const handleInput = useCallback((e) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }, []);

  return (
    <div className="relative flex-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="w-full border border-slate-200/60 rounded-2xl px-4 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none min-h-[44px] max-h-[120px] transition placeholder:text-slate-400 disabled:opacity-60"
        style={{ height: "auto" }}
      />

      {showDropdown && filteredUsers.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden bottom-full mb-2"
        >
          <div className="max-h-[220px] overflow-y-auto">
            {filteredUsers.map((user, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={user._id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    selectUser(user);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition text-left ${
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {(user.fullName || "U").charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {user.fullName}
                    </p>
                    {user.email && (
                      <p className="text-[10px] text-slate-400 truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MentionInput);
