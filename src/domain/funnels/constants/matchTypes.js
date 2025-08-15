export const MATCH_TYPES = {
  EXACT: 'EXACT',
  CONTAINS: 'CONTAINS',
  BEGINS_WITH: 'BEGINS_WITH',
  ENDS_WITH: 'ENDS_WITH'
}

export const MATCH_TYPE_OPTIONS = [
  { 
    value: MATCH_TYPES.EXACT, 
    label: 'Exact match',
    description: 'Select from results below',
    requiresSelection: true
  },
  { 
    value: MATCH_TYPES.CONTAINS, 
    label: 'Contains',
    description: 'Enter text that the page path should contain',
    requiresSelection: false
  },
  { 
    value: MATCH_TYPES.BEGINS_WITH, 
    label: 'Begins with',
    description: 'Enter text that the page path should start with',
    requiresSelection: false
  },
  { 
    value: MATCH_TYPES.ENDS_WITH, 
    label: 'Ends with',
    description: 'Enter text that the page path should end with',
    requiresSelection: false
  }
]

export const getMatchTypeConfig = (matchType) => {
  return MATCH_TYPE_OPTIONS.find(option => option.value === matchType) || MATCH_TYPE_OPTIONS[0]
}
