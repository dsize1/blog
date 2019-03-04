const getRelativeTimestamp = (timestamp) => {
  let relativeTime = Math.floor(( Date.now() - timestamp ) / 1000)
  const sec = relativeTime % 60
  relativeTime /= 60
  if (relativeTime < 1) return `${Math.floor(sec)}秒`
  const min = relativeTime % 60
  relativeTime /= 60
  if (relativeTime < 1) return `${Math.floor(min)}分钟`
  const hour = relativeTime % 24
  relativeTime /= 24
  if (relativeTime < 1) return `${Math.floor(hour)}小时`
  if (relativeTime < 30) return `${Math.floor(relativeTime)}天`
  if (relativeTime < 365) return `约${Math.floor(relativeTime / 30)}个月`
  return `约${Math.floor(relativeTime / 365)}年`
}

export default getRelativeTimestamp