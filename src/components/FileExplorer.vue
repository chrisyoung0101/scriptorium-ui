<template>
  <div class="file-explorer">
    <div class="file-explorer-header">
      <h3>File Explorer</h3>
      <!-- Existing Upload Button -->
      <button class="upload-button" @click="triggerFileUpload">Upload</button>

      <!-- New Create Button -->
      <button class="create-button" @click="openCreateModal">Create</button>

      <!-- Hidden File Input for Upload -->
      <input
        type="file"
        ref="fileInput"
        class="hidden-file-input"
        @change="handleFileUpload"
        style="display: none;"
      />
    </div>

    <!-- File List -->
    <ul>
      <li
        v-for="file in files"
        :key="file.name"
        class="file"
        @click="selectFile(file)"
      >
        {{ file.name }}
        <button class="delete-button" @click.stop="deleteFile(file.id)">Delete</button>
      </li>
    </ul>

<!-- Modal for Creating a New File -->
<div v-if="showCreateModal" class="modal-overlay">
  <div class="modal">
    <h3>Create New Document</h3>
    <input
      v-model="newFileName"
      placeholder="Enter file name"
    />
    <textarea
      v-model="newFileContent"
      placeholder="Enter file content"
      rows="5"
    ></textarea>
    <div class="modal-actions">
      <button @click="createNewFile">Save</button>
      <button @click="closeCreateModal">Cancel</button>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    files: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showCreateModal: false, // Controls visibility of the "Create" modal
      newFileName: "", // Stores the new file's name
      newFileContent: "", // Stores the new file's content
    };
  },
  methods: {
    // Trigger the hidden file input for file uploads
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },

    // Handle file upload (already implemented)
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target.result; // File content
          const newFile = { name: file.name, content };

          try {
            // Save to database
            await axios.post(`${process.env.VUE_APP_API_URL}/api/documents`, {
              name: file.name,
              title: file.name,
              content,
              type: "FILE",
            });
            alert(`File "${file.name}" uploaded successfully.`);

            // Refresh file list
            this.$emit("update-files", [...this.files, newFile]);
          } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload the file.");
          }
        };
        reader.readAsText(file);
      }
    },

    // Select a file and notify the parent for display
    selectFile(file) {
      this.$emit("select-file", file);
    },

    // Delete a file or folder from the database
    async deleteFile(fileId) {
      try {
        await axios.delete(`${process.env.VUE_APP_API_URL}/api/documents/${fileId}`);
        alert("File or folder deleted successfully.");

        // Update the file list
        this.$emit("update-files", this.files.filter((file) => file.id !== fileId));
      } catch (error) {
        console.error("Error deleting file or folder:", error);
        alert("Failed to delete the file or folder.");
      }
    },

    // Open the "Create" modal
    openCreateModal() {
      this.showCreateModal = true;
    },

    // Close the "Create" modal and reset input fields
    closeCreateModal() {
      this.showCreateModal = false;
      this.newFileName = "";
      this.newFileContent = "";
    },

    // Create a new file and save it to the database
    async createNewFile() {
      if (!this.newFileName.trim()) {
        alert("File name is required.");
        return;
      }

      try {
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/documents`, {
          name: this.newFileName.trim(),
          title: this.newFileName.trim(),
          content: this.newFileContent,
          type: "FILE",
        });

        alert(`File "${this.newFileName}" created successfully.`);

        // Add the new file to the file list
        this.$emit("update-files", [...this.files, response.data]);

        // Close the modal and reset the input fields
        this.closeCreateModal();
      } catch (error) {
        console.error("Error creating new file:", error);
        alert("Failed to create the file.");
      }
    },
  },
};
</script>

<style>
/* Modal and Overlay Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Background dimming */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25); /* Add depth */
  width: 400px;
  max-width: 90%;
  animation: fadeIn 0.3s ease-in-out; /* Smooth fade-in animation */
}

.modal h3 {
  margin: 0 0 10px;
  font-size: 20px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-actions button:first-child {
  background-color: #4CAF50; /* Save button */
  color: white;
}

.modal-actions button:last-child {
  background-color: #f44336; /* Cancel button */
  color: white;
}

.modal-actions button:hover {
  filter: brightness(90%);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
