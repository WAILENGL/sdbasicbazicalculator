# core/base_calc.py
from config.constants import STEMS, BRANCHES, ELEMENT_CYCLES

def get_rel(dm_el, target_el, dp, tp):
    """
    Calculates the 10-God relationship between two elements.
    """
    if dm_el == target_el: return "F" if dp == tp else "RW"
    if ELEMENT_CYCLES[dm_el]["produces"] == target_el: return "EG" if dp == tp else "HO"
    if ELEMENT_CYCLES[dm_el]["controls"] == target_el: return "IW" if dp == tp else "DW"
    if ELEMENT_CYCLES[target_el]["produces"] == dm_el: return "IR" if dp == tp else "DR"
    if ELEMENT_CYCLES[target_el]["controls"] == dm_el: return "7K" if dp == tp else "DO"
    return None

def get_element_weight(stems, branches, element, branch_overrides=None):
    """
    Calculates the mathematical weight of an element in the chart.
    """
    w = 0
    for s_idx in stems:
        if STEMS[s_idx]['element'] == element: w += 10
    for i, b_idx in enumerate(branches):
        el = branch_overrides[i] if branch_overrides and branch_overrides[i] else BRANCHES[b_idx]['element']
        if el == element: w += 30 if i == 1 else 10
    return w

def get_strength_score(stems, branches, dm, branch_overrides=None):
    """
    Calculates the thermodynamic strength of the Day Master based on support from 
    all 4 branches and supporting stems.
    """
    score = 0
    dm_el = dm['element']
    res_el = ELEMENT_CYCLES[dm_el]['producedBy']

    def get_el(idx):
        if branch_overrides and idx < len(branch_overrides) and branch_overrides[idx]:
            return branch_overrides[idx]
        return BRANCHES[branches[idx]]['element']

    # Scoring the 4 Earthly Branches
    # Weights: Month=40, Day=20, Year=10, Hour=10
    branch_weights = {1: 40, 2: 20, 0: 10, 3: 10}
    for b_idx, weight in branch_weights.items():
        el = get_el(b_idx)
        if el == dm_el or el == res_el:
            score += weight

    # Scoring the 3 Supporting Heavenly Stems (Excluding Day Master at Index 2)
    for i, s_idx in enumerate(stems):
        if i == 2: continue
        s_el = STEMS[s_idx]['element']
        if s_el == dm_el or s_el == res_el:
            score += 10 if i == 1 or i == 3 else 5

    return score

def get_involved_item(obj):
    """
    Returns simplified representation of a stem or branch.
    """
    return {"pinyin": obj['pinyin'], "hanzi": obj['hanzi']}

def get_element_of_role(dm_element, role):
    """
    Helper to map a role (e.g., 'Resource') to an element.
    """
    cycle = ELEMENT_CYCLES[dm_element]
    mapping = {
        "Companion": dm_element,
        "Resource": cycle['producedBy'],
        "Output": cycle['produces'],
        "Wealth": cycle['controls'],
        "Authority": cycle['controlledBy'],
        "Power": cycle['controlledBy']
    }
    return mapping.get(role)

def get_involved_of_role(stems, branches, dm, role):
    """
    Returns list of items involved in a specific elemental role.
    """
    target_el = get_element_of_role(dm['element'], role)
    involved = []
    seen = set()
    for s_idx in stems:
        if STEMS[s_idx]['element'] == target_el:
            p = STEMS[s_idx]['pinyin']
            if p not in seen:
                involved.append(get_involved_item(STEMS[s_idx]))
                seen.add(p)
    for b_idx in branches:
        if BRANCHES[b_idx]['element'] == target_el:
            p = BRANCHES[b_idx]['pinyin']
            if p not in seen:
                involved.append(get_involved_item(BRANCHES[b_idx]))
                seen.add(p)
    return sorted(involved, key=lambda x: x['pinyin'])

