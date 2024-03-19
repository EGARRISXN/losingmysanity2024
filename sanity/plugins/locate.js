import {map} from 'rxjs'
import {resolveHref} from '../lib/resolver'

const homeLocation = {
  title: 'Home',
  href: '/',
}

export const locate = (params, context) => {
  if (params.type === 'settings') {
    const doc$ = context.documentStore.listenQuery(
      `*[_type == "post" && defined(slug.current)]{title,slug}`,
      {},
      {perspective: 'previewDrafts'},
    )
    return doc$.pipe(
      map((docs) => {
        return {
          message: 'This document is used on all pages',
          tone: 'caution',
          locations: docs?.length
            ? [
                homeLocation,
                ...docs
                  .map((doc) => ({
                    title: doc?.title || 'Untitled',
                    href: resolveHref('post', doc?.slug?.current),
                  }))
                  .filter((doc) => doc.href !== undefined),
              ]
            : [],
        }
      }),
    )
  }

  if (params.type === 'post' || params.type === 'author') {
    const doc$ = context.documentStore.listenQuery(
      `*[defined(slug.current) && _id==$id || references($id)]{_type,slug,title}`,
      params,
      {perspective: 'previewDrafts'},
    )
    return doc$.pipe(
      map((docs) => {
        switch (params.type) {
          case 'author':
          case 'post':
            return {
              locations: docs?.length
                ? [
                    homeLocation,
                    ...docs
                      .map((doc) => {
                        const href = resolveHref(doc._type, doc?.slug?.current)
                        return {
                          title: doc?.title || 'Untitled',
                          href: href,
                        }
                      })
                      .filter((doc) => doc.href !== undefined),
                  ]
                : [],
            }
          default:
            return {
              message: 'Unable to map document type to locations',
              tone: 'critical',
            }
        }
      }),
    )
  }

  return null
}
