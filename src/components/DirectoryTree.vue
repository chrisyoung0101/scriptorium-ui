<template>
  <div class="directory-tree">
    <ul>
      <li v-for="item in tree" :key="item.id" class="tree-item">
        <span 
          class="item-label"
          :class="{ folder: item.type === 'FOLDER', file: item.type === 'FILE' }"
          @click="handleClick(item)"
        >
          <span v-if="item.type === 'FOLDER'" class="toggle-icon">
            {{ item.expanded ? '-' : '+' }}
          </span>
          {{ item.name }}
        </span>
        <!-- Render child nodes if item is expanded -->
        <DirectoryTree
          v-if="item.expanded && item.children"
          :tree="item.children"
          @select-file="$emit('select-file', $event)"
        />
      </li>
    </ul>
  </div>
</template>

  
<script>
import axios from "axios";

export default {
  props: {
    tree: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    /**
     * Handles click on a folder or file item.
     * If a folder is clicked, toggles its expanded state and loads children.
     * If a file is clicked, emits an event to the parent.
     */
    async handleClick(item) {
      if (item.type === "FOLDER") {
        item.expanded = !item.expanded; // Toggle folder state
        if (item.expanded && !item.children) {
          await this.loadChildren(item); // Load children dynamically if not already loaded
        }
      } else if (item.type === "FILE") {
        this.$emit("select-file", item); // Emit selected file to parent
      }
    },

    /**
     * Fetches children of a folder from the API.
     * @param {Object} folder - The folder whose children are to be loaded.
     */
     async loadChildren(folder) {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_API_URL}/api/documents/${folder.id}/children`,
      {
        auth: {
          username: process.env.VUE_APP_API_USERNAME,
          password: process.env.VUE_APP_API_PASSWORD,
        },
      }
    );
    folder.children = response.data.map((child) => ({
      ...child,
      expanded: false, // Initialize all folders as collapsed
    }));
  } catch (error) {
    console.error("Error loading folder contents:", error);
    alert(`Failed to load contents for folder: ${folder.name}`);
  }
},
  },
};
</script>

  
<style>
.directory-tree {
  width: 250px;
  background: #333;
  color: white;
  padding: 10px;
  height: 100%;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.tree-item {
  margin: 5px 0;
  cursor: pointer;
}

.item-label {
  padding: 5px;
  display: inline-block;
  border-radius: 4px;
}

.item-label.folder {
  font-weight: bold;
  color: #3cb371;
}

.item-label.file {
  color: #ccc;
}

.item-label:hover {
  background-color: #444;
}

.toggle-icon {
  margin-right: 5px;
  font-weight: bold;
}
</style>

  