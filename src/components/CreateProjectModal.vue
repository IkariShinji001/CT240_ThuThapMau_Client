<template>
    <div class="q-pa-md form-container">
        <q-btn flat round class="cancel-btn" @click="closeModal">
            <q-icon name="cancel" class="cancel-icon" size="35px" color="red"></q-icon>
        </q-btn>
        <q-form class="q-gutter-md form-create">
            <label style="font-size: 16px; font-weight: 600;">Project Name:</label>
            <q-input name="name" style=" margin-top: 0;" filled v-model="name" lazy-rules
                :rules="[val => val && val.length > 0 || 'Please type something']" />
            <label style="font-size: 16px; font-weight: 600;">Image:</label>
            <q-file filled bottom-slots v-model="fileUploaded"  label="Label" counter>
                <template v-slot:prepend>
                    <q-icon name="cloud_upload"  />
                </template>
                <!-- <template v-slot:append>
                    <q-icon name="close" @click.stop.prevent="fileUploaded = null" class="cursor-pointer" />
                </template> -->
            </q-file>
            <div class="btn" >
                <q-btn label="Submit" type="submit" color="primary" @click="upLoadFile" />
            </div>
        </q-form>

    </div>
</template>

<script>
import { ref } from "vue"

export default {

    setup(props, { emit }) {
        const name = ref("")
        const fileUploaded = ref(null)


        function closeModal() {
            emit('close');
        }
        function onFileSelected(e) {
            this.file = e.target.file[0]
            console.log("asdfasf");
            console.log(file);
        }
        function upLoadFile(e) {
            e.preventDefault();
            console.log(fileUploaded);
        }
        return {
            closeModal,
            name,
            onFileSelected,
            upLoadFile,
            fileUploaded
        }
    }
}
</script>

<style scoped>
.form-container {
    position: relative;
    height: 300px;
}

.cancel-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    cursor: pointer;
}

.cancel-icon:hover {
    color: rgb(206, 32, 32) !important;
}

.form-create {
    margin-top: 40px;
}

.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    margin: 40px;
}
</style>