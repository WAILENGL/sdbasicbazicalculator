# config/constants.py

STEMS = [
    {"pinyin": "Jia", "hanzi": "甲", "element": "Wood", "polarity": "+", "id": 0},
    {"pinyin": "Yi", "hanzi": "乙", "element": "Wood", "polarity": "-", "id": 1},
    {"pinyin": "Bing", "hanzi": "丙", "element": "Fire", "polarity": "+", "id": 2},
    {"pinyin": "Ding", "hanzi": "丁", "element": "Fire", "polarity": "-", "id": 3},
    {"pinyin": "Wu", "hanzi": "戊", "element": "Earth", "polarity": "+", "id": 4},
    {"pinyin": "Ji", "hanzi": "己", "element": "Earth", "polarity": "-", "id": 5},
    {"pinyin": "Geng", "hanzi": "庚", "element": "Metal", "polarity": "+", "id": 6},
    {"pinyin": "Xin", "hanzi": "辛", "element": "Metal", "polarity": "-", "id": 7},
    {"pinyin": "Ren", "hanzi": "壬", "element": "Water", "polarity": "+", "id": 8},
    {"pinyin": "Gui", "hanzi": "癸", "element": "Water", "polarity": "-", "id": 9},
]

BRANCHES = [
    {"pinyin": "Zi", "hanzi": "子", "element": "Water", "animal": "Rat", "hidden": [9], "id": 0},
    {"pinyin": "Chou", "hanzi": "丑", "element": "Earth", "animal": "Ox", "hidden": [9, 7, 5], "id": 1},
    {"pinyin": "Yin", "hanzi": "寅", "element": "Wood", "animal": "Tiger", "hidden": [4, 2, 0], "id": 2},
    {"pinyin": "Mao", "hanzi": "卯", "element": "Wood", "animal": "Rabbit", "hidden": [1], "id": 3},
    {"pinyin": "Chen", "hanzi": "辰", "element": "Earth", "animal": "Dragon", "hidden": [1, 9, 4], "id": 4},
    {"pinyin": "Si", "hanzi": "巳", "element": "Fire", "animal": "Snake", "hidden": [4, 6, 2], "id": 5},
    {"pinyin": "Wu", "hanzi": "午", "element": "Fire", "animal": "Horse", "hidden": [3, 5], "id": 6},
    {"pinyin": "Wei", "hanzi": "未", "element": "Earth", "animal": "Goat", "hidden": [3, 1, 5], "id": 7},
    {"pinyin": "Shen", "hanzi": "申", "element": "Metal", "animal": "Monkey", "hidden": [4, 8, 6], "id": 8},
    {"pinyin": "You", "hanzi": "酉", "element": "Metal", "animal": "Rooster", "hidden": [7], "id": 9},
    {"pinyin": "Xu", "hanzi": "戌", "element": "Earth", "animal": "Dog", "hidden": [7, 3, 4], "id": 10},
    {"pinyin": "Hai", "hanzi": "亥", "element": "Water", "animal": "Pig", "hidden": [4, 0, 8], "id": 11},
]

ELEMENT_CYCLES = {
    "Wood": {"produces": "Fire", "controls": "Earth", "producedBy": "Water", "controlledBy": "Metal"},
    "Fire": {"produces": "Earth", "controls": "Metal", "producedBy": "Wood", "controlledBy": "Water"},
    "Earth": {"produces": "Metal", "controls": "Water", "producedBy": "Fire", "controlledBy": "Wood"},
    "Metal": {"produces": "Water", "controls": "Wood", "producedBy": "Earth", "controlledBy": "Fire"},
    "Water": {"produces": "Wood", "controls": "Fire", "producedBy": "Metal", "controlledBy": "Earth"},
}

