import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { siteUrl } from '@/lib/site'

// Required by output: 'export': the sitemap is generated once at build time
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const posts = await getAllPosts()

  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/learn/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/learn/blog/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/learn/videos/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/learn/shorts/`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...posts.map((p) => ({
      url: `${siteUrl}/learn/blog/${p.slug}/`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
