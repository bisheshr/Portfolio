export const traces = {
  "nested": {
    "markdown": "**bold *italic* text**",
    "steps": [
      {
        "accepted": true,
        "reason": "Input lexically valid"
      },
      {
        "accepted": true,
        "reason": "Grammar and nesting valid"
      },
      {
        "accepted": true,
        "reason": "All link references resolved"
      }
    ],
    "html": "<p><strong>bold <em>italic</em> text</strong></p>"
  },
  "crossed": {
    "markdown": "**bold *italic** text*",
    "steps": [
      {
        "accepted": true,
        "reason": "Input lexically valid"
      },
      {
        "accepted": false,
        "reason": "Crossing tags: received Bold closer '**' while top of stack was 'ST_ITALIC'"
      }
    ],
    "html": null
  },
  "reference": {
    "markdown": "[docs][1]\n\n[1]: https://example.com/docs",
    "steps": [
      {
        "accepted": true,
        "reason": "Input lexically valid"
      },
      {
        "accepted": true,
        "reason": "Grammar and nesting valid"
      },
      {
        "accepted": true,
        "reason": "All link references resolved"
      }
    ],
    "html": "<p><a href=\"https://example.com/docs\">docs</a></p>"
  }
};
