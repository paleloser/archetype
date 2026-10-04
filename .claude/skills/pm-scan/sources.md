# PM scan sources

The sources `/pm-scan` reads. Edit freely. Prefer feeds and changelogs over home pages,
since they load reliably and carry dates. Keep the note after each link: it tells the
agent what to look for there.

`/product-setup` fills this in, and `/pm-scan` asks for it if it's still empty (see the
Learning protocol in `.claude/README.md`). Remove the `TODO` lines once a section has
sources. Note the date you last checked that a source loads: from a Claude Code cloud
session, some sites are blocked by the network policy and some rate-limit hard.

## Providers

Risks (changes that could break the product) and integration ideas. One per integration in
`PRODUCT.md`, plus candidate providers.

- TODO <!-- e.g. https://developers.example.com/changelog/ — Example API changes, deprecations, rate limits. -->

## Competitors

- TODO <!-- e.g. https://competitor.example/blog — features, pricing, integrations. -->

## Trade press

The industry the customer works in.

- TODO

## Consumer and tech press

The industry the user lives in, if different.

- TODO

## YouTube

Feed URL: `https://www.youtube.com/feeds/videos.xml?channel_id=<id>`

- TODO <!-- Channel name — `<channel id>` -->
