<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hover, press } from 'motion'
import type { ButtonVariant, ButtonSize } from '@/types/ui'
import { ArrowUpRight } from '@lucide/vue'
import { useReducedMotion } from '@/composables/useReducedMotion'

const props = withDefaults(defineProps<{
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  arrow?: boolean
  href?: string
}>(), {
  variant: 'primary',
  size: 'default',
  disabled: false,
  arrow: false,
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const { reducedMotion } = useReducedMotion()
const buttonRef = ref<HTMLElement | null>(null)

const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-text-primary text-background hover:bg-text-secondary active:bg-text-muted',
  secondary: 'border border-border text-text-primary hover:border-text-muted hover:text-text-secondary',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-16 text-small rounded-button',
  default: 'h-11 px-6 text-body rounded-button',
  lg: 'h-13 px-8 text-body-lg rounded-button',
}

const disabledClasses = 'opacity-40 cursor-not-allowed pointer-events-none'

onMounted(() => {
  if (!buttonRef.value || reducedMotion.value || props.disabled) return

  hover(buttonRef.value, () => {
    const arrow = buttonRef.value?.querySelector('[data-arrow]')
    if (arrow) {
      ;(arrow as HTMLElement).style.transform = 'translate(2px, -1px)'
    }
  }, {
    onLeave: () => {
      const arrow = buttonRef.value?.querySelector('[data-arrow]')
      if (arrow) {
        ;(arrow as HTMLElement).style.transform = 'translate(0px, 0px)'
      }
    },
  })

  press(buttonRef.value, () => {
    buttonRef.value!.style.transform = 'scale(0.98)'
  }, {
    onPressEnd: () => {
      buttonRef.value!.style.transform = 'scale(1)'
    },
  })
})

function handleClick(e: MouseEvent) {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<template>
  <a
    v-if="href"
    :href="href"
    ref="buttonRef"
    :class="[
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      disabled ? disabledClasses : 'cursor-pointer group',
    ]"
    :target="href.startsWith('http') ? '_blank' : undefined"
    :rel="href.startsWith('http') ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <ArrowUpRight
      v-if="arrow"
      data-arrow
      :size="size === 'sm' ? 14 : size === 'lg' ? 20 : 16"
      class="transition-transform duration-150"
    />
  </a>
  <button
    v-else
    ref="buttonRef"
    :disabled="disabled"
    :class="[
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      disabled ? disabledClasses : 'cursor-pointer group',
    ]"
    @click="handleClick"
  >
    <slot />
    <ArrowUpRight
      v-if="arrow"
      data-arrow
      :size="size === 'sm' ? 14 : size === 'lg' ? 20 : 16"
      class="transition-transform duration-150"
    />
  </button>
</template>
