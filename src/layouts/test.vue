<template>
  <q-page class="container-parent">
    <div class="container" v-if="collectionForm">
      <div class="header">
        <p class="form-title">
          <q-icon name="assignment" class="form-title-icon"></q-icon
          >{{ collectionForm.collection_form_name }}
        </p>

        <div>
          <q-btn
            flat
            round
            class="q-btn-class"
            style="bottom: 2px; right: 5px"
            @click="openFormFunc"
          >
            <q-icon name="add" class="plus-icon" size="40px"></q-icon>
            <q-tooltip style="font-size: 14px; font-weight: 700">
              create project
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-separator size="5px" />

      <div class="submited-list">
        <div
          class="submited-for"
          v-for="(group, idx) in groupedFormsArray"
          :key="idx"
        >
          <div class="submited-item" @click="openFormDetail(group)">
            <div class="owner-submited-item">
              Người dùng: {{ group[0].user_name }}
            </div>
            <div class="submit-time">Số lần: {{ group[0].submit_time }}</div>
            <div class="submited-date">
              ngày điền mẫu: {{ formatD(group[0].collection_created_at) }}
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>

    <q-dialog v-model="openWatch">
      <q-card class="card-add">
        <h3>{{ collectionForm.collection_form_name }}</h3>
        <div v-for="(attr, idx) in selectedGroup" :key="idx" class="field-card">
          <q-field
            outlined
            stack-label
            v-if="attr.collection_attribute_name != 'Ảnh'"
            :label="attr.collection_attribute_name"
            class="q-input-class"
            :value="attr.collection_value"
          >
            <template v-slot:control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ attr.collection_value }}
              </div>
            </template>
          </q-field>
        </div>

        <div class="card-container-parent">
          <div class="card-container-img">
            <img
              v-for="(img, index) in selectedGroupImgs"
              :key="index"
              :src="img.collection_value"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- <<<<<< DIALOG -2 >>>>>> ------- -->
    <q-dialog v-model="openAdd">
      <q-card class="card-add">
        <h3>{{ collectionForm.collection_form_name }}</h3>
        <div
          v-for="(attr, idx) in listAttributes"
          :key="idx"
          class="field-card"
        >
          <q-file
            outlined
            bottom-slots
            accept="image/*"
            counter
            v-if="attr.collection_attribute_name == 'Ảnh'"
            :label="attr.collection_attribute_name"
            v-model="file"
            multiple
          >
            <template v-slot:prepend>
              <q-icon name="cloud_upload" @click.stop.prevent />
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click.stop.prevent="model = null"
                class="cursor-pointer"
              />
            </template>

            <template v-slot:hint> Field hint </template>
          </q-file>

          <q-input
            v-else
            outlined
            :label="attr.collection_attribute_name"
            class="q-input-class"
            v-model="inputValues[idx].collection_value"
          ></q-input>
        </div>

        <q-btn class="q-btn-submit" @click="showNotif"> Nộp </q-btn>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import formService from "../services/form.service";
import formValueService from "../services/formvalue.service";
import attributeService from "../services/attribute.service";
import testCreateFormService from "../services/testCreateForm.service";
import { useQuasar } from "quasar";
import formatDate from "../util/formatDate";

