<script setup lang="ts">
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout />
</template>

<style>
/* Footer logo - injected via CSS */
.VPFooter .container::before {
  content: "";
  display: block;
  width: 48px;
  height: 48px;
  margin: 0 auto 16px auto;
  background-image: url("/images/tailwindcss-obfuscator/logo-square.svg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.dark .VPFooter .container::before {
  background-image: url("/images/tailwindcss-obfuscator/logo-square-white.svg");
}
</style>