def calculate_element_percentages(stems, branches, branch_overrides=None):
    """
    Calculates exact thermodynamic weight (percentages) of all 5 elements.
    Accounts for month multiplier (x3) and hidden stem distribution.
    """
    raw_weights = {"Wood": 0, "Fire": 0, "Earth": 0, "Metal": 0, "Water": 0}
    
    # 1. Heavenly Stems (Standard weight: 10 each)
    for s_idx in stems:
        raw_weights[STEMS[s_idx]['element']] += 10
        
    # 2. Earthly Branches (Weighted by position + hidden stems distribution)
    for i, b_idx in enumerate(branches):
        branch = BRANCHES[b_idx]
        hidden = branch['hidden'] # Indices of stems
        
        # Month Branch (Index 1) has a major multiplier
        base_weight = 30 if i == 1 else 10
        
        if branch_overrides and i < len(branch_overrides) and branch_overrides[i]:
            # Structural transformation override
            raw_weights[branch_overrides[i]] += base_weight
        else:
            # Classical Distribution: Main element gets 70%, others share 30%
            if len(hidden) == 1:
                raw_weights[STEMS[hidden[0]]['element']] += base_weight
            elif len(hidden) == 2:
                raw_weights[STEMS[hidden[0]]['element']] += base_weight * 0.7
                raw_weights[STEMS[hidden[1]]['element']] += base_weight * 0.3
            else: # 3 hidden stems
                raw_weights[STEMS[hidden[-1]]['element']] += base_weight * 0.6 # Main is usually last in lists
                raw_weights[STEMS[hidden[0]]['element']] += base_weight * 0.2
                raw_weights[STEMS[hidden[1]]['element']] += base_weight * 0.2
        
    total = sum(raw_weights.values())
    if total == 0: return []
    
    percentages = []
    for el, w in raw_weights.items():
        percentages.append({"element": el, "percentage": round((w / total) * 100, 1)})
    return percentages

def calculate_ten_gods_percentages(dm_element, element_percentages):
    """
    Maps element percentages to 10 God categories.
    """
    mapping = {
        dm_element: "Companion",
        ELEMENT_CYCLES[dm_element]['produces']: "Output",
        ELEMENT_CYCLES[dm_element]['controls']: "Wealth",
        ELEMENT_CYCLES[dm_element]['controlledBy']: "Power",
        ELEMENT_CYCLES[dm_element]['producedBy']: "Resource"
    }
    
    res = []
    # Ensure all categories are present even if 0%
    categories = ["Companion", "Output", "Wealth", "Power", "Resource"]
    cat_weights = {cat: 0 for cat in categories}
    
    for item in element_percentages:
        cat = mapping.get(item['element'])
        if cat:
            cat_weights[cat] = item['percentage']
            
    for cat in categories:
        res.append({
            "category": cat,
            "percentage": cat_weights[cat]
        })
    return res

from config.constants import GROWTH_PHASES, NAYIN_MAPPING, HEXAGRAM_MAPPING, SHEN_SHA_RULES

def get_12_growth_phase(stem_idx, branch_idx):
    stem_name = STEMS[stem_idx]['pinyin']
    return GROWTH_PHASES.get(stem_name, [None]*12)[branch_idx]

def get_nayin(stem_idx, branch_idx):
    key = f"{STEMS[stem_idx]['pinyin']} {BRANCHES[branch_idx]['pinyin']}"
    return NAYIN_MAPPING.get(key, "Unknown")

def get_hexagram(stem_idx, branch_idx):
    key = f"{STEMS[stem_idx]['pinyin']} {BRANCHES[branch_idx]['pinyin']}"
    return HEXAGRAM_MAPPING.get(key, "Standard Hexagram")

def calculate_shen_sha(dm, dm_idx, y_branch, d_branch, target_branch):
    stars = []
    dm_pinyin = STEMS[dm_idx]['pinyin']
    
    # 1. Peach Blossom
    for source in [y_branch, d_branch]:
        if SHEN_SHA_RULES["Peach Blossom"]["map"].get(source) == target_branch:
            if "Peach Blossom (桃花)" not in stars: stars.append("Peach Blossom (桃花)")
            
    # 2. Traveling Horse
    for source in [y_branch, d_branch]:
        if SHEN_SHA_RULES["Traveling Horse"]["map"].get(source) == target_branch:
            if "Traveling Horse (驿马)" not in stars: stars.append("Traveling Horse (驿马)")
            
    # 3. Academic Star
    if SHEN_SHA_RULES["Academic Star"]["map"].get(dm_pinyin) == target_branch:
        stars.append("Academic Star (文昌)")
        
    # 4. Heavenly Noble
    nobles = SHEN_SHA_RULES["Heavenly Noble"]["map"].get(dm_pinyin, [])
    if target_branch in nobles:
        stars.append("Heavenly Noble (天乙贵人)")

    # 5. Yang Ren
    if SHEN_SHA_RULES["Yang Ren"]["map"].get(dm_pinyin) == target_branch:
        stars.append("Sheep Blade (羊刃)")

    # 6. Lu Star
    if SHEN_SHA_RULES["Lu Star"]["map"].get(dm_pinyin) == target_branch:
        stars.append("Prosperity Star (禄神)")
        
    return stars

def is_adjacent(i, j): 
    """Check if two pillar indices are adjacent."""
    return abs(i - j) == 1
