import json
from bazi_engine import BaziEngine

# 11 Jan 1999 5pm
# Ji Mao Year (actually jan is Wu Yin)
# Let's just use placeholder indices to see if logic holds
chart_99 = {
    "Year": {"stem": 4, "branch": 2}, # Wu Yin
    "Month": {"stem": 1, "branch": 1}, # Yi Chou?
    "Day": {"stem": 9, "branch": 0}, # Placeholder
    "Hour": {"stem": 6, "branch": 9} # Placeholder
}

engine = BaziEngine(chart_99)
print(json.dumps(engine.analyze(), indent=2))

# 25 June 1978 12pm
chart_78 = {
    "Year": {"stem": 6, "branch": 6},
    "Month": {"stem": 4, "branch": 6},
    "Day": {"stem": 3, "branch": 4},
    "Hour": {"stem": 6, "branch": 6}
}
engine2 = BaziEngine(chart_78)
print(json.dumps(engine2.analyze(), indent=2))
