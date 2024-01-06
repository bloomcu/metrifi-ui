<template>
  <div v-if="file" class="modal modal--animate-scale flex flex-center bg-black bg-opacity-90% padding-md">
    <div class="modal__content width-100% max-width-lg max-height-100% overflow-auto bg padding-x-md radius-md inner-glow shadow-md" role="alertdialog" aria-labelledby="modal-title-1" aria-describedby="modal-description-1">
      <header class="flex justify-between padding-top-md">
        <div class="flex gap-sm items-center">
          <!-- <UserAvatar/> -->
          <div class="text-component">
            <h1 class="text-base">{{ file.name }}</h1>
            <p class="text-xs">{{ file.extension }}</p>
          </div>
        </div>
        <div class="flex gap-xs items-center items-end">
          <button v-if="deleteable" @click="destroy()" class="btn btn--subtle">
            <svg class="icon margin-right-xs" height="24" width="24" viewBox="0 0 24 24"><g stroke-linecap="round" stroke-width="2" fill="none" stroke="#000000" stroke-linejoin="round" class="nc-icon-wrapper"><path d="M20,9l-.867,12.142A2,2,0,0,1,17.138,23H6.862a2,2,0,0,1-1.995-1.858L4,9"></path><line x1="1" y1="5" x2="23" y2="5" stroke="#000000"></line><path data-cap="butt" d="M8,5V1h8V5" stroke="#000000"></path></g></svg>
            Delete
          </button>
          <a :href="`${baseURL}/media/${file.uuid}`" :download="file.name"  class="btn btn--primary">
            <svg class="icon margin-right-xs"  height="24" width="24" viewBox="0 0 24 24"><g stroke-linecap="round" stroke-width="2" fill="none" stroke="#fff" stroke-linejoin="round" class="nc-icon-wrapper"><line data-cap="butt" x1="12" y1="16" x2="12" y2="3" stroke="#fff"></line> <polyline points="17,3 23,3 23,21 1,21 1,3 7,3 "></polyline> <polyline points=" 17,11 12,16 7,11 " stroke="#fff"></polyline></g></svg>
            Download
          </a>
        </div>
      </header>

      <div class="content__image-wrapper padding-y-md">
          <img class="content__image" :src="file.original_url" alt="">
      </div>

      <!-- <footer class="padding-md">
        <div class="flex gap-xs items-center">
          <button class="btn btn--subtle js-modal__close">Cancel</button>
          <button class="btn btn--primary">Install</button>
        </div>
      </footer> -->
    </div>

    <button @click="close()" class="reset modal__close-btn modal__close-btn--outer display@md js-modal__close js-tab-focus">
      <svg class="icon icon--sm" viewBox="0 0 24 24">
        <title>Close modal window</title>
        <g fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="3" x2="21" y2="21" />
          <line x1="21" y1="3" x2="3" y2="21" />
        </g>
      </svg>
    </button>
  </div>
</template>

<script setup>
// import Avatar from '@/app/components/base/avatars/Avatar.vue'

const props = defineProps({
  file: {
    type: Object,
  },
  deleteable: { 
    type: Boolean, 
    default: true,
  },
})

const baseURL = import.meta.env.VITE_API_BASE_URL

function close() {
  emit('closed')
}

function destroy() {
  emit('destroyed', props.file)
}

const emit = defineEmits(['closed', 'destroyed'])
</script>

<style lang="scss">
.modal {
  position: fixed;
  z-index: var(--z-index-overlay, 15); 
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  opacity: 0;
  visibility: hidden;

  &:not(.modal--is-visible) {
    pointer-events: none;
    background-color: transparent;
  }
}

.modal--is-visible {
  opacity: 1;
  visibility: visible;
}

.content__image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;  
}

