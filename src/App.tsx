import { useState, useMemo, useEffect } from 'react';
import { CORRECT_STEMS as stems, BRANCHES as branches, ELEMENT_CYCLES as elementCycles, TIMEZONES } from './constants';
import { Solar, EightChar } from 'lunar-typescript';
import { Brain, Zap, Scale, Layers, Copy, Check } from 'lucide-react';

interface Pillar {
  stem: number;
  branch: number;
}

interface State {
  Name: string;
  Gender: 'M' | 'F';
  BirthDate: string;
  BirthTime: string;
  Timezone: number | '';
  Year: Pillar;
  Month: Pillar;
  Day: Pillar;
  Hour: Pillar;
  CurrentYear: Pillar;
  CurrentLuck: Pillar;
  LuckStartAge: number;
  LuckStartYear: number;
  Info: Record<string, string>;
}

const GAN = '甲乙丙丁戊己庚辛壬癸';
const ZHI = '子丑寅卯辰巳午未申酉戌亥';
const STORAGE_KEY = 'bazi_app_last_inputs';

const DEFAULT_STATE: State = {
  Name: 'Random Person',
  Gender: 'M',
  BirthDate: '1990-01-01',
  BirthTime: '12:00',
  Timezone: 7.5,
  Year: { stem: 0, branch: 0 },
  Month: { stem: 0, branch: 0 },
  Day: { stem: 0, branch: 0 },
  Hour: { stem: 0, branch: 0 },
  CurrentYear: { stem: 2, branch: 6 }, // 2026 Bing Wu
  CurrentLuck: { stem: 0, branch: 0 },
  LuckStartAge: 0,
  LuckStartYear: 0,
  Info: { Year: '-', Month: '-', Day: '-', Hour: '-' },
};

// Helper to get element color class
const getElementBg = (el: string) => {
  const map: Record<string, string> = {
    'Wood': 'bg-wood-yang',
    'Fire': 'bg-fire-yang',
    'Earth': 'bg-earth-yang',
    'Metal': 'bg-metal-yang',
    'Water': 'bg-water-yang'
  };
  return map[el] || 'bg-text-dim/20';
};

const getElementText = (el: string) => {
  const map: Record<string, string> = {
    'Wood': 'text-wood-yang',
    'Fire': 'text-fire-yang',
    'Earth': 'text-earth-yang',
    'Metal': 'text-metal-yang',
    'Water': 'text-water-yang'
  };
  return map[el] || 'text-text-dim';
};

const getSpecificColor = (name: string) => {
  const s = stems.find(s => s.pinyin === name);
  if (s) return getElementText(s.element);
  const b = branches.find(b => b.pinyin === name);
  if (b) return getElementText(b.element);
  return getElementText(name); // fallback to name if it is an element like "Wood"
};

