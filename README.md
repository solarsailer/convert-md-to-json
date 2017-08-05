# convert-md-to-json

Convert directories of Markdown files to a JSON index (containing the path of each sub-JSON file), and a JSON for each Markdown file (with the body and front-matter).

This creates the structure of a website or blog, which can then be consumed by any tool or framework.

## Example

These files:

```
home.md
📁 posts/
  📄 about.md
  📄 foo.md
📁 data/
  📄 bar.md
```

Are converted to:

```
📄 manifest.json
📄 home.json
📁 posts/
  📄 about.json
  📄 foo.json
📁 data/
  📄 bar.json
```

The manifest will contain:

```json
{
  "home": {
    "date": "",
    "title": "",
    "author": "",
    "extract": "",
    "permalink": "",
    "redirects": []
  },
  "posts/about": {},
  "posts/foo": {},
  "data/bar": {}
}
```

## Rational

TODO
