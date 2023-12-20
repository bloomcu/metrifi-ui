<template>
  <div class="grid grid-cols-12 gap-x-4 gap-y-6">
    <div class="col-span-full">
      <AppInput v-model="address1" @input="$emit('update:address1', $event.target.value)" ref="address1Ref" label="Street Address*" autocomplete="address-line1" placeholder="Enter a location" required :errors="errorStore.errors.address1" />
    </div>

    <div class="col-span-full">
      <AppInput v-model="address2" @input="$emit('update:address2', $event.target.value)" label="Apartment, unit, suite, or floor #" autocomplete="address-line2" :errors="errorStore.errors.address2" />
    </div>

    <div class="col-span-full sm:col-span-6">
      <AppInput v-model="city" @input="$emit('update:city', $event.target.value)" label="City*" autocomplete="address-level2" required :errors="errorStore.errors.city" />
    </div>

    <div class="col-span-full sm:col-span-6">
      <AppInput v-model="state" @input="$emit('update:state', $event.target.value)" label="State/Province*" autocomplete="address-level1" required :errors="errorStore.errors.state" />
    </div>

    <div class="col-span-full sm:col-span-6">
      <AppInput v-model="postal_code" @input="$emit('update:postal_code', $event.target.value)" label="Zip/Postal Code*" autocomplete="postal-code" required :errors="errorStore.errors.postal_code" />
    </div>

    <div class="col-span-full sm:col-span-6">
      <AppInput v-model="country" @input="$emit('update:country', $event.target.value)" label="Country/Reqion*" autocomplete="country" required :errors="errorStore.errors.country" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import useExternalScript from '@/app/composables/base/useExternalScript'

const googlePlacesKey = import.meta.env.VITE_GOOGLE_PLACES_KEY
const errorStore = useErrorStore()
const address1Ref = ref();

const emit = defineEmits([
  'update:address1',
  'update:address2',
  'update:city',
  'update:state',
  'update:postal_code',
  'update:country',
  'update:lat',
  'update:lng'
]);

const props = defineProps({
  address1: {
    type: String,
    default: '',
  },
  address2: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  postal_code: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
})

let autocomplete;

onMounted(async () => {
  await useExternalScript(`https://maps.googleapis.com/maps/api/js?key=${googlePlacesKey}&libraries=places&callback=Function.prototype`)

  autocomplete = new google.maps.places.Autocomplete(address1Ref.value.inputRef, {
    types: ['address'],
    fields: [
      'address_components', 
      'geometry'
    ]
  });

  google.maps.event.addListener(autocomplete, 'place_changed', () => {
    // Empty user's input
    emit('update:address1', '')

    // Get place data
    let place = autocomplete.getPlace()

    // Destructure address components
    let address = place.address_components.reduce((component, { long_name, types }) => {
      types.forEach(t => {
        component[t] = long_name;
      });

      return component;
    }, {});

    // Emit address
    emit('update:address1', address.street_number ? `${address.street_number} ${address.route}` : address.route)
    emit('update:city', address.locality)
    emit('update:state', address.administrative_area_level_1)
    emit('update:postal_code', address.postal_code_suffix ? `${address.postal_code}-${address.postal_code_suffix}` : address.postal_code)
    emit('update:country', address.country)
    emit('update:lat', place.geometry.location.lat())
    emit('update:lng', place.geometry.location.lng())
  })
})

onUnmounted(() => {
  if (autocomplete) {
    google.maps.event.clearInstanceListeners(autocomplete)
  }
})
</script>