export default {
  setup() {
    const $q = useQuasar();
    const collectionFormId = 1;
    const collectionForm = ref();
    const userId = ref();
    const listAttributes = ref([]);
    const openAdd = ref(false);
    const openWatch = ref(false);
    const inputValues = ref();
    const listAttributeValue = ref([]);
    const file = ref([]);
    const listFilledForm = ref([]);
    const groupedForms = new Map();
    const groupedFormsArray = ref([]);
    const selectedGroup = ref([]);
    const selectedGroupImgs = ref([]);

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

      listFilledForm.value = await formValueService.getAllFormValue(
        collectionFormId
      );

      listFilledForm.value.forEach((form) => {
        const key = `${form.user_id}_${form.collection_form_id}_${form.submit_time}`;
        if (!groupedForms.has(key)) {
          groupedForms.set(key, []);
        }
        groupedForms.get(key).push(form);
      });

      groupedFormsArray.value = Array.from(groupedForms.values());

      userId.value = collectionForm.value.user.user_id;
    });

    function showNotif(isDone) {
      const notif = $q.notify({
        position: "top",
        group: false,
        timeout: 0,
        spinner: true,
        message: "Đang tải ảnh lên ...",
      });

      submitHandler(() => {
        const interval = setInterval(() => {
          if (isDone) {
            notif({
              position: "top",
              icon: "done",
              color: "green-7",
              spinner: false,
              message: "Đã điền form!",
              timeout: 1000,
            });
            clearInterval(interval);
          }
        }, 500);
      });
    }

    async function submitHandler(callback) {
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
        openFormFunc();
        const createdForm = await testCreateFormService.createValue(fd);

        listFilledForm.value = [...listFilledForm.value, ...createdForm];
        listFilledForm.value.forEach((form) => {
          const key = `${form.user_id}_${form.collection_form_id}_${form.submit_time}`;
          if (!groupedForms.has(key)) {
            groupedForms.set(key, []);
          }
          groupedForms.get(key).push(form);
        });

        groupedFormsArray.value = Array.from(groupedForms.values());
        if (callback) {
          callback();
        }
      } catch (e) {
        console.log(e);
      }
    }

    function openFormDetail(group) {
      selectedGroup.value = group;
      selectedGroupImgs.value = group.filter(
        (item) => item.collection_attribute_name == "Ảnh"
      );

      openWatch.value = !openWatch.value;
    }
    function openFormFunc() {
      openAdd.value = !openAdd.value;
    }

    function formatD(dateString) {
      return formatDate(dateString);
    }
    return {
      collectionForm,
      listAttributes,
      inputValues,
      openAdd,
      openWatch,
      file,
      listFilledForm,
      groupedFormsArray,
      selectedGroup,
      selectedGroupImgs,
      openFormFunc,
      openFormDetail,
      submitHandler,
      formatD,

      showNotif,
    };
  },
};
</script>

<style scoped>
.container-parent {
  max-width: 100%;
  display: flex;
  justify-content: center;
}
.container {
  width: 85%;
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
  margin: 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-title-icon {
  border-radius: 50%;
  background: rgb(90, 90, 90);
  color: white;
  padding: 5px;
  margin-right: 15px;
}

.form-title {
  font-size: 36px;
  color: rgb(90, 90, 90);
}

/* -------- submit-list  -----------*/

.submited-list {
  margin-top: 20px;
}
.submited-for {
  border-radius: 10px;
  height: 90px;
}

.submited-item {
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 10px;
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.16);
  padding-left: 15px;
}
.submited-item:hover {
  background: rgb(18, 18, 161);
  color: white;
  border: 2px solid rgb(209, 209, 209);
}

.owner-submited-item {
  font-size: 22px;
}
.submit-time {
  font-size: 16px;
}
.submited-date {
  font-size: 16px;
}

/* CARD  ? */
.card-add {
  min-width: 600px;
  max-width: 900px;
  /* min-height: 300px; */
  max-height: 500px;
  text-align: center;
  padding-bottom: 30px;
}

.card-add > h3 {
  margin: 25px 0;
}

.field-card {
  margin: 0 auto;
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
  margin-bottom: 20px;
  font-size: 18px;
  color: white;
  background: rgb(47, 97, 172);
}

.card-container-parent {
  display: flex;
  justify-content: center;
  width: 100%;
}

.card-container-img {
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  max-width: min-content;
}

/* .card-container-img img {
    flex: 40%;
  } */
.card-container-img > img {
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  padding: 10px;
  width: 200px;
  height: 200px;
}
</style>
