import type { LearnVideo } from '@/content/videos'
import type { BlogSummary } from './Cards'
import CompactLibrary from './CompactLibrary'

type Props = {
  posts?: BlogSummary[]
  videos?: LearnVideo[]
  showKindTabs?: boolean
  emptyText?: string
  compactLibrary?: boolean
}

export default function HubTabs({ posts = [], videos = [], showKindTabs = true, emptyText }: Props) {
  return <CompactLibrary posts={posts} videos={videos} showKindTabs={showKindTabs} emptyText={emptyText} />
}
