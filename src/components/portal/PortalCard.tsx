import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PortalCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  headerAction?: ReactNode;
}

const PortalCard = ({ 
  children, 
  className, 
  title, 
  subtitle, 
  icon,
  headerAction 
}: PortalCardProps) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-portal-card-border shadow-portal-card transition-shadow duration-200 hover:shadow-portal-card-hover",
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center justify-between p-5 pb-0">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  {icon}
                </div>
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-portal-header">{title}</h3>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {headerAction}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default PortalCard;
