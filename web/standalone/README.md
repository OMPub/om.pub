# Boosted Reactions standalone artifact

`public/boosted-reactions/standalone.html` is a generated, dependency-free
version of the Boosted Reactions meme generator. It is the file intended for
an Arweave transaction and an NFT `animation_url`.

The file embeds:

- all 167 reaction images as screen-sized JPEG data URLs;
- artwork metadata, cached boosted drops, and curated @punk6529 tweets;
- the favicon, CSS, and vanilla JavaScript application.

Live boosted drops, 6529 profiles, and pasted source resolution are optional
network enhancements. The embedded corpus, editing, navigation, URL state,
downloads, and sharing continue to work when those services are unavailable.

## Build

Run from `web/` on macOS:

```sh
pnpm build:standalone-meme
pnpm test:standalone-meme
```

The build uses `sips` to create 600 x 750 JPEGs from the source WebP files,
then writes the single HTML file. It also writes the same optimized images to
`public/boosted-reactions/renderer/` for om.pub's dynamic PNG share endpoint.
Those files are not dependencies of the standalone artifact. Commit all
generated outputs whenever the template or embedded source data changes.

## Arweave

Upload `public/boosted-reactions/standalone.html` with the
`Content-Type: text/html` transaction tag. No path or asset rewriting is
needed. The page derives its canonical share base from its own document URL,
so a page opened at `https://arweave.net/<transaction-id>` copies links back to
that transaction with the complete meme state in the `m` query parameter.

The om.pub verification route transparently serves the generated artifact at:

`https://om.pub/booster`

After uploading to Arweave, set
`NEXT_PUBLIC_BOOSTED_REACTIONS_STANDALONE_URL` to the permanent Arweave URL
when building om.pub. This makes Copy link in the React version target the
same standalone transaction. Until then Copy link targets the `/booster`
verification route.
