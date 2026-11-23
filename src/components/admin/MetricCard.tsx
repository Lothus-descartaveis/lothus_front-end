import React from 'react';
import { TrendingUp, TrendingDown } from '../ui/Icon';

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  percentageChange?: number;
  icon: React.ElementType;
  iconColor?: string;
  iconBgColor?: string;
  comparisonLabel?: string;
  formatAsCurrency?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  previousValue,
  percentageChange,
  icon: IconComponent,
  iconColor = 'text-[#0F668E]',
  iconBgColor = 'bg-[#0F668E]/10',
  comparisonLabel = 'vs. período anterior',
}) => {
  const isPositive = percentageChange !== undefined ? percentageChange >= 0 : true;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-2xs hover:shadow-card hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {title}
          </span>
          <h3 className="font-display font-black text-2xl text-[#041B38] tracking-tight">
            {value}
          </h3>
        </div>

        <div className={`w-11 h-11 rounded-xl ${iconBgColor} flex items-center justify-center shrink-0`}>
          <IconComponent className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>

      {percentageChange !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            {isPositive ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <TrendingUp className="w-3.5 h-3.5" />
                +{percentageChange}%
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                <TrendingDown className="w-3.5 h-3.5" />
                {percentageChange}%
              </span>
            )}
            <span className="text-slate-400 font-normal">{comparisonLabel}</span>
          </div>

          {previousValue !== undefined && (
            <span className="text-slate-400 font-medium text-[11px] hidden sm:inline">
              Ant: {previousValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
