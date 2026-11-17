import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'
import * as marked from 'marked'
const require = createRequire(import.meta.url)
function load(file, mocks = {}, globals = {}) {
  const context = { exports: {}, process, console, AbortSignal, ...globals, require: id => id in mocks ? mocks[id] : require(id) }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, context)
  return context.exports
}
const { markdownToHtml, sanitizeContent } = load('lib/markdown.ts', { marked })
assert.match(markdownToHtml('`**literal**`'), /<code>\*\*literal\*\*<\/code>/)
assert.match(markdownToHtml('# Heading'), /<h2>Heading<\/h2>/)
assert.match(markdownToHtml('[Read](https://example.com/a_b_c/)'), /href="https:\/\/example.com\/a_b_c\/"/)
assert.match(markdownToHtml('| A | B |\n|---|---|\n| 1 | 2 |'), /<table>/)
for (const render of [markdownToHtml, sanitizeContent]) {
  const clean = render('<script>alert(1)</script><img src="https://example.com/photo.jpg" onerror="alert(1)"><a href="javascript:alert(1)">bad</a><iframe src="https://evil.example"></iframe>')
  assert.doesNotMatch(clean, /<script|onerror|javascript:|<iframe/)
  assert.match(clean, /photo.jpg/)
}
assert.doesNotMatch(sanitizeContent('<a href="jav&#x61;script:alert(1)">bad</a>'), /javascript:/)
assert.match(sanitizeContent('<h1>Title</h1><p><strong>Safe</strong></p>'), /<h2>Title<\/h2>/)
console.log('PASS: Markdown literals, links, headings, tables and HTML sanitization')

let states = [], cursor = 0
const jsx = (type, props) => ({ type, props: props ?? {} })
const hooks = { useId: () => 'test', useRef: () => ({current:null}), useMemo: fn => fn(), useState: initial => {
  const i = cursor++; if (!(i in states)) states[i] = initial
  return [states[i], value => states[i] = value]
} }
const styles = new Proxy({}, { get: (_, key) => key })
const { default: Library } = load('components/learn/CompactLibrary.tsx', {
  react: hooks, 'react/jsx-runtime': { jsx, jsxs: jsx }, './Learn.module.css': styles,
  './Cards': { BlogCard: 'BlogCard', ShortCard: 'ShortCard', VideoCard: 'VideoCard' },
})
const videos = Array.from({length:14}, (_, i) => ({id:String(i),kind:'short',title:`Lesson ${i}`,topic:i < 8 ? 'SEO' : 'Ads'}))
let tree
function render() { cursor = 0; tree = Library({ posts: [], videos, showKindTabs: false }) }
function walk(node) { return !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(walk) : [node, ...walk(node.props?.children)] }
function button(text) { return walk(tree).find(n => n.type === 'button' && n.props.children === text) }
function cards() { return walk(tree).filter(n => n.type === 'ShortCard') }
render(); assert.equal(cards().length, 6); assert.equal(button('All'), undefined)
button('Next').props.onClick(); render(); assert.equal(cards()[0].props.video.id, '6')
button('Next').props.onClick(); render(); assert.equal(cards().length, 2); assert.equal(button('Next').props.disabled, true)
walk(tree).find(n => n.type === 'input').props.onChange({target:{value:' SEO '}}); render(); assert.equal(cards().length, 6); assert.equal(button('Previous').props.disabled, true)
walk(tree).find(n => n.type === 'select').props.onChange({target:{value:'Ads'}}); render(); assert.equal(cards().length, 0)
button('Clear filters').props.onClick(); render(); assert.equal(cards().length, 6)
console.log('PASS: archive pagination, search, combined filters, resets and empty results')

for (const route of ['', 'learn', 'learn/blog', 'learn/videos', 'learn/shorts']) {
  const html = fs.readFileSync(`out/${route ? route + '/' : ''}index.html`, 'utf8')
  assert.match(html, /og-image.jpg/)
  assert.match(html, /aria-controls=/)
  assert.match(html, /aria-expanded="false"/)
  if (route) {
    assert.ok((html.match(/<article/g) ?? []).length <= 6, `${route}: too many initial cards`)
    assert.match(html, /Search resources/)
    assert.ok(!html.includes('<meta name="twitter:title" content="Dr. Shahzaib Hamid'))
  }
}
assert.ok(fs.existsSync('out/og-image.jpg'))
console.log('PASS: exported metadata, mobile menu markup and bounded archive cards')

