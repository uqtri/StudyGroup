import { useState, useRef } from 'react';
import { cn } from '../../utils/cn';

export const MentionTextarea = ({
  value,
  onChange,
  mentionedUserIds,
  onMentionsChange,
  members = [],
  placeholder,
  rows = 3,
  className,
}) => {
  const [mentionQuery, setMentionQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef(null);

  const filteredMembers = members.filter((m) => {
    const name = m.user?.fullName?.toLowerCase() || '';
    return name.includes(mentionQuery.toLowerCase());
  });

  const handleChange = (e) => {
    const next = e.target.value;
    onChange(next);

    const cursor = e.target.selectionStart;
    const before = next.slice(0, cursor);
    const atMatch = before.match(/@([\w\s]*)$/);
    if (atMatch) {
      setMentionQuery(atMatch[1].trim());
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setMentionQuery('');
    }
  };

  const insertMention = (member) => {
    const el = textareaRef.current;
    if (!el) return;

    const cursor = el.selectionStart;
    const before = value.slice(0, cursor);
    const after = value.slice(cursor);
    const atIndex = before.lastIndexOf('@');
    const prefix = before.slice(0, atIndex);
    const mentionText = `@${member.user.fullName} `;
    const nextValue = `${prefix}${mentionText}${after}`;

    onChange(nextValue);
    if (!mentionedUserIds.includes(member.userId)) {
      onMentionsChange([...mentionedUserIds, member.userId]);
    }
    setShowSuggestions(false);
    setMentionQuery('');
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'w-full resize-none rounded-xl border border-border bg-surface px-3 py-2 text-sm',
          className,
        )}
      />
      {showSuggestions && filteredMembers.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
          {filteredMembers.slice(0, 6).map((m) => (
            <li key={m.userId}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-elevated"
                onClick={() => insertMention(m)}
              >
                @{m.user.fullName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