.content__image {
  display: block;
  max-height: 80vh;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

/* close buttons */
.modal__close-btn {
  display: flex;
  flex-shrink: 0;
  border-radius: 50%;
  transition: 0.2s;

  .icon {
    display: block;
    margin: auto;
  }
}

.modal__close-btn--outer { /* close button - outside the modal__content */
  --size: 48px;
  width: var(--size);
  height: var(--size);
  position: fixed;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: var(--z-index-fixed-element, 10); 
  background-color: alpha(var(--color-black), 0.9);
  transition: 0.2s;

  .icon {
    color: var(--color-white); /* icon color */
    transition: transform 0.3s var(--ease-out-back);
  }

  &:hover {
    background-color: alpha(var(--color-black), 1);

    .icon {
      transform: scale(1.1);
    }
  }
}

.modal__close-btn--inner { /* close button - inside the modal__content */
  --size: 32px;
  width: var(--size);
  height: var(--size);
  background-color: var(--color-bg-light);
  box-shadow: var(--inner-glow), var(--shadow-sm);
  transition: 0.2s;

  .icon {
    color: inherit; /* icon color */
  }

  &:hover {
    background-color: var(--color-bg-lighter);
    box-shadow: var(--inner-glow), var(--shadow-md);
  }
}

/* animations */
:root {
  --modal-transition-duration: 0.2s; /* fallback (i.e., unless specified differently in the variations 👇) */
}

@media (prefers-reduced-motion: no-preference) {
  .modal--animate-fade {
    --modal-transition-duration: 0.2s;
    transition: opacity var(--modal-transition-duration), background-color var(--modal-transition-duration), visibility 0s var(--modal-transition-duration);

    &.modal--is-visible {
      transition: opacity var(--modal-transition-duration), background-color var(--modal-transition-duration), visibility 0s;
    }
  }

  .modal--animate-scale,
  .modal--animate-translate-up,
  .modal--animate-translate-down,
  .modal--animate-translate-right,
  .modal--animate-translate-left {
    --modal-transition-duration: 0.2s;
    transition: opacity var(--modal-transition-duration), background-color var(--modal-transition-duration), visibility 0s var(--modal-transition-duration);

    .modal__content {
      will-change: transform;
      transition: transform var(--modal-transition-duration) var(--ease-out);
    }

    &.modal--is-visible {
      transition: opacity var(--modal-transition-duration), background-color var(--modal-transition-duration), visibility 0s;

      .modal__content {
        transform: scale(1); /* reset all transformations */
      }
    }
  }

  .modal--animate-slide-up,
  .modal--animate-slide-down,
  .modal--animate-slide-right,
  .modal--animate-slide-left {
    --modal-transition-duration: 0.3s;
    transition: opacity 0s var(--modal-transition-duration), background-color var(--modal-transition-duration), visibility 0s var(--modal-transition-duration);

    .modal__content {
      will-change: transform;
      transition: transform var(--modal-transition-duration) var(--ease-out);
    }

    &.modal--is-visible {
      transition: background-color var(--modal-transition-duration), visibility 0s;

      .modal__content {
        transform: scale(1); /* reset all transformations */
      }
    }
  }

  /* scale */
  .modal--animate-scale {
    .modal__content {
      transform: scale(0.95);
    }
  }

  /* translate */
  .modal--animate-translate-up {
    .modal__content {
      transform: translateY(40px);
    }
  }

  .modal--animate-translate-down {
    .modal__content {
      transform: translateY(-40px);
    }
  }

  .modal--animate-translate-right {
    .modal__content {
      transform: translateX(-40px);
    }
  }

  .modal--animate-translate-left {
    .modal__content {
      transform: translateX(40px);
    }
  }

  /* slide */
  .modal--animate-slide-up {
    .modal__content {
      transform: translateY(100%);
    }
  }

  .modal--animate-slide-down {
    .modal__content {
      transform: translateY(-100%);
    }
  }

  .modal--animate-slide-right {
    .modal__content {
      transform: translateX(-100%);
    }
  }

  .modal--animate-slide-left {
    .modal__content {
      transform: translateX(100%);
    }
  }
}

/* load content - optional */
.modal--is-loading {
  .modal__content {
    visibility: hidden;
  }

  .modal__loader {
    display: flex;
  }
}

.modal__loader { /* loader icon */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  display: none;
  pointer-events: none;
}

/* --image */
.modal-img-btn {
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: alpha(var(--color-black), 0);
    transition: background 0.2s;
  }

  &:hover {
    &::after {
      background-color: alpha(var(--color-black), 0.7);
    }

    .modal-img-btn__icon-wrapper {
      opacity: 1;
    }
  }
}

.modal-img-btn__icon-wrapper {
  position: absolute;
  z-index: 2;
  top: calc(50% - 24px);
  left: calc(50% - 24px);
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: alpha(var(--color-black), 0.7);
  opacity: 0;

  transition: opacity 0.2s;

  .icon {
    color: var(--color-white);
  }
}
</style>
