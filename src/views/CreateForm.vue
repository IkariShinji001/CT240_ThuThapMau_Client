<template>
  <div class="container-dialog">
    <div class="from shadow-1">
      <h5>Tạo form cho đợt thu thập</h5>
      <q-input class="input" outlined v-model="nameForm" label="Nhập tên Form" />
      <div>
        <div class="input-row" v-for="(attributeName, index) in attributeNames" :key="index">
          <div class="number">{{ index + 1 }}.</div>
          <q-input outlined class="input" v-model="attributeName.collection_attribute_name" label="Nhập trường mới" />
          <q-icon name="delete" @click="deleteInput(index)" class="icon-delete"></q-icon>
        </div>
        <q-input class="input" outlined label="Ảnh (Optional)" disable></q-input>
      </div>
      <div>
      </div>
      <div class="btn-addAttribute">
        <q-btn @click="addAttribute" class="btn-add" color="primary"> Thêm trường</q-btn>
      </div>
      <div class="btn-submitForm">
        <q-btn @click="submitForm" color="primary" class="btn-submit"> Tạo Form</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref } from "vue";
  import collectionFormService from "../services/collectionForm.service";
  import { useToast } from "vue-toastification";
  export default {
    props: {
      user_id: String,
      collection_id: String,
    },
    setup(props, { emit }) {
      const toast = useToast();
      const nameForm = ref("");
      const user_id = ref(props.user_id);
      const collection_id = ref(props.collection_id);
      const attributeNames = ref([{ collection_attribute_name: "" }]);
      const files = ref([]);
      const addAttribute = () => {
        attributeNames.value.push({ collection_attribute_name: "" });
      };

      const submitForm = async () => {
        const payload = {
          collection_form_name: nameForm.value,
          user_id: user_id.value,
          collection_id: collection_id.value,
          attributeList: [...attributeNames.value],
        };
        payload.attributeList.push({ collection_attribute_name: "Ảnh" });
        try {
          const newCollection = await collectionFormService.createCollectionForm(payload);
          emit("updatedCollection", newCollection);
          toast.success("Tạo form thành công");
        } catch (error) {
          toast.error("Xảy ra lỗi trong quá trình tạo form");
          console.error(error);
        }
      };

      const deleteInput = (index) => {
        attributeNames.value.splice(index, 1);
      }

      return {
        nameForm,
        user_id,
        collection_id,
        attributeNames,
        submitForm,
        addAttribute,
        deleteInput,
        files
      }
    }
  }



</script>

<style scoped>
  .container-dialog {
    width: 100%;
  }

  .from {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
  }

  .input-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    text-align: center;
    font-size: 30px;
    margin-bottom: 30px;
    font-weight: bold;
  }


  .input {
    margin: 10px;
    width: 96%;
    background-color: white;
    font-size: 18px;
  }

  .icon-delete {
    font-size: 25px;
    cursor: pointer;
  }

  .btn-add {
    padding: 10px 40px;
  }

  .btn-submit {
    font-size: 18px;
    padding: 5px 100px;
    font-weight: bold;
  }
</style>