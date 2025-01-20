<template>
    <div class="directory-tree">
      <ul>
        <li v-for="item in tree" :key="item.name">
          <span @click="select(item)">
            {{ item.name }}
          </span>
          <DirectoryTree v-if="item.children" :tree="item.children" @select-file="$emit('select-file', $event)" />
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: ['tree'],
    methods: {
      select(item) {
        if (!item.children) this.$emit('select-file', item.name);
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
  </style>
  