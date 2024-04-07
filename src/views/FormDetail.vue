<template>
  <q-page class="container-parent">
    <div class="container" v-if="collectionForm">
      <div class="header">
        <p class="form-title"><q-icon name="assignment"></q-icon>{{ collectionForm.collection_form_name }} Lorem ipsum
          dolor sit, amet consectetur
          adipisicing elit. Voluptas voluptate omnis et cum autem vel velit, maiores temporibus quidem ut.</p>

        <div>
          <q-btn flat round class="q-btn-class" style="bottom: 2px; right: 5px" @click="openFormFunc">
            <q-icon name="add" class="plus-icon" size="40px"></q-icon>
            <q-tooltip style="font-size: 14px; font-weight: 700">
              create project
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-separator size="5px" />
    </div>

    <q-dialog v-model="openAdd">
      <q-card class="card-add">
        <h3>{{ collectionForm.collection_form_name }}</h3>
        <div v-for="(attr, idx) in listAttributes" :key="idx" class="field-card">
          <!-- <q-file v-if="attr.collection_attribute_name == 'Ảnh'" :label="attr.collection_attribute_name"
              v-model="file" multiple /> -->

          <q-file outlined bottom-slots accept="image/*" counter v-if="attr.collection_attribute_name == 'Ảnh'"
            :label="attr.collection_attribute_name" v-model="file" multiple>
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
            <template v-slot:append>
              <q-icon name="close" @click.stop.prevent="model = null" class="cursor-pointer" />
            </template>

            <template v-slot:hint> Field hint </template>
          </q-file>

          <q-input v-else outlined :label="attr.collection_attribute_name" class="q-input-class"
            v-model="inputValues[idx].collection_value"></q-input>
        </div>

        <q-btn class="q-btn-submit" @click="submitHandler"> Nộp </q-btn>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import { ref, onBeforeMount } from "vue";
  import { useRoute } from "vue-router";
  import formService from "../services/form.service";
  import attributeService from "../services/attribute.service";
  import testCreateFormService from "../services/testCreateForm.service";
  import { useQuasar } from "quasar";
  import { useToast } from "vue-toastification";

  export default {
    setup() {
      const route = useRoute();
      const $q = useQuasar();
      const toast = useToast();
      const collectionFormId = route.params.id;
      const collectionForm = ref();
      const userId = ref();
      const listAttributes = ref([]);
      const openAdd = ref(false);
      const inputValues = ref();
      const listAttributeValue = ref([]);
      const file = ref([]);
      const lastElement = ref([]);

      onBeforeMount(async () => {
        collectionForm.value = await formService.getCollectionFormById(
          collectionFormId
        );
        listAttributes.value =
          await attributeService.getAttributesByCollectionFormId(
            collectionFormId
          );


        inputValues.value = listAttributes.value.map(() => ({
          collection_value: "",
        }));
        userId.value = collectionForm.value.user.user_id;

        console.log(collectionForm.value.collection);
      });

      async function submitHandler() {
        for (let i = 0; i < listAttributes.value.length - 1; i++) {
          const attr = listAttributes.value[i];
          const collection_value = inputValues.value[i]?.collection_value || "";

          listAttributeValue.value.push({
            collection_attribute_id: attr.collection_attribute_id,
            collection_value: collection_value,
          });
        }

        const fd = new FormData();
        try {
          fd.append("userId", userId.value);
          fd.append("collectionFormId", collectionFormId);
          fd.append("valueDtos", JSON.stringify(listAttributeValue.value));
          fd.append(
            "lastIdx",
            listAttributes.value[listAttributes.value.length - 1]
              .collection_attribute_id
          );
          for (let i = 0; i < file.value.length; i++) {
            fd.append("files", file.value[i]);
          }

          const createdForm = await testCreateFormService.createValue(fd);
          toast.success("Đã thêm dự án thành công");
          openFormFunc();
        } catch (e) {
          console.log(e);
        }

        console.log("xong");
      }
      function openFormFunc() {
        openAdd.value = !openAdd.value;
      }
      return {
        collectionForm,
        listAttributes,
        inputValues,
        openAdd,
        file,
        openFormFunc,
        submitHandler,
      };
    },
  };
</script>

<style scoped>
  .container-parent {
    max-width: 100%;
    /* display: flex;
  justify-content: center; */
  }

  .header {
    margin: auto;
    margin-top: 15px;
    margin-bottom: 30px;
    width: 90%;
    display: flex;
    justify-content: space-between;
  }

  .form-title {
    max-width: 600px;
    font-size: 32px;
    width: 80%;
    border: 1px solid rgb(90, 90, 90);
    margin: 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .form-info-icon {
    border-radius: 50%;
    border: 1px solid rgb(90, 90, 90);
    background: rgb(90, 90, 90);
    color: white;
    padding: 4px;
    margin-right: 10px;
  }

  .form-title {
    font-size: 36px;
    color: rgb(90, 90, 90);
  }

  /* CARD  ? */
  .card-add {
    max-width: 1000px;
    width: 1000px;
    height: 500px;
    text-align: center;
  }

  .field-card {
    margin: auto;
    width: 90%;
  }

  .q-input-class {
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 18px;
  }

  .q-btn-submit {
    margin: auto;
    padding: 10px 100px;
    font-size: 18px;
    color: white;
    background: rgb(47, 97, 172);
  }
</style>
