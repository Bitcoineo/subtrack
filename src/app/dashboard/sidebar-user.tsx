interface SidebarUserProps {
  initial: string;
  userName: string;
  plan: string;
  badge: string;
  signOutAction: () => Promise<void>;
}

export function SidebarUser({
  initial,
  userName,
  plan,
  badge,
  signOutAction,
}: SidebarUserProps) {
  return (
    <div className="px-4 py-5 border-t border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#191C1F] text-white text-sm font-medium flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#191C1F] truncate">
            {userName}
          </p>
          <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${badge}`}>
            {plan}
          </span>
        </div>
      </div>
      <form action={signOutAction}>
        <button
          type="submit"
          className="mt-3 w-full text-left text-sm text-gray-400 hover:text-gray-600 transition-colors duration-150 py-1"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
