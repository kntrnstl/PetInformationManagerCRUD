<template>
  <ion-app>

    <!-- SPLASH / LOADING SCREEN -->
    <transition name="fade">

      <div
        v-if="isLoading"
        class="splash-screen"
      >

        <div class="logo-container">

          <!-- PAW LOGO -->
          <div class="paw-circle">

            <ion-icon
              :icon="paw"
              class="paw-icon"
            />

          </div>


          <!-- TITLE -->
          <h1>
            Pet Information Manager
          </h1>

          <p>
            Preparing your pet records...
          </p>


          <!-- PERCENTAGE -->
          <div class="percentage">

            {{ progress }}%

          </div>


          <!-- PROGRESS BAR -->
          <div class="progress-container">

            <div
              class="progress-bar"
              :style="{
                width: progress + '%'
              }"
            ></div>

          </div>


          <!-- STATUS -->
          <span class="loading-text">

            {{ loadingMessage }}

          </span>

        </div>

      </div>

    </transition>


    <!-- MAIN APP -->
    <ion-router-outlet
      v-if="!isLoading"
    />

  </ion-app>
</template>


<script setup lang="ts">

import {
  IonApp,
  IonRouterOutlet,
  IonIcon
} from '@ionic/vue';

import {
  ref,
  computed,
  onMounted,
  onUnmounted
} from 'vue';

import {
  paw
} from 'ionicons/icons';


/* =========================================
   LOADING VARIABLES
========================================= */

const isLoading = ref(true);

const progress = ref(1);

let loadingInterval:
  ReturnType<typeof setInterval>
  | null = null;


/* =========================================
   LOADING MESSAGE
========================================= */

const loadingMessage = computed(() => {

  if (progress.value < 30) {

    return 'Starting application...';

  }

  if (progress.value < 60) {

    return 'Connecting to database...';

  }

  if (progress.value < 90) {

    return 'Loading pet information...';

  }

  if (progress.value < 100) {

    return 'Almost ready...';

  }


  return 'Ready!';

});


/* =========================================
   START LOADING
========================================= */

onMounted(() => {

  loadingInterval = setInterval(() => {

    if (progress.value < 100) {

      progress.value += 1;

    }

    else {

      if (loadingInterval) {

        clearInterval(
          loadingInterval
        );

      }


      setTimeout(() => {

        isLoading.value = false;

      }, 400);

    }

  }, 25);

});


/* =========================================
   CLEANUP
========================================= */

onUnmounted(() => {

  if (loadingInterval) {

    clearInterval(
      loadingInterval
    );

  }

});

</script>


<style scoped>

/* =========================================
   SPLASH SCREEN
========================================= */

.splash-screen {

  position: fixed;

  inset: 0;

  z-index: 99999;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 30px;

  background:
    linear-gradient(
      135deg,
      #4338ca,
      #6366f1,
      #8b5cf6
    );

  text-align: center;

}


/* =========================================
   CONTENT
========================================= */

.logo-container {

  width: 100%;

  max-width: 310px;

  display: flex;

  flex-direction: column;

  align-items: center;

  animation:
    splashEnter
    0.7s
    ease;

}


/* =========================================
   LOGO
========================================= */

.paw-circle {

  width: 96px;

  height: 96px;

  margin-bottom: 23px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 30px;

  background:
    rgba(
      255,
      255,
      255,
      0.18
    );

  backdrop-filter:
    blur(10px);

  box-shadow:
    0 15px 40px
    rgba(
      0,
      0,
      0,
      0.15
    );

  animation:
    floatingPaw
    1.7s
    ease-in-out
    infinite;

}


.paw-icon {

  color: white;

  font-size: 50px;

}


/* =========================================
   TITLE
========================================= */

.logo-container h1 {

  margin: 0;

  color: white;

  font-size: 25px;

  font-weight: 800;

  letter-spacing: -0.5px;

}


.logo-container p {

  margin:
    8px
    0
    20px;

  color:
    rgba(
      255,
      255,
      255,
      0.75
    );

  font-size: 13px;

}


/* =========================================
   PERCENTAGE
========================================= */

.percentage {

  margin-bottom: 12px;

  color: white;

  font-size: 30px;

  font-weight: 800;

  font-variant-numeric:
    tabular-nums;

}


/* =========================================
   PROGRESS BAR
========================================= */

.progress-container {

  width: 100%;

  height: 7px;

  overflow: hidden;

  border-radius: 999px;

  background:
    rgba(
      255,
      255,
      255,
      0.18
    );

}


.progress-bar {

  height: 100%;

  width: 0;

  border-radius: 999px;

  background: white;

  box-shadow:
    0 0 15px
    rgba(
      255,
      255,
      255,
      0.55
    );

  transition:
    width
    0.1s
    linear;

}


/* =========================================
   LOADING TEXT
========================================= */

.loading-text {

  margin-top: 13px;

  min-height: 16px;

  color:
    rgba(
      255,
      255,
      255,
      0.7
    );

  font-size: 11px;

  letter-spacing: 0.2px;

}


/* =========================================
   ANIMATIONS
========================================= */

@keyframes floatingPaw {

  0%,
  100% {

    transform:
      translateY(0)
      scale(1);

  }


  50% {

    transform:
      translateY(-9px)
      scale(1.04);

  }

}


@keyframes splashEnter {

  from {

    opacity: 0;

    transform:
      translateY(20px)
      scale(0.95);

  }


  to {

    opacity: 1;

    transform:
      translateY(0)
      scale(1);

  }

}


/* =========================================
   FADE OUT
========================================= */

.fade-leave-active {

  transition:
    opacity
    0.4s
    ease;

}


.fade-leave-to {

  opacity: 0;

}

</style>