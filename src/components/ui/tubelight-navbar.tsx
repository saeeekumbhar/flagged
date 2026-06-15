import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "../../lib/utils"

interface NavItem {
  name: string
  id: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  activeTab: string
  onTabChange: (id: string) => void
  className?: string
}

export function NavBar({ items, activeTab, onTabChange, className }: NavBarProps) {

  return (
    <nav className={cn("absolute bottom-0 left-0 right-0 h-16 premium-glass border-t border-white/60 flex justify-around items-center px-2 pb-1 z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.05)] rounded-t-[32px]", className)}>
      {items.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            aria-label={item.name}
            aria-current={isActive ? "page" : undefined}
            className="relative flex flex-col items-center justify-center flex-1 h-full active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded-lg"
          >
            {/* The icon */}
            <div className={cn("text-xl mb-0.5 transition-all z-10", isActive ? "scale-110 drop-shadow-md opacity-100 text-white" : "opacity-50 scale-90 text-white")}>
              <Icon size={20} strokeWidth={2.5} />
            </div>
            
            {/* The text label */}
            <div className={cn("text-[9px] font-bold transition-colors z-10", isActive ? "text-white drop-shadow-md" : "text-white opacity-50")}>
              {item.name}
            </div>


          </button>
        )
      })}
    </nav>
  )
}
