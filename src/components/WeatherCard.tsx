import { normalFor, normalIcon, weatherIcon } from '../lib/weather';
import { useStore } from '../store/useStore';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Weather for one dated day: the live Orlando forecast when the date is inside
 * the forecast window, otherwise Orlando climate normals ("typical for July").
 * Renders nothing for undated days.
 */
export function WeatherCard({ date }: { date?: string }) {
  const forecast = useStore((s) => (date ? s.weather[date] : undefined));
  const normal = date ? normalFor(date) : null;
  const w = forecast ?? normal;
  if (!date || !w) return null;

  const isForecast = w.source === 'forecast';
  const icon = isForecast ? weatherIcon(w.code).icon : normalIcon(w.rainPct);
  const label = isForecast ? weatherIcon(w.code).label : 'Typical';
  const month = MONTHS[Number(date.slice(5, 7)) - 1];

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-700">
          {w.hi}° <span className="text-slate-400">/ {w.lo}°</span>
          <span className="ml-2 text-xs font-normal text-slate-500">{label}</span>
        </p>
        <p className="text-[11px] text-slate-400">
          {isForecast ? (
            <>
              Forecast
              {typeof w.precipProb === 'number' && <> · {w.precipProb}% rain</>}
            </>
          ) : (
            <>
              Typical for {month}
              {typeof w.rainPct === 'number' && <> · rain ~{w.rainPct}% of days</>} · forecast
              closer in
            </>
          )}
        </p>
      </div>
    </div>
  );
}
