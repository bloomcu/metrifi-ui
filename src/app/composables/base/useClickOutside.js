import { onMounted, onBeforeUnmount } from 'vue'

/**
 * Listen for clicks outside of an element. Useful for modal or dropdown.
 * Source: https://runthatline.com/how-to-detect-outside-click-with-vue-3/
 * 
 * @param ref component The component we want to react to any clicks outside of it.
 * @param function callback A callback function should be executed when clicking.
 * @param ref excludeComponent An exclude component that we also don’t want to respond to when we click it.
 */
export default function useClickOutside(
  callback,
  component,
  excludeComponent
) {
  // fail early if any of the required params is missing
  if (!component) {
    throw new Error('A target component has to be provided.')
  }

  if (!callback) {
    throw new Error('A callback has to be provided.')
  }

  const listener = (event) => {
    if (
      event.target === component.value ||
      event.composedPath().includes(component.value) ||
      event.target === excludeComponent.value ||
      event.composedPath().includes(excludeComponent.value)
    ) {
      return
    }
    if (typeof callback === 'function') {
      callback()
    }
  }

  onMounted(() => {
    window.addEventListener('click', listener)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', listener)
  })
}