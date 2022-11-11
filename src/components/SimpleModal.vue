<template>
  <vue-final-modal
    v-slot="{ params, close }"
    v-bind="$attrs"
    classes="flex justify-center items-center"
    content-class="relative flex flex-col max-h-full mx-4 p-4 border dark:border-gray-800 rounded bg-white dark:bg-gray-900"
  >
    <span class="mr-8 text-2xl font-bold">
      <slot name="title"></slot>
    </span>
    <div class="flex-grow overflow-y-auto">
      <slot :params="params"></slot>
    </div>
    <div class="flex-shrink-0 flex justify-end items-center pt-4">
      <button class="uppercase" @click="$emit('cancel', close)">cancel</button>
      <button class="ml-4 uppercase" @click="$emit('confirm', close)">
        confirm
      </button>
    </div>
  </vue-final-modal>
</template>
