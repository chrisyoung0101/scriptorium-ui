<template>
  <div class="markup-viewer" v-html="renderedContent"></div>
</template>

<script>
import { marked } from "marked";

export default {
  props: {
    content: {
      type: String,
      required: true,
      default: "No file selected.",
    },
  },
  computed: {
    renderedContent() {
      // Convert Markdown content into HTML using marked
      return marked(this.content);
    },
  },
};
</script>

<style>
.markup-viewer {
  width: 60%;
  height: 100%;
  background-color: #000;
  color: #ccc;
  padding: 10px;
  border-left: 3px solid #CC00CC;
  overflow-y: auto;
  font-family: "Courier New", monospace;
  white-space: pre-wrap;
}

.markup-viewer h1,
.markup-viewer h2,
.markup-viewer h3 {
  color: #fff;
}

.markup-viewer p {
  color: #ccc;
}

.markup-viewer code {
  background-color: #333;
  color: #00ff00;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: "Courier New", monospace;
}
</style>
