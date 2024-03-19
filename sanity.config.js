'use client'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {locate} from './sanity/plugins/locate'
import {pageStructure, singletonPlugin} from './sanity/plugins/settings'
import {assistWithPresets} from './sanity/plugins/assist'
import {apiVersion, dataset, projectId, basePath, title} from './sanity/lib/env'
import author from './sanity/schemas/documents/author'
import post from './sanity/schemas/documents/post'
import settings from './sanity/schemas/singletons/settings'

export default defineConfig({
  basePath: basePath,
  projectId: projectId,
  dataset: dataset,
  title: title,
  schema: {
    types: [settings, post, author],
  },
  plugins: [
    structureTool({structure: pageStructure([settings])}),
    presentationTool({
      locate,
      previewUrl: {previewMode: {enable: '/api/draft'}},
    }),
    unsplashImageAsset(),
    assistWithPresets(),
    visionTool({defaultApiVersion: apiVersion || '2024-03-18'}),
  ],
})
