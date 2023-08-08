<template lang="">
    <div>
        연결상태:{{connected}}
    </div>
</template>

<script lang="ts">
import {state} from '../socket'
import {computed} from 'vue'

export default {
    setup() {
        const connected = computed(()=> {return state.connected})

        return {connected}
        }
    }

</script>