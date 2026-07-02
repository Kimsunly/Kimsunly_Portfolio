<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useBootSequence } from '@/composables/useBootSequence'

const { t } = useI18n()
const { visible, lines, progress, complete } = useBootSequence()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      id="boot-overlay"
      class="fixed inset-0 z-loading bg-background flex flex-col items-center justify-center"
      role="status"
      :aria-label="t('boot.ariaLabel')"
    >
      <div class="max-w-[400px] w-full px-24 sm:px-32 md:px-48 lg:px-64">
        <div class="font-mono text-small text-text-secondary space-y-1.5">
          <div
            v-for="(line, index) in lines"
            :key="index"
            class="typing-line"
          >
            <span class="text-primary/60">&gt;</span>
            <span class="ml-2">{{ line }}</span>
          </div>
        </div>

        <div
          class="mt-6 h-[2px] bg-surface-elevated rounded-full overflow-hidden"
          role="progressbar"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="h-full bg-primary transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>

        <p
          v-if="progress >= 100"
          class="mt-4 font-mono text-body font-medium text-success"
        >
          {{ t('boot.systemOnline') }}
        </p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.typing-line {
  opacity: 0;
  animation: fadeInLine 0.2s ease-out forwards;
}

@keyframes fadeInLine {
  to {
    opacity: 1;
  }
}
</style>