const blogMocks = { '@/content/videos': { hiddenVideoIds: new Set() } }
const missing = load('lib/blog.ts', blogMocks, { process: { env: { NODE_ENV: 'production' } } })
await assert.rejects(missing.getAllPosts(), /Production builds require/)
let requests = 0
const fresh = load('lib/blog.ts', blogMocks, {
  process: { env: { NODE_ENV: 'production', SUPABASE_URL: 'https://example.test', SUPABASE_ANON_KEY: 'test' } },
  fetch: async (_url, options) => {
    requests++
    assert.notEqual(options.cache, 'force-cache')
    return { ok: true, json: async () => [{title:'Published',slug:'published',status:'published'}, {title:'Draft',status:'draft'}] }
  },
})
const results = await Promise.all([fresh.getAllPosts(), fresh.getAllPosts()])
assert.equal(requests, 1)
assert.equal(results[0].length, 1)
console.log('PASS: production configuration guard, uncached fetch and per-worker deduplication')

states = []; cursor = 0
let focused = false
const { default: Nav } = load('components/Nav.tsx', {
  react: {...hooks, useEffect: () => {}, useRef: () => ({current:{focus:()=>focused=true}})},
  'react/jsx-runtime': {jsx, jsxs:jsx}, 'next/link':'Link', './Nav.module.css':styles,
  '@/lib/booking':{bookingUrl:'https://calendly.com/code_squad/30min'},
  'framer-motion': {motion:{nav:'nav',a:'a'}, useReducedMotion:()=>true, useMotionValue:()=>({set:()=>{throw new Error('Motion should be disabled')}}), useSpring:value=>value},
})
function renderNav(){ cursor=0; tree=Nav() }
renderNav(); button('Menu').props.onClick(); renderNav(); assert.equal(button('Close').props['aria-expanded'],true)
tree.props.onKeyDown({key:'Escape'}); renderNav(); assert.equal(button('Menu').props['aria-expanded'],false); assert.equal(focused,true)
button('Menu').props.onClick(); renderNav();
walk(tree).find(n=>n.props.id==='test').props.onClick({target:{closest:()=>({})}}); renderNav(); assert.equal(button('Menu').props['aria-expanded'],false)
walk(tree).find(n=>n.props.onMouseMove).props.onMouseMove({})
console.log('PASS: mobile menu toggle, Escape focus return, link dismissal and reduced-motion guard')

const channel = load('content/channel-videos.ts')
const catalog = load('content/videos.ts', { './channel-videos': channel })
assert.equal(channel.channelVideos.length, 78)
assert.equal(new Set(catalog.videos.map(v => v.id)).size, catalog.videos.length)
for (const video of channel.channelVideos) {
  assert.match(video.id, /^[\w-]{11}$/)
  assert.equal(video.kind, 'video')
  assert.ok(Number.isFinite(Date.parse(video.publishedAt)))
  assert.ok(video.durationSeconds > 0)
  assert.ok(!catalog.hiddenVideoIds.has(video.id))
}
const videoLibrary = load('lib/videos.ts', {
  '@/content/videos': catalog,
  './blog': { getAllPosts: async () => [
    {youtubeId:channel.channelVideos[0].id, title:'Duplicate from blog', tags:['General']},
    {youtubeId:'mhvPJDXl5zs', title:'Hidden', tags:[]},
  ] },
})
assert.equal((await videoLibrary.getVideos()).length, 78)
assert.equal((await videoLibrary.getShorts()).length, 64)
assert.equal((await videoLibrary.getVideos())[0].id, channel.channelVideos[0].id)
const exportedVideos = fs.readFileSync('out/learn/videos/index.html', 'utf8')
for (const video of channel.channelVideos) assert.ok(exportedVideos.includes(video.id), `Missing imported video ${video.id}`)
console.log('PASS: complete 78-video import, unique IDs, upload dates, durations, hidden IDs and blog deduplication')
