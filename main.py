# main.py
import sys
import json
from typing import List, Dict, Any, Optional
from config.constants import STEMS, BRANCHES, ELEMENT_CYCLES
from core.base_calc import (
    get_rel, get_strength_score, get_element_of_role,
    calculate_element_percentages, calculate_ten_gods_percentages,
    get_12_growth_phase, get_nayin, get_hexagram, calculate_shen_sha
)
from advanced.lifeline import check_lifelines
from advanced.structure import check_transformation, identify_structure
from advanced.pathology import (
    calculate_element_favorability, identify_flows, 
    identify_patterns, analyze_mechanics
)

class BaziEngine:
    def __init__(self, chart: Dict[str, Any]):
        self.chart = chart
        self.pillar_keys = ['Year', 'Month', 'Day', 'Hour']
        self.stems = [chart[p]['stem'] for p in self.pillar_keys]
        self.branches = [chart[p]['branch'] for p in self.pillar_keys]
        self.dm_idx = self.stems[2]
        self.dm = STEMS[self.dm_idx]
        self.ten_gods = [get_rel(self.dm['element'], STEMS[s]['element'], self.dm['polarity'], STEMS[s]['polarity']) for s in self.stems]

    def analyze(self) -> Dict[str, Any]:
        # 1. Framework & Frame check for mutations
        active_frames = check_transformation(self.stems, self.branches, self.dm, self.dm_idx)
        branch_overrides = active_frames if isinstance(active_frames, list) else None
        
        # 2. Strength & Metrics
        score = get_strength_score(self.stems, self.branches, self.dm, branch_overrides)
        el_percentages = calculate_element_percentages(self.stems, self.branches, branch_overrides)
        tg_percentages = calculate_ten_gods_percentages(self.dm['element'], el_percentages)
        
        # 3. Lifeline & Status
        has_lifelines = check_lifelines(self.stems, self.branches, self.dm)
        is_follower = score < 20 and not has_lifelines
        is_strong = score >= 50
        
        # 4. Favorability (Tiao Hou + Balance)
        fav_dict = calculate_element_favorability(score, is_strong, self.dm['element'], self.branches[1], self.stems, self.branches, self.ten_gods)
        
        favorable_list = []
        unfavorable_list = []
        tiao_hou_list = []
        fav_reasons = []
        for el, data in fav_dict.items():
            if data['score'] > 0:
                favorable_list.append({"element": el, "role": data['role']})
                if data['is_regulator']: tiao_hou_list.append({"element": el, "reason": data['reason']})
            elif data['score'] < 0:
                unfavorable_list.append({"element": el, "role": data['role']})
            if data['reason'] and not data['is_regulator']: fav_reasons.append(data['reason'])

        # 5. Structure & Pathology
        struct = identify_structure(score, is_follower, self.stems, self.branches, self.dm, self.dm_idx, self.ten_gods, has_lifelines)
        flows = identify_flows(self.stems, self.branches, self.dm, self.ten_gods, is_strong, score)
        patterns = identify_patterns(self.stems, self.branches, self.dm)
        mechanics = analyze_mechanics(self.branches)
        
        # 6. Pillar Breakdown (New requested feature)
        pillar_breakdown = {}
        for i, key in enumerate(self.pillar_keys):
            s_idx = self.stems[i]
            b_idx = self.branches[i]
            pillar_str = f"{STEMS[s_idx]['pinyin']} {BRANCHES[b_idx]['pinyin']}"
            
            pillar_breakdown[key] = {
                "stem": STEMS[s_idx],
                "branch": BRANCHES[b_idx],
                "ten_god": get_rel(self.dm['element'], STEMS[s_idx]['element'], self.dm['polarity'], STEMS[s_idx]['polarity']),
                "growth_phase_stem": get_12_growth_phase(s_idx, b_idx),
                "growth_phase_dm": get_12_growth_phase(self.dm_idx, b_idx),
                "nayin": get_nayin(s_idx, b_idx),
                "hexagram": get_hexagram(s_idx, b_idx),
                "shen_sha": calculate_shen_sha(self.dm, self.dm_idx, self.branches[0], self.branches[2], b_idx)
            }

        classification = "Strong" if is_strong else ("Extremely Weak" if is_follower else "Weak")
        yong_shen_el = max(fav_dict.keys(), key=lambda x: fav_dict[x]['score'])

        return {
            "day_master": {
                "element": self.dm['element'],
                "polarity": self.dm['polarity'],
                "status": classification
            },
            "metrics": {
                "strength_score": score,
                "elements_percentage": el_percentages,
                "ten_gods_percentage": tg_percentages
            },
            "structure": struct,
            "pillar_breakdown": pillar_breakdown,
            "yong_shen": yong_shen_el,
            "favorability": {
                "favorable": favorable_list,
                "unfavorable": unfavorable_list,
                "tiao_hou_favorable": tiao_hou_list,
                "reasons": fav_reasons
            },
            "flows": flows,
            "mechanics": mechanics,
            "patterns": patterns
        }

if __name__ == "__main__":
    # Read from stdin for communication with server.ts
    try:
        input_data = sys.stdin.read()
        if input_data:
            chart = json.loads(input_data)
            engine = BaziEngine(chart)
            result = engine.analyze()
            print(json.dumps(result))
        else:
            # Fallback for manual testing or empty input
            pass
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

