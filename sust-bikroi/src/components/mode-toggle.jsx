import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useState, useRef, useEffect } from "react"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center rounded-lg p-2 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-primary dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-primary"
                title="Switch theme"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 origin-top-right rounded-xl border border-zinc-200 bg-white p-1 shadow-lg shadow-zinc-200/50 ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/20 z-50">
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={() => { setTheme("light"); setIsOpen(false) }}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${theme === 'light' ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'}`}
                        >
                            <Sun className="h-4 w-4" />
                            Light
                        </button>
                        <button
                            onClick={() => { setTheme("dark"); setIsOpen(false) }}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${theme === 'dark' ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'}`}
                        >
                            <Moon className="h-4 w-4" />
                            Dark
                        </button>
                        <button
                            onClick={() => { setTheme("system"); setIsOpen(false) }}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${theme === 'system' ? 'text-primary' : 'text-zinc-600 dark:text-zinc-400'}`}
                        >
                            <Monitor className="h-4 w-4" />
                            System
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