# 3-Harmony Sets (San He)
HARMONY_SETS = [
    {"el": "Water", "members": [8, 0, 4], "opposing_months": [5, 6, 7]}, # Shen Zi Chen
    {"el": "Wood", "members": [11, 3, 7], "opposing_months": [8, 9, 10]}, # Hai Mao Wei
    {"el": "Fire", "members": [2, 6, 10], "opposing_months": [11, 0, 1]}, # Yin Wu Xu
    {"el": "Metal", "members": [5, 9, 1], "opposing_months": [2, 3, 4]}  # Si You Chou
]

# Directional Sets (San Hui)
DIRECTIONAL_SETS = [
    {"el": "Water", "members": [11, 0, 1]},
    {"el": "Wood", "members": [2, 3, 4]},
    {"el": "Fire", "members": [5, 6, 7]},
    {"el": "Metal", "members": [8, 9, 10]}
]

# Tiao Hou Reference Tables
TIAO_HOU_TABLE = {
    "Cold": [11, 0, 1],
    "Hot": [5, 6, 7]
}

NAYIN_MAPPING = {
    "Jia Zi": "Sea Gold", "Yi Chou": "Sea Gold", "Bing Yin": "Fire in the Stove", "Ding Mao": "Fire in the Stove",
    "Wu Chen": "Great Forest Wood", "Ji Si": "Great Forest Wood", "Geng Wu": "Roadside Earth", "Xin Wei": "Roadside Earth",
    "Ren Shen": "Sword Gold", "Gui You": "Sword Gold", "Jia Xu": "Fire on the Mountain", "Yi Hai": "Fire on the Mountain",
    "Bing Zi": "Cave Water", "Ding Chou": "Cave Water", "Wu Yin": "Earth on the Rampart", "Ji Mao": "Earth on the Rampart",
    "Geng Chen": "White Wax Gold", "Xin Si": "White Wax Gold", "Ren Wu": "Poplar Wood", "Gui Wei": "Poplar Wood",
    "Jia Shen": "Spring Water", "Yi You": "Spring Water", "Bing Xu": "Roof Tile Earth", "Ding Hai": "Roof Tile Earth",
    "Wu Zi": "Thunder Fire", "Ji Chou": "Thunder Fire", "Geng Yin": "Conifer Wood", "Xin Mao": "Conifer Wood",
    "Ren Chen": "Great River Water", "Gui Si": "Great River Water", "Jia Wu": "Sand Gold", "Yi Wei": "Sand Gold",
    "Bing Shen": "Fire under the Mountain", "Ding You": "Fire under the Mountain", "Wu Xu": "Lawn Wood", "Ji Hai": "Lawn Wood",
    "Geng Zi": "Wall Earth", "Xin Chou": "Wall Earth", "Ren Yin": "Golden Foil Gold", "Gui Mao": "Golden Foil Gold",
    "Jia Chen": "Lamp Fire", "Yi Si": "Lamp Fire", "Bing Wu": "Heaven River Water", "Ding Wei": "Heaven River Water",
    "Wu Shen": "Great Land Earth", "Ji You": "Great Land Earth", "Geng Xu": "Temple Gold", "Xin Hai": "Temple Gold",
    "Ren Zi": "Mulberry Wood", "Gui Chou": "Mulberry Wood", "Jia Yin": "Stream Water", "Yi Mao": "Stream Water",
    "Bing Chen": "Sand Earth", "Ding Si": "Sand Earth", "Wu Wu": "Fire in the Sky", "Ji Wei": "Fire in the Sky",
    "Geng Shen": "Pomegranate Wood", "Xin You": "Pomegranate Wood", "Ren Xu": "Ocean Water", "Gui Hai": "Ocean Water"
}

