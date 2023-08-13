<template>
    <div class="login_form">
        <h1>이거 로그인 뷰</h1>
        <button @click="sendDataToParent">부모에게 데이터보내기</button>
    </div>
</template>

<script lang="ts">
import {ref} from 'vue'
export default {
    props:{
        username:String
    },
    setup(props,context){


        if(typeof props.username === 'string'){
            console.log(props.username)
        }


    const sendDataToParent=()=>{
        context.emit('dataToParent',"전달받았슘")
    }

    return {
        sendDataToParent
    }

    }
}
</script>

<style>

.login_form{
    z-index: 10000;
}
</style>