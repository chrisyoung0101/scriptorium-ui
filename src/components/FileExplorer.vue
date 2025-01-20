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
            await axios.post("http://localhost:8080/api/documents", {
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
        await axios.delete(`http://localhost:8080/api/documents/${fileId}`);
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
        const response = await axios.post("http://localhost:8080/api/documents", {
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
.file-explorer {
  width: 20%;
  height: 100%;
  background-color: #000;
  color: #CC00CC;
  border-right: 3px solid #CC00CC;
  padding: 10px;
  box-sizing: border-box;
}

.file-explorer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #CC00CC;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.upload-button,
.create-button,
.delete-button {
  background-color: transparent;
  color: #ccc;
  border: 1px solid #ccc;
  padding: 5px 10px;
  font-size: 14px;
  font-family: "Courier New", monospace;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.upload-button:hover,
.create-button:hover,
.delete-button:hover {
  background-color: #ccc;
  color: #000;
}

ul {
  list-style: none;
  padding: 0;
}

.file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin: 5px 0;
  cursor: pointer;
}

/* Modal Styling */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  color: #000;
  width: 400px;
  max-width: 90%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.modal-content .input,
.modal-content .textarea {
  margin-bottom: 10px;
  padding: 8px;
  font-size: 14px;
  width: 100%;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.save-button,
.cancel-button {
  padding: 5px 15px;
  border: 1px solid #ccc;
  background-color: #f4f4f4;
  cursor: pointer;
}

.save-button:hover,
.cancel-button:hover {
  background-color: #ccc;
}

/* RESPONSIVE STYLES */
@media screen and (max-width: 768px) {
  .file-explorer {
    width: 100%;
    border-right: none;
    border-bottom: 3px solid #CC00CC;
    padding: 5px;
  }

  .file-explorer-header {
    flex-direction: column;
    gap: 10px;
  }

  .modal {
    width: 100%; /* Stretch modal to full width */
    max-width: 95%;
  }
}

@media screen and (max-width: 480px) {
  .file {
    font-size: 12px;
  }

  .upload-button,
  .create-button,
  .delete-button {
    font-size: 12px;
    padding: 4px 8px;
  }

  .modal-content .input,
  .modal-content .textarea {
    font-size: 12px;
  }
}
</style>