HEXAGRAM_MAPPING = {
    "Jia Zi": "02. Kun (Earth)", "Yi Chou": "24. Fu (Return)", "Bing Yin": "19. Lin (Approach)", "Ding Mao": "11. Tai (Peace)",
    "Wu Chen": "34. Da Zhuang (Great Power)", "Ji Si": "43. Guai (Resolution)", "Geng Wu": "01. Qian (Heaven)", "Xin Wei": "44. Gou (Encounter)",
    "Ren Shen": "33. Dun (Retreat)", "Gui You": "12. Pi (Stagnation)", "Jia Xu": "20. Guan (Contemplation)", "Yi Hai": "23. Bo (Splitting Apart)",
    "Bing Zi": "02. Kun (Earth) - Cycle", "Ding Chou": "24. Fu (Return) - Cycle", "Wu Yin": "19. Lin (Approach) - Cycle", "Ji Mao": "11. Tai (Peace) - Cycle",
    "Geng Chen": "34. Da Zhuang (Great Power) - Cycle", "Xin Si": "43. Guai (Resolution) - Cycle", "Ren Wu": "01. Qian (Heaven) - Cycle", "Gui Wei": "44. Gou (Encounter) - Cycle",
    "Jia Shen": "33. Dun (Retreat) - Cycle", "Yi You": "12. Pi (Stagnation) - Cycle", "Bing Xu": "20. Guan (Contemplation) - Cycle", "Ding Hai": "23. Bo (Splitting Apart) - Cycle",
    "Wu Zi": "02. Kun (Earth) - Cycle B", "Ji Chou": "24. Fu (Return) - Cycle B", "Geng Yin": "19. Lin (Approach) - Cycle B", "Xin Mao": "11. Tai (Peace) - Cycle B",
    "Ren Chen": "34. Da Zhuang (Great Power) - Cycle B", "Gui Si": "43. Guai (Resolution) - Cycle B", "Jia Wu": "01. Qian (Heaven) - Cycle B", "Yi Wei": "44. Gou (Encounter) - Cycle B",
    "Bing Shen": "33. Dun (Retreat) - Cycle B", "Ding You": "12. Pi (Stagnation) - Cycle B", "Wu Xu": "20. Guan (Contemplation) - Cycle B", "Ji Hai": "23. Bo (Splitting Apart) - Cycle B",
    "Geng Zi": "02. Kun (Earth) - Cycle C", "Xin Chou": "24. Fu (Return) - Cycle C", "Ren Yin": "19. Lin (Approach) - Cycle C", "Gui Mao": "11. Tai (Peace) - Cycle C",
    "Jia Chen": "34. Da Zhuang (Great Power) - Cycle C", "Yi Si": "43. Guai (Resolution) - Cycle C", "Bing Wu": "01. Qian (Heaven) - Cycle C", "Ding Wei": "44. Gou (Encounter) - Cycle C",
    "Wu Shen": "33. Dun (Retreat) - Cycle C", "Ji You": "12. Pi (Stagnation) - Cycle C", "Geng Xu": "20. Guan (Contemplation) - Cycle C", "Xin Hai": "23. Bo (Splitting Apart) - Cycle C",
    "Ren Zi": "02. Kun (Earth) - Cycle D", "Gui Chou": "24. Fu (Return) - Cycle D", "Jia Yin": "19. Lin (Approach) - Cycle D", "Yi Mao": "11. Tai (Peace) - Cycle D",
    "Bing Chen": "34. Da Zhuang (Great Power) - Cycle D", "Ding Si": "43. Guai (Resolution) - Cycle D", "Wu Wu": "01. Qian (Heaven) - Cycle D", "Ji Wei": "44. Gou (Encounter) - Cycle D",
    "Geng Shen": "33. Dun (Retreat) - Cycle D", "Xin You": "12. Pi (Stagnation) - Cycle D", "Ren Xu": "20. Guan (Contemplation) - Cycle D", "Gui Hai": "23. Bo (Splitting Apart) - Cycle D"
}

