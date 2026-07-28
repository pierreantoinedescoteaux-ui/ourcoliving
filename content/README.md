# The writing

Long-form lives here, one markdown file per piece — P-A's call, so it is never
trapped in a browser or a data file again.

    case-studies/   12   the houses and the org projects
    field-guides/   12   the twelve models of coliving
    articles/        3   the talk pieces

Everything SHORT — headings, labels, buttons, card blurbs, the manifesto
bubbles, every line on the landing — lives in the Google Sheet instead:
"Our Coliving — landing copy" (landing tab built; the rest to follow).

## How to use it

Edit the markdown. Nothing here is generated on the fly — these files were
extracted from the data files once, and they are the master from now on.

The frontmatter is how a file finds its way home:

    source: work-data.js      which file the piece came from
    path:   work-data[0]      where in that file

and the HTML comments inside mark each block, e.g.

    ## What I did   <!-- story.moves -->
    ### Every room got one job   <!-- story.moves[0] -->

Leave those comments in place. They are the only reason the writing can be put
back without guessing.

Regenerate from the data files (overwrites — only for a fresh start):

    node _tools/extract-longform.js
    node _tools/extract-longform.js --check    # report only, writes nothing
