<template>
  <div id="app">
    <header>
      <div class="header-title">
        <span
          v-for="(char, index) in title"
          :key="index"
          :style="{ color: headerColors[index % headerColors.length] }"
        >
          {{ char }}
        </span>
      </div>
    </header>
    <div class="layout">
      <!-- Directory Tree -->
      <div class="directory-sidebar">
        <h3>Directory Tree</h3>
        <ul>
          <li class="directory">/home</li>
          <li class="directory">/documents</li>
          <ul>
            <li class="file">file1.markup</li>
            <li class="file">file2.markup</li>
          </ul>
          <li class="directory">/projects</li>
          <ul>
            <li class="directory">/Folder1</li>
            <li class="directory">/Folder2</li>
          </ul>
        </ul>
      </div>

      <!-- File Explorer -->
      <FileExplorer
        :files="files"
        @select-file="viewFileContent"
        @update-files="updateFiles"
      />

      <!-- MarkUp Viewer -->
      <MarkUpViewer :content="selectedFileContent" />
    </div>

    <!-- CRUD Operations Section -->
    <div class="crud-section">
      <CrudOperations />
    </div>

    <footer>
      <div class="footer-colors">
        <div
          class="color-block"
          v-for="color in footerColors"
          :key="color"
          :style="{ backgroundColor: color }"
        ></div>
        <div class="key-icon" @click="showAdminLogin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 100"
            width="70px"
            height="70px"
          >
            <circle cx="20" cy="20" r="15" stroke="#3CB371" stroke-width="5" fill="none" />
            <rect x="35" y="17" width="60" height="6" fill="#3CB371" />
            <rect x="95" y="15" width="10" height="10" fill="#3CB371" />
            <rect x="105" y="15" width="10" height="8" fill="#3CB371" />
            <rect x="115" y="18" width="5" height="6" fill="#3CB371" />
          </svg>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import FileExplorer from './components/FileExplorer.vue';
import MarkUpViewer from './components/MarkUpViewer.vue';
import CrudOperations from './components/CrudOperations.vue';

export default {
  components: {
    FileExplorer,
    MarkUpViewer,
    CrudOperations,
  },
  data() {
    return {
      title: "SCRIPTORIUM".split(""),
      footerColors: [
        "#8B4513",
        "#A0522D",
        "#CD853F",
        "#D2691E",
        "#3CB371",
        "#2E8B57",
        "#228B22",
        "#00CCCC",
        "#CC00CC",
      ],
      headerColors: [
        "#8B4513",
        "#A0522D",
        "#CD853F",
        "#D2691E",
        "#3CB371",
        "#2E8B57",
        "#228B22",
        "#00CCCC",
        "#CC00CC",
      ],
      files: [],
      selectedFileContent: "No file selected.",
    };
  },
  methods: {
    /**
     * Global method to handle errors and provide user-friendly feedback.
     * @param {string} message - The error message to display to the user.
     */
    handleError(message) {
      alert(message); // Display an alert for now. Can be extended to a toast or notification system.
    },

    /**
     * Fetch the list of files/documents from the backend API.
     * Maps the backend response to the format expected by the UI.
     */
    async fetchFiles() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/documents`, {
          withCredentials: true, // Enable cookies/session authentication
        });
        // Map the response data to the file structure used in the UI
        this.files = response.data.map((doc) => ({
          id: doc.id,
          name: doc.name,
          content: doc.content,
        }));
      } catch (error) {
        console.error("Error fetching documents:", error);
        this.handleError("Failed to fetch files from the database.");
      }
    },

    /**
     * Update the list of files in the UI after changes (e.g., file upload, CRUD operations).
     * @param {Array} newFiles - The updated list of files.
     */
    updateFiles(newFiles) {
      this.files = newFiles; // Update the file list globally
    },

    /**
     * Display the content of a selected file in the viewer.
     * @param {Object} file - The selected file object.
     */
    viewFileContent(file) {
      this.selectedFileContent = file.content || "Unable to load content.";
    },

    /**
     * Show the admin login modal or prompt.
     */
    showAdminLogin() {
      alert("Admin Login Clicked");
    },
  },
  created() {
    this.fetchFiles(); // Fetch files when the app is created
  },
};
</script>

<style>
/* Enable global scrolling */
html, body, #app {
  height: 100%;
  margin: 0;
  overflow: auto; /* Enable scrolling on the main page only */
}

/* Header Styling */
header {
  background-color: #ffffff;
  padding: 10px 0;
  border-bottom: 1px solid #000;
}

.header-title {
  font-size: 28px;
  font-family: "Courier New", monospace;
  letter-spacing: 5px;
  display: flex;
  justify-content: center;
  margin: 0;
}

/* Layout */
.layout {
  display: flex;
  height: calc(100vh - 100px); /* Full height minus header/footer */
  border: 2px solid #fff;
  border-width: 0 2px;
  padding: 0; /* Remove extra padding to align content */
  overflow: hidden; /* Prevent content spilling */
}

/* Directory Tree */
.directory-sidebar {
  width: 20%;
  height: 102.3%;
  background-color: #000;
  color: #00CCCC;
  border-right: 3px solid #00CCCC;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto; /* Ensure no clipping */
}

/* File Explorer */
.file-explorer {
  width: 20%;
  height: 100%;
  background-color: #000;
  color: #CC00CC;
  border-right: 3px solid #CC00CC;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto; /* Prevent content overflow */
}

/* MarkUp Viewer */
.markup-viewer {
  flex: 1;
  height: 100%;
  background-color: #000;
  color: #ccc;
  padding: 10px;
  border-left: 3px solid #CC00CC;
  overflow-y: auto;
  font-family: "Courier New", monospace;
  white-space: pre-wrap;
  word-wrap: break-word; /* Prevent text spilling horizontally */
  box-sizing: border-box; /* Ensure padding is included within width/height */
}

/* Footer */
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  padding: 10px;
}

.footer-colors {
  display: flex;
  gap: 2px;
  flex-grow: 1;
}

.color-block {
  width: calc(100% / 9);
  height: 30px;
}

.key-icon {
  margin-right: 15px;
  cursor: pointer;
}
</style>
