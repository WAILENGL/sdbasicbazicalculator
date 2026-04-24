import { useState, useMemo, useEffect } from 'react';
import { CORRECT_STEMS as stems, BRANCHES as branches, ELEMENT_CYCLES as elementCycles } from './constants';
import { Solar, EightChar } from 'lunar-typescript';

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

export default function App() {
  const [state, setState] = useState<State>({
    Name: 'Random Person',
    Gender: 'M',
    BirthDate: '1990-01-01',
    BirthTime: '12:00',
    Timezone: 8,
    Year: { stem: 0, branch: 0 },
    Month: { stem: 0, branch: 0 },
    Day: { stem: 0, branch: 0 },
    Hour: { stem: 0, branch: 0 },
    CurrentYear: { stem: 2, branch: 6 }, // 2026 Bing Wu
    CurrentLuck: { stem: 0, branch: 0 },
    LuckStartAge: 0,
    LuckStartYear: 0,
    Info: { Year: '-', Month: '-', Day: '-', Hour: '-' },
  });

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
      const hP = ec.getTime();

      const yearPillar = { stem: getGanIdx(yP.substring(0, 1)), branch: getZhiIdx(yP.substring(1, 2)) };
      const monthPillar = { stem: getGanIdx(mP.substring(0, 1)), branch: getZhiIdx(mP.substring(1, 2)) };
      const dayPillar = { stem: getGanIdx(dP.substring(0, 1)), branch: getZhiIdx(dP.substring(1, 2)) };
      const hourPillar = { stem: getGanIdx(hP.substring(0, 1)), branch: getZhiIdx(hP.substring(1, 2)) };

      // Luck Pillars
      const yun = ec.getYun(state.Gender === 'M' ? 1 : 0);
      const daYunList = yun.getDaYun();
      const firstDaYun = daYunList[0];
      const startAge = firstDaYun ? firstDaYun.getStartAge() : 0;
      const startYear = firstDaYun ? firstDaYun.getStartYear() : 0;

      // Current Year (2026 for now as default, but ideally dynamic)
      const now = new Date();
      const currentSolar = Solar.fromDate(now);
      const currentLunar = currentSolar.getLunar();
      const currentEightChar = currentLunar.getEightChar() as any;
      const cYP = currentEightChar.getYear();
      const currentYearPillar = { stem: getGanIdx(cYP.substring(0, 1)), branch: getZhiIdx(cYP.substring(1, 2)) };

      setState(prev => ({
        ...prev,
        Year: yearPillar,
        Month: monthPillar,
        Day: dayPillar,
        Hour: hourPillar,
        CurrentYear: currentYearPillar,
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

  const dmIndex = state.Day.stem;

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
      
      return yun.getDaYun().slice(0, 10).map((lp: any) => ({
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
      <h1 className="mx-auto">Scripting Destiny: Core Parameters</h1>

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
              <label className="text-text-dim uppercase text-xs tracking-widest">Timezone (GMT)</label>
              <input 
                type="number" 
                value={state.Timezone} 
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : parseInt(e.target.value);
                  updateGlobal('Timezone', val);
                }} 
                className="w-24" 
                placeholder="+8"
              />
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
          {/* Dashboard Block: Natal Chart */}
          <div className="flex bg-bg-panel/30 border border-border-main p-6 rounded-sm relative overflow-hidden group hover:border-text-main/20 transition-colors">
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-text-dim/5 text-6xl font-bold tracking-[0.5em] pointer-events-none select-none uppercase">
              Natal
            </div>
            
            <div className="flex flex-col items-center ml-4">
              <div className="text-sm text-text-main font-bold uppercase tracking-[0.2em] mb-6 opacity-90">Natal Chart Configuration</div>
              <div className="flex gap-4">
                {(['Year', 'Month', 'Day', 'Hour'] as Array<'Year'|'Month'|'Day'|'Hour'>).map((pillarKey) => {
                  const p = state[pillarKey];
                  const s = stems[p.stem];
                  const b = branches[p.branch];
                  const isDM = pillarKey === 'Day';
                  const polarityString = s?.polarity === '+' ? 'Yang' : 'Yin';

                  if (!s || !b) return null;

                  return (
                    <div key={pillarKey} className="flex flex-col w-44 gap-2">
                      <div className="text-center text-[10px] text-text-dim uppercase tracking-tighter opacity-70">
                        {pillarKey} {state.Info[pillarKey] && <span className="ml-[1px]">[{state.Info[pillarKey]}]</span>}
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
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-text-dim/5 text-6xl font-bold tracking-[0.5em] pointer-events-none select-none uppercase">
              Time
            </div>
            
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

        <div className="w-full mt-12 bg-bg-panel/50 p-6 border border-border-main rounded-sm flex flex-col items-center">
          <h2 className="border-none text-xl mb-6 w-full text-center">10 Year Luck Pillars (Da Yun)</h2>
          <div className="w-full max-w-[1600px]">
            <div className="flex flex-row-reverse gap-2 w-full">
              {luckPillars.map((lp, i) => {
                const s = stems[lp.stem];
                const b = branches[lp.branch];
                if (!s || !b) return null;

                return (
                  <div key={i} className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="text-center text-text-dim text-[10px] tracking-tighter truncate">
                      {lp.startYear} <span className="opacity-50">AGE {lp.startAge}</span>
                    </div>
                    <div className="bg-bg-dark/50 border border-border-main p-2 rounded-sm flex flex-col items-center h-28 justify-between relative overflow-hidden group hover:border-text-main/30 transition-colors">
                      <div className="ten-god text-[10px] opacity-70 z-10">{getTenGod(dmIndex, lp.stem, 'abbrev')}</div>
                      <div className={`hanzi text-2xl my-0 z-10 ${s.className}`}>{s.hanzi}</div>
                      <div className={`text-[10px] z-10 ${s.className}`}>{s.pinyin}</div>
                    </div>
                    <div className="bg-bg-dark/50 border border-border-main p-2 rounded-sm flex flex-col items-center h-36 justify-start relative group hover:border-text-main/30 transition-colors">
                      <div className={`hanzi text-2xl my-0 ${b.className}`}>{b.hanzi}</div>
                      <div className={`text-[10px] font-bold ${b.className}`}>{b.pinyin}</div>
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
      </div>
    </div>
  );
}
