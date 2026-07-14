<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'

const handleSubmit = (event: Event) => {
  event.preventDefault()
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
    <form class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row" @submit="handleSubmit">
      <BaseInput placeholder="메시지를 입력하세요" class="flex-1" />
      <BaseButton type="submit">전송</BaseButton>
    </form>
  </section>
</template>
