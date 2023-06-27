<template>
    <div class="flex flex-col justify-center items-center">
        <div class="bordered text-white print:text-black font-semibold text-sm px-1 py-.5 rounded-sm" :class="{
            'bg-gray-500': capability.userTargetDiff === 0,
            'bg-red-800': capability.userTargetDiff < 0,
            'bg-green-800': capability.userTargetDiff > 0,
        }">

            <span>{{ capability.current }}</span>
            <span v-if="capability.userTargetDiff"><span v-if="capability.userTargetDiff > 0">+</span>{{
                capability.userTargetDiff }}
            </span>
        </div>
    </div>
</template>
<script>
import { Capability } from '../../models/Capability';
export default {
    props: {
        capability: {
            type: Capability,
            required: true
        }
    }
}

</script>