<template>
    <q-page>
        <div class="wrapper" v-if="collection">
            <div class="banner">
                <img :src="collection.collection_image_url" />
                <p class="collection_name">{{ collection.collection_name }}
                <p class="status_text">Trạng thái: {{ collection.collection_status }}</p>
                <p class="status_text">Ngày tạo form: {{ formatDateTime(collection.collection_start) }}</p>
                <p class="status_text">Hạn điền form: {{ formatDateTime(collection.collection_end) }}</p>
                </p>
                <div class="setting-icon" v-if="isOwner">
                    <q-icon name="settings" @click="handleOpenUpdate"></q-icon>
                </div>
                <div class="setting-icon groups">
                    <q-icon @click="goToMember" name="group"></q-icon>
                </div>
            </div>
        </div>

    </q-page>
</template>

<script>
import { computed, onBeforeMount, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import projectService from "../services/project.service";
import collectionService from "../services/collection.service";
import formatDate from "../util/formatDate";
import { useQuasar } from "quasar";
export default {
    setup() {
        const $q = useQuasar();
        const route = useRoute();
        const collection = ref();
        const collectionId = route.params.id;
        const forms = ref();
        const { user_id } = JSON.parse(localStorage.getItem("user"));


        onBeforeMount(async () => {
            collection.value = await collectionService.getCollectionById(collectionId)
            console.log(collection.value);
            //   isOwner.value = await projectService.checkIsOwnerProject(
            //     user_id,
            //     projectId
            //   );
        });


        // const handleAddCollection = async () => {
        //   $q.loading.show();
        //   try {
        //     collectionAdd.collection_created_at = new Date();
        //     const newCollection = await collectionService.createCollection(
        //       collectionAdd
        //     );
        //     collections.value.push(newCollection);
        //     console.log(collections.value);
        //     toast.success("Đã thêm đợt thu thập thành công");
        //   } catch (error) {
        //     console.log(error);
        //   } finally {
        //     $q.loading.hide();
        //   }
        // };





        const formatDateTime = (Date) => {
            return formatDate(Date);
        };

        return {
            collection,
            formatDateTime

        };
    },
};
</script>

<style scoped>
.wrapper {
    width: 90%;
    margin: 0 auto;
}

.banner {
    width: 100%;
    position: relative;
}

.banner>img {
    width: 200px;
}

img {
    width: 100%;
    height: 50%;
    border-radius: 10px;
}

.project_name {
    color: white;
    position: absolute;
    bottom: 10%;
    left: 30px;
    font-size: 40px;
    font-weight: bold;
}

.project_status {
    top: 10%;
    position: absolute;
    left: 30px;
}

.active {
    font-size: 100px;
    color: rgb(171, 237, 171);
}

.inactive {
    font-size: 100px;
    color: brown;
}

h4 {
    margin: 0;
    padding: 0;
}

.collection {
    display: flex;
    padding: 10px 30px;
    border: 1px solid #cccc;
    border-radius: 10px;
    margin: 10px 0;
    height: 90px;
    justify-items: center !important;
}

.collection:hover {
    background-color: rgb(3, 8, 148);
    cursor: pointer;
}

.collection-icon {
    font-size: 40px;
    color: white;
}

.collection:hover .collection-info {
    color: white;
}

.icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    background-color: rgb(3, 8, 148);
    border-radius: 100px;
    margin: 10px 10px 10px 0;
}

.collection-info {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon-wrapper {
    height: 100%;
    display: flex;
    justify-items: center;
}

.setting-icon {
    position: absolute;
    right: 40px;
    top: 10px;
    font-size: 40px;
    color: white;
    cursor: pointer;
}

.setting-icon:hover {
    color: rgb(10, 10, 137);
}

.card-update {
    max-width: 1000px;
    width: 800px;
}

.input {
    font-size: 20px;
    margin: 10px 0;
}

h3 {
    font-size: 32px;
    text-align: center;
}

.submit-update {
    display: flex;
    margin: 0 auto;
    font-size: 20px;
    padding: 0 50px;
    margin-top: 20px;
}

.status_text {
    margin: 0 !important;
    padding: 0 !important;
    font-size: 20px;
}

.groups {
    right: 100px;
}

.input-search {
    display: flex;
    justify-content: space-between;
}

.search-name {
    width: 75%;
    max-width: 100%;
}

.search-name-member {
    width: 100% !important;
}

.btn-add {
    width: 20%;
}

.date-add {
    display: flex;
    justify-content: space-between;
}

.date {
    width: 45%;
}
</style>
