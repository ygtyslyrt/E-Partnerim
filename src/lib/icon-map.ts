import {
  MessageSquare, Store, ShieldCheck, Megaphone, Star, Package,
  Zap, Target, Globe, Headphones, BookOpen, BarChart2,
  Settings, Users, TrendingUp, Award, CheckCircle2, Lightbulb,
  Rocket, HeartHandshake, Briefcase, Search, Layout, Code2,
  MessageCircle, Cpu, ScanSearch, Handshake, Link2, Layers,
  ShoppingCart, Building2, Gift, MoreHorizontal, PlusCircle,
  CreditCard, DollarSign, Calendar, CalendarDays, Eye, Settings2,
  type LucideIcon,
} from "lucide-react"

export const ICON_MAP: Record<string, LucideIcon> = {
  MessageSquare, Store, ShieldCheck, Megaphone, Star, Package,
  Zap, Target, Globe, Headphones, BookOpen, BarChart2,
  Settings, Users, TrendingUp, Award, CheckCircle2, Lightbulb,
  Rocket, HeartHandshake, Briefcase, Search, Layout, Code2,
  MessageCircle, Cpu, ScanSearch, Handshake, Link2, Layers,
  ShoppingCart, Building2, Gift, MoreHorizontal, PlusCircle,
  CreditCard, DollarSign, Calendar, CalendarDays, Eye, Settings2,
}

export const ICON_OPTIONS = Object.keys(ICON_MAP)

export function getIcon(name: string | null | undefined, fallback: LucideIcon = Star): LucideIcon {
  return (name && ICON_MAP[name]) || fallback
}
