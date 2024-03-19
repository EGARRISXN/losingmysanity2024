import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId, basePath} from './env'

export const client = createClient({
  apiVersion: apiVersion,
  projectId: projectId,
  dataset: dataset,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl: basePath,
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }

      return props.filterDefault(props)
    },
  },
})
