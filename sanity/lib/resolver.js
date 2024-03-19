export function resolveHref(documentType, slug) {
  switch (documentType) {
    case 'post':
      return slug ? `/posts/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}
