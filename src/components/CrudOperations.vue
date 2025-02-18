<template>
  <div class="crud-operations">
    <h3>CRUD Operations</h3>

    <!-- Fetch All Documents -->
    <button @click="fetchDocuments">Get All Documents</button>
    <ul v-if="documents.length">
      <li v-for="doc in documents" :key="doc.id">
        ID: {{ doc.id }}, Name: {{ doc.name }}, Title: {{ doc.title }}
      </li>
    </ul>

    <!-- Create New Document -->
    <button @click="createDocument">Create Document</button>

    <!-- Get Document by ID -->
    <div>
      <input v-model="fetchId" placeholder="Enter ID to fetch" />
      <button @click="fetchDocumentById">Get Document by ID</button>
      <p v-if="documentById">
        ID: {{ documentById.id }}, Name: {{ documentById.name }},
        Title: {{ documentById.title }}
      </p>
    </div>

    <!-- Delete Document -->
    <div>
      <input v-model="deleteId" placeholder="Enter ID to delete" />
      <button @click="deleteDocument">Delete Document</button>
    </div>

    <!-- New: Test Hello Endpoint -->
    <div>
      <button @click="helloBackend">Test Hello Endpoint</button>
      <p v-if="helloMessage">Response: {{ helloMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      documents: [],
      fetchId: "",
      deleteId: "",
      documentById: null,
      helloMessage: "" // new property to store the hello endpoint response
    };
  },
  methods: {
    async fetchDocuments() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/documents`);
        this.documents = response.data.map((doc) => ({
          id: doc.id,
          name: doc.name,
          title: doc.title,
        }));
      } catch (error) {
        console.error("Error fetching documents:", error);
        alert("Failed to fetch documents. Please try again later.");
      }
    },

    async createDocument() {
      try {
        const newDoc = {
          name: `Document_${Date.now()}`,
          title: "Sample Document",
          content: "This is a sample document content.",
          type: "FILE",
        };
        const response = await axios.post(`${process.env.VUE_APP_API_URL}/api/documents`, newDoc);
        this.documents.push(response.data);
        alert(`Document "${newDoc.name}" created successfully.`);
      } catch (error) {
        console.error("Error creating document:", error);
        alert("Failed to create document. Please try again.");
      }
    },

    async fetchDocumentById() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/documents/${this.fetchId}`
        );
        this.documentById = response.data;
      } catch (error) {
        console.error("Error fetching document by ID:", error);
        alert("Failed to fetch document.");
      }
    },

    async deleteDocument() {
      try {
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/api/documents/${this.deleteId}`
        );
        this.documents = this.documents.filter((doc) => doc.id !== this.deleteId);
        alert(`Document with ID ${this.deleteId} deleted.`);
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete the document.");
      }
    },

    async helloBackend() {
    try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/hello`);
        this.helloMessage = response.data;
        alert(`Response from backend: ${this.helloMessage}`);
    } catch (error) {
        console.error("Error calling hello endpoint:", error);
        alert("Failed to call hello endpoint.");
    }
},
  },
};
</script>

<style>
.crud-operations {
  padding: 20px;
  border: 1px solid #ccc;
  margin: 16px;
  background-color: #f9f9f9;
}

button {
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

button:hover {
  background-color: #0056b3;
}

input {
  padding: 5px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}
</style>
