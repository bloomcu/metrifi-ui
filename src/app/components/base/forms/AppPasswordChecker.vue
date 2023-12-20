<template>
  <div class="my-2">
    <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
      <template v-for="condition in conditions">
        <li v-if="checkSingleCondition(password, condition.requirement)" class="flex items-center text-green-500">
          <svg class="w-5 h-5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          {{ condition.description }}
        </li>

        <li v-else class="flex items-center text-gray-400">
          <svg class="w-5 h-5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
          {{ condition.description }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import zxcvbn from 'zxcvbn'

const props = defineProps({
  password: {
    type: String,
    required: true,
  }
})

// TODO: accept conditions as a prop
let conditions = [
  {
    requirement: 'length:12', 
    description: 'At least 12 characters',
  },
  {
    requirement: 'letterAndNumber', 
    description: 'Letters and numbers',
  },
  {
    requirement: 'mixedCase', 
    description: 'Uppercase and lowercase',
  },
  {
    requirement: 'special', 
    description: 'Special characters',
  },
]

// Use zxcvbn library to check password strength
let passwordStrength = computed(() => {
  return props.password ? zxcvbn(props.password).score : null
})

// Check if all conditions are satisfied
let conditionsSatisfied = computed(() => {
  let count = 0
  conditions.forEach(condition => {
    checkSingleCondition(props.password, condition.requirement) ? count++ : count
  })
  return count == conditions.length
})

function checkSingleCondition(value, req) {
  var result;
  switch (true) {
    // Require at least one letter
    case (req == 'letter'):
      result = /[a-zA-Z]/.test(value)
      break
    // Require at least one number
    case (req == 'number'):
      result = /\d/.test(value)
      break
    // Require at least one letter and one number
    case (req == 'letterAndNumber'):
      result = /[a-zA-Z]/.test(value) && /\d/.test(value)
      break
    // Require at least one uppercase letter
    case (req == 'uppercase'):
      result = (value.toLowerCase() != value)
      break
    // Require at least one lowercase letter
    case (req == 'lowercase'):
      result = (value.toUpperCase() != value)
      break
    // Require at least one uppercase and one lower case letter
    case (req == 'mixedCase'):
      result = (value.toLowerCase() != value) && (value.toUpperCase() != value)
      break
    // Require at least one special character (e.g., !@#$%^&*()_+)
    case (req == 'special'):
      result = /[!@#$%^&*=~`'"|/\?\_\-\,\;\.\:\(\)\{\}\[\]\+\>\<\\]/.test(value)
      break
    // Require a specific minimum password length
    case (req.indexOf('length:') == 0):
      var reqArray = req.split(':')
      result = (value.length >= parseInt(reqArray[1]))
      if (reqArray.length > 2 && result) result = (value.length <= parseInt(reqArray[2]))
      break
    default:
      result = false
      break
  }
  return result;
};
</script>