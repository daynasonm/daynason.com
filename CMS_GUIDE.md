# Portfolio CMS Guide

Edit [cms.js](cms.js) when you want to add or change projects.

## Add A Project

Copy one object inside `projects: [...]`, paste it below the last project, then change:

```js
{
  id: "my-project",
  number: "08",
  title: "My Project",
  year: "2026",
  type: "Website",
  categories: ["Website", "Design"],
  cover: {
    kind: "image",
    src: "assets/my-project/cover.jpg",
    alt: "Describe the cover image"
  },
  detail: {
    sections: [["Brief"], ["Concept"], ["Website"]],
    hero: {
      kind: "placeholder",
      text: "image of the project\ngoes here (or video)",
      background: "#c2c2c2"
    },
    statement: "1 sentence text explaining the project",
    content: [
      {
        kind: "feature",
        title: "text explaining the project",
        body: ["Optional paragraph text can go here."],
        items: [
          { kind: "image", src: "assets/my-project/detail-1.jpg", alt: "Detail one", caption: "Caption" },
          { kind: "video", src: "assets/my-project/detail.mp4", poster: "assets/my-project/detail-poster.jpg", caption: "Video caption" }
        ]
      }
    ]
  }
}
```

The page URL will be:

```text
project.html?project=my-project
```

## What To Edit

- `cover` controls the homepage carousel panel.
- `detail.hero` controls the pink first-screen project image/video area.
- `detail.statement` controls the one-sentence line below the hero.
- `detail.content` controls the longer project page sections below.

Use local media paths like `assets/project-name/image.jpg` after adding those files to the project folder.
