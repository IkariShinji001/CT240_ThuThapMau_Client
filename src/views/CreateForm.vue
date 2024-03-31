<template>
  <div class="container">
    <div class="from">
      <!-- Ô nhập tên form -->
      <h5>Nhập tên Form</h5>
      <q-input v-model="nameFrom" label="Nhập tên Form" />
      <div>
        <div
          class="input-row"
          v-for="(attributeName, index) in attributeNames"
          :key="index"
        >
          <div class="number">{{ index + 1 }}.</div>
          <q-input
            v-model="attributeName.collection_attribute_name"
            label="Nhập trường mới"
          />
        </div>
      </div>
      <div class="btn-addAttribute">
        <q-btn @click="addAttribute"> Thêm trường</q-btn>
      </div>
      <div class="btn-submitForm">
        <q-btn @click="submitForm"> Tạo From</q-btn>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const nameFrom = ref("");
const route = useRoute();
const user_id = route.params.user_id;
const collection_id = route.params.collection_id;
const attributeNames = ref([{ collection_attribute_name: "" }]);

const addAttribute = () => {
  attributeNames.value.push({ collection_attribute_name: "" });
};

const submitForm = async () => {
  console.log(
    nameFrom.value,
    attributeNames.value,
    "user_id: " + user_id,
    "collection_id: " + collection_id
  );
  const payload = {
    name: nameFrom.value,
    user_id,
    collection_id,
    collection_attribute_name: attributeNames.value,
  };
  console.log(payload);
  // const nameFrom = nameFrom.value; // Định nghĩa nameFrom
  // const userId = ""; // Định nghĩa userId
  // const CollectionId = ""; // Định nghĩa CollectionId
  // const res = await fromService.create(
  //   nameFrom,
  //   userId,
  //   CollectionId,
  //   attributeNames.value
  // );
};
</script>
  
  <style scoped>
.container {
  padding: 100px 200px;
  margin: 0px 150px;
}

.from {
  background-color: rgb(226, 233, 233);
  padding: 20px;
  border-radius: 10px;
}

.input-row {
  display: flex;
  align-items: center;
}

.number {
  margin-right: 10px;
}

.btn-addAttribute {
  margin-top: 20px;
}

.btn-submitForm {
  margin-top: 20px;
  text-align: center
}

h5 {
  margin: 5px 0px;
}
</style>
  