import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'
import {
  MessageSquare,
  Search,
  Database,
  PanelLeft,
  Bot,
  LogOut,
  Settings,
  MessageCircle,
  Pencil,
  Trash2,
  Check as CheckIcon,
  X,
  Wallet,
} from 'lucide-react'
import chaplinLogo from '@/shared/assets/chaplin.png'
import { getChatSessions, patchChatSession, deleteChatSession } from '@/features/chat/services/chatServices'
import { useUIStates } from '@/shared/states/uiStates'
import ThemeToggle from './ThemeToggle'

interface SessionInfo {
  sessionId: string
  lastMessage: string
  lastRole: string
  messageCount: number
  lastActivity: string
  title: string | null
}

function truncateText(text: string, maxLen: number) {
  if (!text) return 'New conversation'
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

interface NavItemProps {
  href?: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  isActive: boolean
  onClick?: () => void
}

function NavItem({ href, icon, label, collapsed, isActive, onClick }: Readonly<NavItemProps>) {
  const navActiveClass = 'bg-accent text-accent-foreground'
  const navInactiveClass = 'text-muted-foreground hover:bg-muted hover:text-foreground'
  const baseClass = `flex items-center gap-2.5 rounded-md transition-colors w-full ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'} ${isActive ? navActiveClass : navInactiveClass}`

  if (href) {
    return (
      <Link href={href} title={collapsed ? undefined : label} className={baseClass}>
        {icon}
        {!collapsed && <span className="text-rem-90 font-quera font-semibold truncate">{label}</span>}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} title={collapsed ? undefined : label} className={baseClass}>
      {icon}
      {!collapsed && <span className="text-rem-90 font-quera font-semibold truncate">{label}</span>}
    </button>
  )
}

const userName = process.env.NEXT_PUBLIC_USER_NAME ?? 'Dzikri'
const userInitials = userName.slice(0, 2).toUpperCase()

export default function Sidebar() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session } = useSession()
  const { sidebarOpen, toggleSidebar, chatSessionId, setChatSessionId, newChatSession, setSearchModalOpen } = useUIStates()
  const [showSettings, setShowSettings] = useState(false)
  const [hoveredSession, setHoveredSession] = useState<string | null>(null)
  const [editingSession, setEditingSession] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const displayName = session?.user?.name ?? userName
  const displayInitials = session?.user?.name
    ? session.user.name.slice(0, 2).toUpperCase()
    : userInitials
  const displayImage = session?.user?.image ?? null

  const { data: sessionsRaw } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: async () => {
      const data = await getChatSessions()
      return (data ?? []) as SessionInfo[]
    },
    refetchInterval: 10_000,
  })
  const sessions = (sessionsRaw ?? []) as SessionInfo[]

  function handleNewChat() {
    newChatSession()
    if (router.pathname !== '/chat' && router.pathname !== '/') {
      router.push('/chat')
    }
  }

  function handleSelectSession(sessionId: string) {
    setChatSessionId(sessionId)
    if (router.pathname !== '/chat' && router.pathname !== '/') {
      router.push('/chat')
    }
  }

  async function handleRenameSession(sessionId: string) {
    if (!editTitle.trim()) return
    await patchChatSession(sessionId, editTitle.trim())
    queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
    setEditingSession(null)
  }

  async function handleDeleteSession(sessionId: string) {
    if (!confirm('Hapus percakapan ini?')) return
    await deleteChatSession(sessionId)
    queryClient.invalidateQueries({ queryKey: ['chat-sessions'] })
    if (chatSessionId === sessionId) {
      newChatSession()
    }
  }

  function startRename(sessionId: string, currentTitle: string | null) {
    setEditingSession(sessionId)
    setEditTitle(currentTitle ?? '')
  }

  const isChatPage = router.pathname === '/chat' || router.pathname === '/'

  const navActiveClass = 'bg-accent text-accent-foreground'
  const navInactiveClass = 'text-muted-foreground hover:bg-muted hover:text-foreground'

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-sidebar border-r border-border flex flex-col z-30 transition-[width,transform] duration-300 ease-in-out ${
        sidebarOpen
          ? 'translate-x-0 w-64'
          : '-translate-x-full w-64 md:translate-x-0 md:w-[52px]'
      }`}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between px-3 overflow-hidden">
        {sidebarOpen ? (
          <>
            <Image src={chaplinLogo} alt="Chaplin" height={28} className="select-none" />
            <button
              type="button"
              onClick={toggleSidebar}
              title="Tutup sidebar"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="group flex w-full justify-center">
            <Image src={chaplinLogo} alt="Chaplin" height={24} className="select-none group-hover:hidden" />
            <button
              type="button"
              onClick={toggleSidebar}
              title="Buka sidebar"
              className="hidden group-hover:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-2 py-3 space-y-0.5 shrink-0">
        <NavItem
          icon={<MessageSquare className="h-4 w-4 shrink-0" />}
          label="New Chat"
          collapsed={!sidebarOpen}
          isActive={isChatPage}
          onClick={handleNewChat}
        />
        <NavItem
          icon={<Search className="h-4 w-4 shrink-0" />}
          label="Search"
          collapsed={!sidebarOpen}
          isActive={false}
          onClick={() => setSearchModalOpen(true)}
        />
        <NavItem
          href="/agents"
          icon={<Bot className="h-4 w-4 shrink-0" />}
          label="Agents"
          collapsed={!sidebarOpen}
          isActive={router.pathname.startsWith('/agents')}
        />
        <NavItem
          href="/knowledge-base"
          icon={<Database className="h-4 w-4 shrink-0" />}
          label="Knowledge Base"
          collapsed={!sidebarOpen}
          isActive={router.pathname.startsWith('/knowledge-base')}
        />
        <NavItem
          href="/usage"
          icon={<Wallet className="h-4 w-4 shrink-0" />}
          label="Usage & Saldo"
          collapsed={!sidebarOpen}
          isActive={router.pathname.startsWith('/usage')}
        />
      </nav>

      {/* Recent Chats — only when sidebar is open */}
      {sidebarOpen && (
        <div className="flex flex-col flex-1 overflow-hidden px-2 pb-2">
          <div className="px-3 py-2 shrink-0 flex items-center justify-between">
            <span className="text-rem-75 font-gudlak font-bold text-muted-foreground">Recent Chats</span>
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              title="Cari percakapan (⌘K)"
              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto space-y-0.5 list-none p-0">
            {sessions.length === 0 && (
              <li className="text-rem-75 text-muted-foreground px-3 py-2">No conversations yet</li>
            )}
            {sessions.map((s) => (
              <li
                key={s.sessionId}
                className="relative group"
                onMouseEnter={() => setHoveredSession(s.sessionId)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                {editingSession === s.sessionId ? (
                  <div className="flex items-center gap-1 px-3 py-1.5">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSession(s.sessionId)
                        if (e.key === 'Escape') setEditingSession(null)
                      }}
                      onBlur={() => setEditingSession(null)}
                      autoFocus
                      className="flex-1 bg-transparent text-rem-80 font-sans text-foreground focus:outline-none"
                    />
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => handleRenameSession(s.sessionId)} className="p-1 text-muted-foreground hover:text-foreground"><CheckIcon className="h-3 w-3" /></button>
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => setEditingSession(null)} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectSession(s.sessionId)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      s.sessionId === chatSessionId && isChatPage
                        ? navActiveClass
                        : navInactiveClass
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-3.5 w-3.5 shrink-0 opacity-60" />
                      <p className="text-rem-80 font-sans font-medium truncate flex-1">
                        {s.title ?? truncateText(s.lastMessage ?? '', 22)}
                      </p>
                      {hoveredSession === s.sessionId && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); startRename(s.sessionId, s.title) }}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted"
                            title="Ubah nama"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.sessionId) }}
                            className="p-0.5 rounded text-muted-foreground hover:text-destructive hover:bg-muted"
                            title="Hapus"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Spacer when collapsed */}
      {!sidebarOpen && <div className="flex-1" />}

      {/* User footer */}
      <div className="px-2 py-3 shrink-0">
        {sidebarOpen ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-muted transition-colors w-full"
            >
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImage} alt={displayName} className="h-8 w-8 rounded-full shrink-0 object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-rem-75 font-bold">
                  {displayInitials}
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-rem-85 font-gudlak font-bold text-foreground truncate">{displayName}</p>
                <p className="text-rem-70 font-sans text-muted-foreground">{session ? 'Google Account' : 'Free Plan'}</p>
              </div>
              <Settings className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            </button>

            {showSettings && (
              <div className="absolute bottom-full left-2 right-2 mb-2 rounded-xl border bg-card shadow-xl z-30 py-1">
                <ThemeToggle collapsed={false} />
                {session ? (
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-rem-85 font-medium text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign Out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => signIn('google')}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-rem-85 font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign In with Google
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {displayImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displayImage} alt={displayName} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-rem-70 font-bold">
                {displayInitials}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
