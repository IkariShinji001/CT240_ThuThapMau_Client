<template>
  <q-page class="container-parent">
    <div class="container">
      <div v-if="collectionForm" class="form-info">
        <p class="form-title">{{ collectionForm.collection_form_name }}</p>
      </div>

      <div class="submit-form">
        <q-btn flat round class="q-btn-open" style="bottom: 2px; right: 5px" @click="openFormFunc">
          <q-icon name="add" class="plus-icon"></q-icon>
          <q-tooltip style="font-size: 14px; font-weight: 700">
            create project
          </q-tooltip>
        </q-btn>
      </div>

      <q-dialog v-model="openAdd">
        <q-card class="card-add">
          <h3>{{ collectionForm.collection_form_name }}</h3>
          <div v-for="(attr, idx) in listAttributes" :key="idx" class="field-card">
            <!-- <q-file v-if="attr.collection_attribute_name == 'Ảnh'" :label="attr.collection_attribute_name"
              v-model="file" multiple /> -->

            <q-file filled bottom-slots accept="image/*"  counter v-if="attr.collection_attribute_name == 'Ảnh'" :label="attr.collection_attribute_name"
              v-model="file" multiple >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click.stop.prevent="model = null" class="cursor-pointer" />
              </template>

              <template v-slot:hint>
                Field hint
              </template>
            </q-file>

            <q-input v-else dense outlined :label="attr.collection_attribute_name" class="q-input-class"
              v-model="inputValues[idx].collection_value"></q-input>
          </div>

          <q-btn class="q-btn-submit" @click="submitHandler"> Nộp </q-btn>
        </q-card>
      </q-dialog>
    </div>
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
        fd.append("lastIdx", listAttributes.value[listAttributes.value.length - 1].collection_attribute_id)
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
  border: 1px solid blue;
  display: flex;
  justify-content: center;
}

.container {
  border: 1px solid blue;
  width: 90%;
  display: flex;
  margin-top: 20px;
  justify-content: start;
}

.form-info {
  flex: 3;
  border: 1px solid red;
}

.submit-form {
  flex: 1;
  width: 100px;
  border: 1px solid red;
}

.form-title {
  font-size: 36px;
  color: rgb(90, 90, 90);
}

/* CARD  ? */
.card-add {
  width: 400px;
  height: 400px;
  text-align: center;
}

.field-card {
  margin: auto;
  width: 90%;
}

.q-input-class {
  margin-top: 10px;
  margin-bottom: 20px;
}

.q-btn-submit {
  margin: auto;
  width: 100px;
  height: 30px;
  background: rgb(47, 97, 172);
}
</style>
