import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

/**
 * Shared page primitives so every page in the app uses
 * the same header, container, section labels, and card chrome.
 */

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => (
  <div className={cn("min-h-screen pb-24", className)}>
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-7 md:space-y-8">
      {children}
    </div>
  </div>
);

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string | number;
  right?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  showBack = true,
  backTo,
  right,
}) => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === "ar";

  return (
    <header
      className="flex items-center gap-3 sm:gap-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => (backTo !== undefined ? navigate(backTo as any) : navigate(-1))}
          className="shrink-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={isArabic ? "رجوع" : "Back"}
        >
          <ArrowLeft className={cn("h-5 w-5", isArabic && "rotate-180")} />
        </Button>
      )}
      <div className="flex-1 min-w-0">
        {eyebrow && <p className="section-label">{eyebrow}</p>}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </header>
  );
};

interface PageSectionProps {
  icon?: LucideIcon;
  label: string;
  hint?: string;
  accent?: string;
  children: React.ReactNode;
  delay?: number;
}

export const PageSection: React.FC<PageSectionProps> = ({
  icon: Icon,
  label,
  hint,
  accent = "from-primary to-primary/70",
  children,
  delay = 0,
}) => (
  <section
    className="space-y-3 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
    aria-label={label}
  >
    <div className="flex items-center gap-3 px-1">
      {Icon && (
        <div
          className={cn(
            "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm",
            accent
          )}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={2.4} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="section-label leading-none mb-1">{label}</p>
        {hint && (
          <p className="text-[11px] text-muted-foreground/70">{hint}</p>
        )}
      </div>
      <div className="ornate-divider flex-1 max-w-[100px]" aria-hidden="true" />
    </div>
    {children}
  </section>
);

export interface QuickAction {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  gradient?: string;
  ariaLabel?: string;
}

interface QuickActionsRowProps {
  actions: QuickAction[];
  className?: string;
}

/**
 * Persistent quick-jump row used at the top of hub pages
 * (Education, Prayer, etc) to surface the most-used items.
 */
export const QuickActionsRow: React.FC<QuickActionsRowProps> = ({
  actions,
  className,
}) => (
  <div
    className={cn(
      "flex gap-2.5 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory",
      className
    )}
    role="toolbar"
    aria-label="Quick actions"
  >
    {actions.map((action, i) => {
      const Icon = action.icon;
      return (
        <button
          key={`${action.label}-${i}`}
          onClick={action.onClick}
          aria-label={action.ariaLabel || action.label}
          className="press-tile snap-start group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
        >
          <div className="glass-card rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 hover:border-primary/30 smooth-transition min-w-[120px]">
            <div
              className={cn(
                "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-sm group-hover:scale-105 smooth-transition",
                action.gradient || "from-primary to-primary/70"
              )}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4 text-white" strokeWidth={2.4} />
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">
              {action.label}
            </span>
          </div>
        </button>
      );
    })}
  </div>
);

const PageTemplate = {
  Container: PageContainer,
  Header: PageHeader,
  Section: PageSection,
  QuickActions: QuickActionsRow,
};

export default PageTemplate;