# The 12 Growth Phases (Chang Sheng matrix)
# Columns: Zi, Chou, Yin, Mao, Chen, Si, Wu, Wei, Shen, You, Xu, Hai
GROWTH_PHASES = {
    "Jia": ["Bathing", "Crowning", "Growth", "Emperor", "衰 (Declining)", "Sick", "Dead", "Tomb", "Jue (Cut)", "胎 (Embryo)", "Nuturing", "Death"],
    "Yi": ["Sick", "衰 (Declining)", "Emperor", "Growth", "Crowning", "Bathing", "Death", "Nuturing", "胎 (Embryo)", "Jue (Cut)", "Tomb", "Dead"],
    "Bing": ["胎 (Embryo)", "Nuturing", "Growth", "Bathing", "Crowning", "Emperor", "衰 (Declining)", "Sick", "Dead", "Tomb", "Jue (Cut)", "Death"],
    "Ding": ["Jue (Cut)", "Tomb", "Dead", "Sick", "衰 (Declining)", "Emperor", "Crowning", "Bathing", "Growth", "Death", "Nuturing", "胎 (Embryo)"],
    "Wu": ["胎 (Embryo)", "Nuturing", "Growth", "Bathing", "Crowning", "Emperor", "衰 (Declining)", "Sick", "Dead", "Tomb", "Jue (Cut)", "Death"],
    "Ji": ["Jue (Cut)", "Tomb", "Dead", "Sick", "衰 (Declining)", "Emperor", "Crowning", "Bathing", "Growth", "Death", "Nuturing", "胎 (Embryo)"],
    "Geng": ["Dead", "Tomb", "Jue (Cut)", "胎 (Embryo)", "Nuturing", "Growth", "Bathing", "Crowning", "Emperor", "衰 (Declining)", "Sick", "Death"],
    "Xin": ["Growth", "Death", "Nuturing", "胎 (Embryo)", "Jue (Cut)", "Tomb", "Dead", "Sick", "衰 (Declining)", "Emperor", "Crowning", "Bathing"],
    "Ren": ["Emperor", "衰 (Declining)", "Sick", "Dead", "Tomb", "Jue (Cut)", "胎 (Embryo)", "Nuturing", "Growth", "Bathing", "Crowning", "Death"],
    "Gui": ["Crowning", "Bathing", "Growth", "Death", "Nuturing", "胎 (Embryo)", "Jue (Cut)", "Tomb", "Dead", "Sick", "衰 (Declining)", "Emperor"]
}

SHEN_SHA_RULES = {
    "Peach Blossom": {"derived_from": "Day/Year Branch", "map": {0: 9, 1: 6, 2: 3, 3: 0, 4: 9, 5: 6, 6: 3, 7: 0, 8: 9, 9: 6, 10: 3, 11: 0}},
    "Traveling Horse": {"derived_from": "Day/Year Branch", "map": {0: 2, 4: 2, 8: 2, 1: 5, 5: 5, 9: 5, 2: 8, 6: 8, 10: 8, 3: 11, 7: 11, 11: 11}},
    "Academic Star": {"derived_from": "Day Master", "map": {"Jia": 5, "Yi": 6, "Bing": 8, "Ding": 9, "Wu": 8, "Ji": 9, "Geng": 11, "Xin": 0, "Ren": 2, "Gui": 3}},
    "Heavenly Noble": {"derived_from": "Day Master", "map": {"Jia": [1, 7], "Yi": [0, 8], "Bing": [9, 11], "Ding": [9, 11], "Wu": [1, 7], "Ji": [0, 8], "Geng": [1, 7], "Xin": [2, 6], "Ren": [3, 5], "Gui": [3, 5]}},
    "Yang Ren": {"derived_from": "Day Master", "map": {"Jia": 3, "Yi": 4, "Bing": 6, "Ding": 7, "Wu": 6, "Ji": 7, "Geng": 9, "Xin": 10, "Ren": 0, "Gui": 1}},
    "Lu Star": {"derived_from": "Day Master", "map": {"Jia": 2, "Yi": 3, "Bing": 5, "Ding": 6, "Wu": 5, "Ji": 6, "Geng": 8, "Xin": 9, "Ren": 11, "Gui": 0}},
}
