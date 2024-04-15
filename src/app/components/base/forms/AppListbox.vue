<template>
    <Listbox 
        by="slug" 
        v-bind="modelValue" 
        :multiple="multiple" 
        @update:modelValue="slug => emit('update:modelValue', slug)" 
    >
        <div class="relative mt-1">
            <ListboxButton class="flex items-center gap-x-2">
                <slot name="before"></slot>
                {{ modelValue ? modelValue.title : placeholder }}
            </ListboxButton>

            <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="overflow-auto absolute z-10 py-1 mt-1 w-auto max-h-60 text-base bg-white rounded-md ring-1 ring-black ring-opacity-5 shadow-lg focus:outline-none sm:text-sm">
                    <ListboxOption
                        v-for="option in options"
                        :key="option"
                        v-slot="{active, selected}"
                        :value="option"
                        as="template"
                    >
                        <li :class="[active ? 'bg-amber-100 text-amber-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                            <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.title }}</span>
                            <span v-if="selected" class="flex absolute inset-y-0 left-0 items-center pl-3 text-amber-600">
                                <CheckIcon aria-hidden="true" class="w-5 h-5"/>
                            </span>
                        </li>
                    </ListboxOption>
                </ListboxOptions>
            </transition>

            <div class="text-xs text-red-400 mt-1" v-if="error">{{ error }}</div>
        </div>
    </Listbox>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/20/solid";
 
const props = defineProps({
    options: Array,
    modelValue: [String, Number, Array, Object],
    placeholder: {
        type: String,
        default: "Not set",
    },
    multiple: Boolean,
    error: String
});
 
const emit = defineEmits(['update:modelValue']);
</script>