<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h2>Admin Login</h2>
      <input 
        type="password" 
        v-model="password" 
        placeholder="Enter password" 
      />
      <div class="modal-actions">
        <button @click="login">Login</button>
        <button @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

  
  <script>
  export default {
    data() {
      return { password: '' };
    },
    methods: {
      login() {
        if (this.password === 'master_password') this.$emit('login', true);
        else alert('Incorrect password');
      },
    },
  };
  </script>
  
  <style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  