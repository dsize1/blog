const getRest = (collection, section) => Object.entries(collection).reduce((result, [key, val]) => {
    if (!section.hasOwnProperty(key)) result[key] = val
    return result
  }, {})

export default getRest 
