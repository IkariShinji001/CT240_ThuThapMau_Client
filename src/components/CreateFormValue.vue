<template>
    <div class="q-pa-md form-container">
      <q-btn flat round class="cancel-btn" @click="closeModal">
        <q-icon
          name="cancel"
          class="cancel-icon"
          size="35px"
          color="red"
        ></q-icon>
      </q-btn>
  
      <q-form class="q-gutter-md form-create">
        <q-input
          required
          filled
          v-model="project_name"
          label="Tên dự án"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Vui lòng điền tên dự án']"
        />
        <q-file
          required
          filled
          bottom-slots
          v-model="fileUploaded"
          label="Hình ảnh"
          accept="image/*"
        >
          <template v-slot:prepend>
            <q-icon name="cloud_upload" />
          </template>
        </q-file>
  
        <div class="btn">
          <q-btn
            label="Tạo dự án"
            type="submit"
            color="primary"
            @click="createProject"
          />
        </div>
      </q-form>
    </div>
  </template>