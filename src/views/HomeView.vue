<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'
const AboutSection = defineAsyncComponent(() => import('@/components/sections/AboutSection.vue'))
const FeaturedProjects = defineAsyncComponent(() => import('@/components/sections/FeaturedProjects.vue'))
const EngineeringPrinciples = defineAsyncComponent(() => import('@/components/sections/EngineeringPrinciples.vue'))
const DevConsole = defineAsyncComponent(() => import('@/components/sections/DevConsole.vue'))
const TechnologyStack = defineAsyncComponent(() => import('@/components/sections/TechnologyStack.vue'))
const JourneyTimeline = defineAsyncComponent(() => import('@/components/sections/JourneyTimeline.vue'))
const CertificatesSection = defineAsyncComponent(() => import('@/components/sections/CertificatesSection.vue'))
const PresentationsSection = defineAsyncComponent(() => import('@/components/sections/PresentationsSection.vue'))
const ContactSection = defineAsyncComponent(() => import('@/components/sections/ContactSection.vue'))
</script>

<template>
  <HeroSection />
  <DevConsole />
  <AboutSection />
  <FeaturedProjects />
  <TechnologyStack />
  <EngineeringPrinciples />
  <JourneyTimeline />
  <CertificatesSection />
  <PresentationsSection />
  <ContactSection />
</template>
