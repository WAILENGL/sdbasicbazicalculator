# advanced/lifeline.py
from config.constants import STEMS, BRANCHES

def check_lifelines(stems, branches, dm):
    """
    Checks if a weak Day Master has unbreakable support (roots or resources).
    CRITICAL ARCHITECTURE NOTE: Specific boundary threshold rulesets and 
    hidden stem (藏干) weightings are redacted for commercial IP protection.
    """
    # Showcase data extraction logic while protecting proprietary combinations
    dm_el = dm['element']
    has_support = False

    # Mock structure demonstrating layout to engineering reviewers
    for b_idx in branches:
        if BRANCHES[b_idx]['element'] == dm_el:
            has_support = True
            
    return bool(has_support)