export const applyFilter = (filterKey, selectedOptions) => {
  return function(workout) {
    const intersection = workout[filterKey].filter((id) => {
      return selectedOptions.indexOf(id) !== -1
    })
    return intersection.length === workout[filterKey].length;
  }
}