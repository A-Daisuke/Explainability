function format(repository, {sorting} = {}) {
  //Format date
  const time = (Date.now() - new Date(repository.createdAt).getTime()) / (24 * 60 * 60 * 1000)
  let created = new Date(repository.createdAt).toDateString().substring(4)
  if (time < 1)
    created = `${Math.ceil(time * 24)} hour${Math.ceil(time * 24) >= 2 ? "s" : ""} ago`
  else if (time < 30)
    created = `${Math.floor(time)} day${time >= 2 ? "s" : ""} ago`
  repository.created = created

  //Sorting
  if (sorting)
    repository.sorting = sorting

  return repository
}