export default function App() {
  const [state, setState] = useState<State>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      } catch (e) {
        return DEFAULT_STATE;
      }
    }
    return DEFAULT_STATE;
  });

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    const inputsToSave = {
      Name: state.Name,
      Gender: state.Gender,
      BirthDate: state.BirthDate,
      BirthTime: state.BirthTime,
      Timezone: state.Timezone
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputsToSave));
  }, [state.Name, state.Gender, state.BirthDate, state.BirthTime, state.Timezone]);

  // Calculate pillars whenever BirthDate, BirthTime, or Timezone changes
  useEffect(() => {
    try {
      const [y, m, d] = state.BirthDate.split('-').map(Number);
      const [hh, mm] = state.BirthTime.split(':').map(Number);
      
      if (!y || !m || !d || state.Timezone === '') return;

      const solar = Solar.fromYmdHms(y, m, d, hh, mm, 0);
      const lunar = solar.getLunar();
      const eightChar = lunar.getEightChar();

      const getGanIdx = (s: string) => GAN.indexOf(s);
      const getZhiIdx = (s: string) => ZHI.indexOf(s);

      const ec = eightChar as any;
      const yP = ec.getYear();
      const mP = ec.getMonth();
      const dP = ec.getDay();
      let hP = ec.getTime();

      const yearPillar = { stem: getGanIdx(yP.substring(0, 1)), branch: getZhiIdx(yP.substring(1, 2)) };
      const monthPillar = { stem: getGanIdx(mP.substring(0, 1)), branch: getZhiIdx(mP.substring(1, 2)) };
      const dayPillar = { stem: getGanIdx(dP.substring(0, 1)), branch: getZhiIdx(dP.substring(1, 2)) };
      
      // Enforce the "Five Rats Finding Hours" (五鼠遁) rule to ensure the hour stem ALWAYS mathematically
      // aligns with the current day stem. This prevents logical mismatches on "Late Rat" hours.
      const hourBranchIdx = getZhiIdx(hP.substring(1, 2));
      const trueHourStemIdx = (dayPillar.stem % 5 * 2 + hourBranchIdx) % 10;
      hP = GAN[trueHourStemIdx] + ZHI[hourBranchIdx]; // Override structural string for downstream JSON consistency
      
      const hourPillar = { stem: trueHourStemIdx, branch: hourBranchIdx };

      // Luck Pillars
      const yun = ec.getYun(state.Gender === 'M' ? 1 : 0);
      const daYunList = yun.getDaYun();
      const firstDaYun = daYunList[0];
      const startAge = firstDaYun ? firstDaYun.getStartAge() : 0;
      const startYear = firstDaYun ? firstDaYun.getStartYear() : 0;

      // Current Year Calculation (Liu Nian)
      const now = new Date();
      const currentSolar = Solar.fromDate(now);
      const currentLunar = currentSolar.getLunar();
      
      const currentYearPillar = { 
        stem: GAN.indexOf(currentLunar.getYearGan()), 
        branch: ZHI.indexOf(currentLunar.getYearZhi()) 
      };

      // Current Luck Pillar (Da Yun)
      const currentYearNum = currentSolar.getYear();
      let activeDaYun = null;
      for (let i = 0; i < daYunList.length; i++) {
        const dy = daYunList[i];
        if (!dy.getGanZhi()) continue;
        if (currentYearNum >= dy.getStartYear() && currentYearNum <= dy.getEndYear()) {
          activeDaYun = dy;
          break;
        }
      }

      const currentLuckPillar = activeDaYun && activeDaYun.getGanZhi() ? {
        stem: GAN.indexOf(activeDaYun.getGanZhi().substring(0, 1)),
        branch: ZHI.indexOf(activeDaYun.getGanZhi().substring(1, 2))
      } : monthPillar; // Fallback to Month Pillar if luck hasn't started

      setState(prev => ({
        ...prev,
        Year: yearPillar,
        Month: monthPillar,
        Day: dayPillar,
        Hour: hourPillar,
        CurrentYear: currentYearPillar,
        CurrentLuck: currentLuckPillar,
        LuckStartAge: startAge,
        LuckStartYear: startYear,
        Info: {
          Year: yP,
          Month: mP,
          Day: dP,
          Hour: hP
        }
      }));
    } catch (e) {
      console.error('Calculation error:', e);
    }
  }, [state.BirthDate, state.BirthTime, state.Timezone, state.Gender]);

  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!analysis) return;
    const data = {
      subject: {
        name: state.Name,
        gender: state.Gender,
        birthDate: state.BirthDate,
        birthTime: state.BirthTime
      },
      chart: {
        year: state.Info.Year,
        month: state.Info.Month,
        day: state.Info.Day,
        hour: state.Info.Hour,
      },
      analysis: analysis
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dmIndex = state.Day.stem;

  useEffect(() => {
    let ignore = false;
    const fetchAnalysis = async () => {
      // Don't fetch if it's the initial placeholder state
      if (state.Year.stem === 0 && state.Year.branch === 0 && 
          state.Month.stem === 0 && state.Month.branch === 0 &&
          state.Hour.stem === 0 && state.Hour.branch === 0) {
        return;
      }

      setLoadingAnalysis(true);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Year: state.Year,
            Month: state.Month,
            Day: state.Day,
            Hour: state.Hour
          })
        });
        const data = await response.json();
        if (!ignore) {
          setAnalysis(data);
        }
      } catch (e) {
        console.error("Analysis fetch failed", e);
      } finally {
        if (!ignore) {
          setLoadingAnalysis(false);
        }
      }
    };
    fetchAnalysis();
    return () => { ignore = true; };
  }, [state.Year, state.Month, state.Day, state.Hour]);

  const getTenGod = (dmStemIndex: number, targetStemIndex: number, format: 'full' | 'abbrev' | 'both' = 'full') => {
    if (targetStemIndex === -1) return '';
    const dm = stems[dmStemIndex];
    const target = stems[targetStemIndex];
    if (!dm || !target) return '';
    
    const samePolarity = dm.polarity === target.polarity;

    let relation = '';
    if (target.element === dm.element)
      relation = samePolarity ? 'Peer|P' : 'Rob Wealth|RW';
    else if (elementCycles[dm.element].produces === target.element)
      relation = samePolarity ? 'Eating God|EG' : 'Hurting Officer|HO';
    else if (elementCycles[dm.element].controls === target.element)
      relation = samePolarity ? 'Indirect Wealth|IW' : 'Direct Wealth|DW';
    else if (elementCycles[dm.element].controlledBy === target.element)
      relation = samePolarity ? '7 Killings|7K' : 'Direct Officer|DO';
    else if (elementCycles[dm.element].producedBy === target.element)
      relation = samePolarity ? 'Indirect Resource|IR' : 'Direct Resource|DR';

    const [full, abbrev] = relation.split('|');

    if (format === 'both') {
      return (
        <>
          {full} <span className="text-text-dim text-sm ml-1">({abbrev})</span>
        </>
      );
    }

    return format === 'abbrev' ? abbrev : full;
  };

  const luckPillars = useMemo(() => {
    try {
      const [y, m, d] = state.BirthDate.split('-').map(Number);
      const [hh, mm] = state.BirthTime.split(':').map(Number);
      const solar = Solar.fromYmdHms(y, m, d, hh, mm, 0);
      const eightChar = solar.getLunar().getEightChar() as any;
      const yun = eightChar.getYun(state.Gender === 'M' ? 1 : 0);
      
      return yun.getDaYun()
        .filter((lp: any) => lp.getGanZhi() && lp.getGanZhi().length === 2)
        .slice(0, 10).map((lp: any) => ({
          stem: GAN.indexOf(lp.getGanZhi().substring(0, 1)),
          branch: ZHI.indexOf(lp.getGanZhi().substring(1, 2)),
          startAge: lp.getStartAge(),
          startYear: lp.getStartYear()
        }));
    } catch (e) {
      return [];
    }
  }, [state.BirthDate, state.BirthTime, state.Gender]);

  const updateGlobal = (key: keyof State, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center px-8 border-b border-border-main/20 py-6">
        <h1 className="m-0">Scripting Destiny: Core Parameters</h1>
        <button
          onClick={copyToClipboard}
          disabled={!analysis || loadingAnalysis}
          className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all
            ${copied ? 'bg-wood-yang text-bg-dark border-wood-yang' : 'bg-bg-panel/40 text-text-dim border-border-main hover:border-text-main/40 hover:text-text-main'}
            border rounded-sm disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Data</span>
            </>
          )}
        </button>
      </div>

      <div className="controls-board mx-auto">
        <div className="flex flex-wrap gap-5 w-full justify-between items-end">
          <div className="flex gap-5 flex-wrap">
            <div className="control-group">
              <label className="text-text-dim uppercase text-xs tracking-widest">Subject Name</label>
              <input 
                type="text" 
                value={state.Name} 
                onChange={(e) => updateGlobal('Name', e.target.value)} 
                className="w-48" 
                placeholder="Name" 
              />
            </div>

            <div className="control-group">
              <label className="text-text-dim uppercase text-xs tracking-widest">Gender</label>
              <select value={state.Gender} onChange={(e) => updateGlobal('Gender', e.target.value)}>
                <option value="M">Male (男)</option>
                <option value="F">Female (女)</option>
              </select>
            </div>

            <div className="control-group">
              <label className="text-text-dim uppercase text-xs tracking-widest">Birth Date</label>
              <input 
                type="date" 
                value={state.BirthDate} 
                onChange={(e) => updateGlobal('BirthDate', e.target.value)} 
                className="w-40" 
              />
            </div>

            <div className="control-group">
              <label className="text-text-dim uppercase text-xs tracking-widest">Birth Time</label>
              <input 
                type="time" 
                value={state.BirthTime} 
                onChange={(e) => updateGlobal('BirthTime', e.target.value)} 
                className="w-32" 
              />
            </div>

            <div className="control-group">
              <label className="text-text-dim uppercase text-xs tracking-widest">Timezone</label>
              <select 
                value={state.Timezone} 
                onChange={(e) => updateGlobal('Timezone', parseFloat(e.target.value))}
                className="w-64"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.label} value={tz.offset}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-text-dim text-xs opacity-50 font-mono">
            AUTOMATIC GAN-ZHI CALCULATION ACTIVE
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1800px] flex flex-col items-center mx-auto transition-all duration-500">
        <div className="text-center text-text-main text-4xl font-bold mb-8 uppercase tracking-[0.25em] w-full">
          {state.Name}
        </div>

        <div className="flex gap-6 w-full items-start justify-center flex-wrap xl:flex-nowrap mb-10 px-4">
        {/* Logo Section */}
      <div 
        className="hidden xl:block relative flex-shrink-0 mr-12 self-center" 
        style={{ width: '10px', height: '350px' }}
        >
          <img 
            src="https://raw.githubusercontent.com/WAILENGL/basic-bazi-calculator/master/Logo.png" 
            alt="BaZi Logo"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 object-contain opacity-90"
            style={{ width: '350px', maxWidth: 'none' }}
          />
        </div>

          {/* Dashboard Block: Natal Chart */}
          <div className="flex bg-bg-panel/30 border border-border-main p-6 rounded-sm relative overflow-hidden group hover:border-text-main/20 transition-colors">
            
            <div className="flex flex-col items-center ml-4">
              <div className="text-sm text-text-main font-bold uppercase tracking-[0.2em] mb-6 opacity-90">Natal Chart Configuration</div>
              <div className="flex gap-4">
                {(['Hour', 'Day', 'Month', 'Year'] as Array<'Year'|'Month'|'Day'|'Hour'>).map((pillarKey) => {
                  const p = state[pillarKey];
                  const s = stems[p.stem];
                  const b = branches[p.branch];
                  const isDM = pillarKey === 'Day';
                  const polarityString = s?.polarity === '+' ? 'Yang' : 'Yin';

                  const getPillarValue = () => {
                    const [y, m, d] = state.BirthDate.split('-');
                    if (pillarKey === 'Year') return y;
                    if (pillarKey === 'Month') return m;
                    if (pillarKey === 'Day') return d;
                    if (pillarKey === 'Hour') {
                      const [h, min] = state.BirthTime.split(':');
                      const hh = parseInt(h);
                      const ampm = hh >= 12 ? 'pm' : 'am';
                      const h12 = hh % 12 || 12;
                      return `${h12}:${min} ${ampm}`;
                    }
                    return '';
                  };

                  if (!s || !b) return null;

                  return (
                    <div key={pillarKey} className="flex flex-col w-44 gap-2">
                      <div className="text-center text-[10px] text-text-dim uppercase tracking-tighter opacity-70">
                        {pillarKey} ({getPillarValue()})
                      </div>
                      <div className={`data-box ${isDM ? 'daymaster-box border-2' : ''} h-36 relative overflow-hidden p-3 bg-bg-dark/40`}>
                        <div className="text-[9px] font-bold text-white tracking-widest uppercase opacity-80">{isDM ? 'Daymaster' : getTenGod(dmIndex, p.stem, 'full')}</div>
                        <div className={`hanzi text-5xl my-2 ${s.className}`}>{s.hanzi}</div>
                        <div className={`${s.className} text-center leading-none z-10 text-[11px]`}>
                          <div>{s.pinyin}</div>
                          <div className="opacity-50 text-[9px] uppercase mt-1">{s.polarity} {s.element}</div>
                        </div>
                      </div>
                      <div className="data-box h-44 p-3 bg-bg-dark/40">
                        <div className={`hanzi text-5xl my-2 ${b.className}`}>{b.hanzi}</div>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className={`${b.className} font-bold text-[11px]`}>{b.pinyin}</div>
                          <div className={`${b.className} text-[9px] opacity-70 uppercase tracking-tighter`}>({b.animal})</div>
                        </div>
                        <div className="hidden-stems mt-2 border-t border-dashed border-border-main/30 pt-2 w-full flex flex-col gap-1">
                          {b.hidden.map((hIdx) => (
                            <div key={hIdx} className={`flex justify-between items-center px-1 ${stems[hIdx].className}`}>
                              <span className="font-bold text-[10px]">{stems[hIdx].hanzi}</span>
                              <span className="text-[8px] opacity-70">{getTenGod(dmIndex, hIdx, 'abbrev')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dashboard Block: Temporal State */}
          <div className="flex bg-bg-panel/30 border border-border-main p-6 rounded-sm relative overflow-hidden group hover:border-text-main/20 transition-colors">
            
            <div className="flex flex-col items-center ml-4">
              <div className="text-sm text-text-main font-bold uppercase tracking-[0.2em] mb-6 opacity-90">Temporal States</div>
              <div className="flex gap-4">
                {[
                  { title: 'Current Luck', subtitle: 'Global Phase', pillar: state.CurrentLuck },
                  { title: 'Current Year', subtitle: 'Active Year', pillar: state.CurrentYear }
                ].map((phase, i) => {
                  const s = stems[phase.pillar.stem];
                  const b = branches[phase.pillar.branch];
                  if (!s || !b) return null;
                  return (
                    <div key={i} className="flex flex-col w-44 gap-2 opacity-90">
                      <div className="text-center text-[10px] text-text-dim uppercase tracking-tighter opacity-70">{phase.title}</div>
                      <div className="data-box h-36 bg-bg-dark/60 border-dashed border-border-main/50 p-3">
                        <div className="text-[10px] font-black text-text-main tracking-widest uppercase opacity-100 italic">{getTenGod(dmIndex, phase.pillar.stem, 'full')}</div>
                        <div className={`hanzi text-5xl my-2 ${s.className}`}>{s.hanzi}</div>
                        <div className={`${s.className} text-[11px]`}>{s.pinyin}</div>
                      </div>
                      <div className="data-box h-44 bg-bg-dark/60 border-dashed border-border-main/50 p-3">
                        <div className={`hanzi text-5xl my-2 ${b.className}`}>{b.hanzi}</div>
                        <div className="flex flex-col items-center gap-0.5">
                          <div className={`${b.className} text-[11px]`}>{b.pinyin}</div>
                          <div className={`${b.className} text-[9px] opacity-60 uppercase tracking-tighter`}>({b.animal})</div>
                        </div>
                        <div className="hidden-stems mt-2 border-t border-dashed border-border-main/30 pt-2 w-full flex flex-col gap-1">
                          {b.hidden.map((hIdx) => (
                            <div key={hIdx} className={`flex justify-between items-center px-1 ${stems[hIdx].className}`}>
                              <span className="font-bold text-[10px]">{stems[hIdx].hanzi}</span>
                              <span className="text-[8px] opacity-70">{getTenGod(dmIndex, hIdx, 'abbrev')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dashboard Block: Elemental Mapping */}
          <div className="flex flex-col bg-bg-panel/30 border border-border-main p-6 rounded-sm h-full self-stretch min-w-[280px] group hover:border-text-main/20 transition-colors">
            <div className="text-sm text-text-main font-bold uppercase tracking-[0.2em] mb-6 opacity-90 text-center">Elemental Mapping</div>
            <div className="flex flex-col gap-2 flex-1 justify-between">
              {['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map((element) => {
                const yangIdx = stems.findIndex(s => s.element === element && s.polarity === '+');
                const yinIdx = stems.findIndex(s => s.element === element && s.polarity === '-');
                const colorClass = `text-${element.toLowerCase()}-yang`;

                return (
                  <div key={element} className="flex flex-col p-2.5 border border-border-main/30 rounded-sm bg-bg-dark/40 hover:bg-bg-dark/60 transition-colors">
                    <strong className={`${colorClass} uppercase mb-1.5 tracking-widest text-[10px]`}>{element}</strong>
                    <div className="text-[10px] w-full flex justify-between mb-1">
                      <span className="text-text-dim/60 font-mono text-[9px]">(+)</span>
                      <span className="text-right font-bold truncate ml-2">{getTenGod(dmIndex, yangIdx, 'full')} <span className="opacity-40 text-[9px]">{stems[yangIdx].pinyin}</span></span>
                    </div>
                    <div className="text-[10px] w-full flex justify-between">
                      <span className="text-text-dim/60 font-mono text-[9px]">(-)</span>
                      <span className="text-right font-bold truncate ml-2">{getTenGod(dmIndex, yinIdx, 'full')} <span className="opacity-40 text-[9px]">{stems[yinIdx].pinyin}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full mb-10 bg-bg-panel/50 p-8 border border-border-main rounded-sm flex flex-col items-center">
          <h2 className="border-none text-2xl font-bold uppercase tracking-[0.2em] mb-10 w-full text-center opacity-90">10 Year Luck Pillars (Da Yun)</h2>
          <div className="w-full max-w-[1600px]">
            <div className="flex flex-row-reverse gap-2 w-full">
              {luckPillars.map((lp, i) => {
                const s = stems[lp.stem];
                const b = branches[lp.branch];
                if (!s || !b) return null;

                return (
                  <div key={i} className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="text-center text-text-dim text-[10px] tracking-tighter truncate mb-1">
                      {lp.startYear} <span className="opacity-50 font-bold ml-1">AGE {lp.startAge}</span>
                    </div>
                    <div className="bg-bg-dark/50 border border-border-main p-2 rounded-sm flex flex-col items-center h-32 justify-between relative overflow-hidden group hover:border-text-main/30 transition-colors">
                      <div className="ten-god text-[10px] font-bold opacity-70 z-10">{getTenGod(dmIndex, lp.stem, 'abbrev')}</div>
                      <div className={`hanzi text-4xl my-0 z-10 ${s.className}`}>{s.hanzi}</div>
                      <div className={`text-[10px] z-10 opacity-80 ${s.className}`}>{s.pinyin}</div>
                    </div>
                    <div className="bg-bg-dark/50 border border-border-main p-2 rounded-sm flex flex-col items-center h-40 justify-start relative group hover:border-text-main/30 transition-colors">
                      <div className={`hanzi text-4xl my-0 ${b.className}`}>{b.hanzi}</div>
                      <div className={`text-[10px] font-bold opacity-80 ${b.className}`}>{b.pinyin}</div>
                      <div className="hidden-stems w-full border-t border-dashed border-border-main/30 pt-1.5 mt-auto flex flex-col gap-0.5">
                        {b.hidden.map((hIdx) => (
                          <div key={hIdx} className={`flex justify-between items-center w-full px-1 ${stems[hIdx].className}`}>
                            <span className="font-bold text-[10px]">{stems[hIdx].hanzi}</span>
                            <span className="text-[9px] opacity-60 uppercase">{getTenGod(dmIndex, hIdx, 'abbrev')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modular Analysis Panel (Python Driven) */}
        <div className="w-full max-w-[1800px] mb-10 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* 1. Structure Analysis */}
            <div className="bg-bg-panel/40 border border-border-main p-5 rounded-sm group hover:border-text-main/30 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-5 h-5 text-water-yin" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-main">Chart Structure</h3>
              </div>
              {analysis && analysis.structure ? (
                <div className="flex flex-col gap-2 flex-1">
                  <div className="text-[10px] text-text-dim/60 uppercase tracking-widest mb-1">Primary Structure</div>
                  <div className="text-2xl font-black text-white italic leading-tight mb-3">{analysis.structure.primary}</div>
                  
                  <div className="flex flex-col gap-4 border-t border-border-main/30 pt-4 mb-4">
                    <div>
                      <div className="text-[9px] text-text-dim uppercase tracking-tighter mb-1 font-bold">Sub-Structure / Usage</div>
                      <div className="text-[11px] text-text-main font-medium">{analysis.structure.sub}</div>
                    </div>
                    
                    <div>
                      <div className="text-[9px] text-text-dim uppercase tracking-tighter mb-1 font-bold">Flow of Qi / Dynamic</div>
                      <div className="text-[11px] text-text-main/70 leading-relaxed italic">
                        "{analysis.structure.dynamic}"
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] text-text-dim uppercase tracking-tighter mb-1 font-bold">Useful God (Yong Shen)</div>
                      <div className="text-[11px] text-wood-yang font-bold uppercase tracking-widest">{analysis.yong_shen}</div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-dashed border-border-main/20">
                    <div className="flex justify-between text-[10px] uppercase text-text-dim mb-1">
                      <span>Qi Capacity ({analysis.strength?.classification})</span>
                      <span className="text-text-main font-bold">{analysis.strength?.score}%</span>
                    </div>
                    <div className="w-full bg-bg-dark h-1.5 justify-start flex">
                      <div 
                        className={`transition-all duration-1000 ${analysis.strength?.is_strong ? 'bg-fire-yang' : 'bg-water-yang'}`} 
                        style={{ width: `${analysis.strength?.score}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse flex flex-col gap-4">
                  {analysis?.error ? (
                    <div className="text-[10px] text-fire-yang uppercase font-bold tracking-widest p-2 border border-fire-yang/20 bg-fire-yang/5 rounded-sm">
                      Analysis Error: {analysis.error}
                    </div>
                  ) : (
                    <>
                      <div className="h-8 bg-bg-dark rounded w-3/4"></div>
                      <div className="h-20 bg-bg-dark rounded"></div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 2. Elemental Favorability */}
            <div className="bg-bg-panel/40 border border-border-main p-5 rounded-sm group hover:border-text-main/30 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-earth-yang" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-main">Favorability</h3>
              </div>
              {analysis && analysis.favorability ? (
                <div className="flex flex-col gap-4 flex-1">
                  <div>
                    <div className="text-[10px] text-wood-yang uppercase tracking-widest mb-2 font-black tracking-widest">Favorable Elements</div>
                    <div className="flex flex-wrap gap-2">
                       {analysis.favorability.favorable.map((f: any, idx: number) => (
                         <div key={idx} className="flex flex-col items-center bg-bg-dark/40 p-2 rounded-sm border border-border-main/20 min-w-[70px]">
                           <span className={`text-[11px] font-bold ${getElementText(f.element)}`}>{f.element}</span>
                           <span className="text-[8px] text-text-dim/70 uppercase tracking-tighter">{f.role}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-fire-yang uppercase tracking-widest mb-2 font-black tracking-widest">Unfavorable Elements</div>
                    <div className="flex flex-wrap gap-2">
                       {analysis.favorability.unfavorable.map((u: any, idx: number) => (
                         <div key={idx} className="flex flex-col items-center bg-bg-dark/40 p-2 rounded-sm border border-border-main/20 min-w-[70px]">
                           <span className={`text-[11px] font-bold ${getElementText(u.element)}`}>{u.element}</span>
                           <span className="text-[8px] text-text-dim/70 uppercase tracking-tighter">{u.role}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  {analysis.favorability.tiao_hou_favorable && analysis.favorability.tiao_hou_favorable.length > 0 && (
                    <div className="pt-4 border-t border-dashed border-border-main/20">
                      <div className="text-[10px] text-water-yang uppercase tracking-widest mb-2 font-black tracking-widest">Climate Regulators (Tiao Hou)</div>
                      <div className="flex flex-col gap-2">
                        {analysis.favorability.tiao_hou_favorable.map((t: any, idx: number) => (
                          <div key={idx} className="flex items-start gap-3 bg-bg-dark/40 p-2 rounded-sm border border-border-main/20">
                            <span className={`text-[11px] font-bold min-w-[45px] ${getElementText(t.element)}`}>{t.element}</span>
                            <span className="text-[9px] text-text-main/70 leading-snug">{t.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.favorability.reasons.length > 0 && (
                     <div className="mt-auto pt-4 border-t border-dashed border-border-main/20">
                        <div className="text-[9px] text-text-dim uppercase tracking-widest mb-2 font-bold opacity-70">Structural Pathologies</div>
                        <div className="flex flex-col gap-2">
                           {analysis.favorability.reasons.map((reason: string, idx: number) => (
                             <div key={idx} className="text-[10px] text-text-main/70 leading-relaxed italic border-l border-border-main/50 pl-2">
                               "{reason}"
                             </div>
                           ))}
                        </div>
                     </div>
                  )}
                </div>
              ) : (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-20 bg-bg-dark rounded"></div>
                  <div className="h-20 bg-bg-dark rounded"></div>
                </div>
              )}
            </div>

            {/* 3. Classical Energy Flows */}
            <div className="bg-bg-panel/40 border border-border-main p-5 rounded-sm group hover:border-text-main/30 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-fire-yang" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-main">Energy Flows</h3>
              </div>
              {analysis && analysis.flows ? (
                <div className="flex flex-col gap-3">
                  {analysis.flows.length > 0 ? (
                    analysis.flows.map((flow: any, i: number) => (
                      <div key={i} className={`flex flex-col gap-1 p-3 border-l-2 ${flow.status === 'Active' ? 'bg-wood-yang/5 border-wood-yang' : 'bg-fire-yang/5 border-fire-yang'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <div className="text-[12px] font-bold text-text-main">{flow.name}</div>
                            {flow.involved ? (
                               <div className="flex gap-2 mt-1">
                                {flow.involved.map((inv: any, idx: number) => {
                                  const isObj = typeof inv === 'object' && inv !== null;
                                  const pinyin = isObj ? inv.pinyin : inv;
                                  const hanzi = isObj ? inv.hanzi : '';
                                  const colorClass = getSpecificColor(pinyin);
                                  return (
                                    <div key={idx} className="flex flex-col items-center">
                                      {hanzi && <span className={`hanzi text-[11px] leading-none mb-0.5 ${colorClass}`}>{hanzi}</span>}
                                      <span className={`text-[8px] font-black uppercase tracking-widest ${colorClass}`}>
                                        {pinyin}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : flow.elements && (
                              <div className="flex gap-2 mt-1">
                                {flow.elements.map((el: string, idx: number) => (
                                  <span key={idx} className={`text-[8px] font-black uppercase tracking-widest ${getElementText(el)}`}>
                                    {el}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className={`text-[8px] uppercase px-1 font-bold ${flow.status === 'Active' ? 'text-wood-yang' : 'text-fire-yang'}`}>{flow.status}</span>
                        </div>
                        <div className="text-[10px] text-text-dim/80 leading-snug mt-1">{flow.desc}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] italic text-text-dim opacity-50 py-4 text-center border border-dashed border-border-main/20">
                      Standard elemental cycle. No complex routing detected.
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-pulse h-40 bg-bg-dark/40 rounded"></div>
              )}
            </div>

            {/* 3. Mythological Patterns */}
            <div className="bg-bg-panel/40 border border-border-main p-5 rounded-sm group hover:border-text-main/30 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-5 h-5 text-metal-yang" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-main">Patterns</h3>
              </div>
              {analysis && analysis.patterns ? (
                <div className="flex flex-col gap-3">
                  {analysis.patterns.length > 0 ? (
                    analysis.patterns.map((pattern: any, i: number) => (
                      <div key={i} className="flex flex-col gap-1.5 p-3 bg-metal-yang/5 border-r-2 border-metal-yang text-right items-end">
                        <div className="flex items-center gap-2">
                          {pattern.involved ? (
                            <div className="flex gap-2">
                              {pattern.involved.map((inv: any, idx: number) => {
                                const isObj = typeof inv === 'object' && inv !== null;
                                const pinyin = isObj ? inv.pinyin : inv;
                                const hanzi = isObj ? inv.hanzi : '';
                                const colorClass = getSpecificColor(pinyin);
                                return (
                                  <div key={idx} className="flex flex-col items-center">
                                    {hanzi && <span className={`hanzi text-[11px] leading-none mb-0.5 ${colorClass}`}>{hanzi}</span>}
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${colorClass}`}>
                                      {pinyin}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : pattern.elements && (
                            <div className="flex gap-2">
                              {pattern.elements.map((el: string, idx: number) => (
                                <span key={idx} className={`text-[8px] font-black uppercase tracking-widest ${getElementText(el)}`}>
                                  {el}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className={`text-[8px] uppercase px-1 font-bold ${pattern.status === 'Auspicious' ? 'text-wood-yang' : 'hidden'}`}>{pattern.status}</span>
                          <div className="text-[12px] font-black text-metal-yin">{pattern.name}</div>
                        </div>
                        <div className="text-[10px] text-text-dim/80 leading-snug">{pattern.desc}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] italic text-text-dim opacity-50 py-4 text-center border border-dashed border-border-main/20">
                      No overriding vertical or climatic patterns detected.
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-pulse h-40 bg-bg-dark/40 rounded"></div>
              )}
            </div>

            {/* 4. Spatial Interactions */}
            <div className="bg-bg-panel/40 border border-border-main p-5 rounded-sm group hover:border-text-main/30 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="w-5 h-5 text-wood-yang" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-main">Mechanics</h3>
              </div>
              <div className="flex flex-col gap-2">
                {analysis && analysis.combinations ? (
                  analysis.combinations.length > 0 ? (
                    analysis.combinations.map((c: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 border border-border-main/50 bg-bg-dark/20 text-[11px]">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                             <span className="font-bold text-text-main">{c.type}</span>
                             {c.involved ? (
                               <div className="flex gap-1.5">
                                 {c.involved.map((inv: any, idx: number) => {
                                   const isObj = typeof inv === 'object' && inv !== null;
                                   const pinyin = isObj ? inv.pinyin : inv;
                                   const hanzi = isObj ? inv.hanzi : '';
                                   const colorClass = getSpecificColor(pinyin);
                                   return (
                                     <div key={idx} className="flex flex-col items-center">
                                       {hanzi && <span className={`hanzi text-[11px] leading-none mb-0.5 ${colorClass}`}>{hanzi}</span>}
                                       <span className={`text-[8px] font-black uppercase tracking-widest ${colorClass}`}>
                                         {pinyin}
                                       </span>
                                     </div>
                                   );
                                 })}
                               </div>
                             ) : c.elements && (
                              <div className="flex gap-1.5">
                                {c.elements.map((el: string, idx: number) => (
                                  <span key={idx} className={`text-[8px] font-black uppercase tracking-widest ${getElementText(el)}`}>
                                    {el}
                                  </span>
                                ))}
                              </div>
                             )}
                          </div>
                          <span className="text-[9px] text-text-dim uppercase tracking-widest">{c.pillars.join(' / ')}</span>
                        </div>
                        <div className="text-fire-yang font-black uppercase text-[10px] italic">
                          {c.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-[11px] italic text-text-dim opacity-50 py-4 text-center border border-dashed border-border-main/20">
                      No adjacent branch collisions detected.
                    </div>
                  )
                ) : (
                  <div className="animate-pulse h-20 bg-bg-dark/20 rounded"></div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
