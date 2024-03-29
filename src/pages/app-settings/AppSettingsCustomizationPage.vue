<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-expansion-panels v-model="panel" multiple class="mt-3">
      <v-expansion-panel>
        <v-expansion-panel-header class="title">Logo</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row dense>
            <v-col cols="12">
              <v-img
                contain
                width="260"
                height="160"
                :eager="true"
                :src="logoFileSrc"
                class="mx-auto"
                style="border: 1px dashed #ccc;"
              >
              </v-img>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="logoFileInput"
                accept="image/*"
                label="New Logo Image"
                outlined
                dense
                prepend-icon="$mdi-camera"
                @change="prepareLogo"
              ></v-file-input>
              <div class="text-right">
                <v-btn
                  color="primary"
                  :loading="uploadingLogo"
                  :disabled="uploadingLogo || !logoFileInput"
                  @click="handleUpload"
                >
                  <v-icon left>
                    $mdi-cloud-upload
                  </v-icon>
                  Upload Logo
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="title">Image</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row dense>
            <v-col cols="12">
              <v-img
                contain
                width="260"
                height="160"
                :eager="true"
                :src="imageFileSrc"
                class="mx-auto"
                style="border: 1px dashed #ccc;"
              >
              </v-img>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="imageFileInput"
                accept="image/*"
                label="New Image File"
                outlined
                dense
                prepend-icon="$mdi-camera"
                @change="prepareImage"
              ></v-file-input>
              <div class="text-right">
                <v-btn
                  color="primary"
                  :loading="uploadingImage"
                  :disabled="uploadingImage || !imageFileInput"
                  @click="handleImageUpload"
                >
                  <v-icon left>
                    $mdi-cloud-upload
                  </v-icon>
                  Upload Image
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="title">Page Title Customization</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form ref="pageTitleForm" lazy-validation @submit.prevent="handlePageTitleSubmit">
            <v-text-field
              v-model="pageTitle"
              label="Input Page Title"
              outlined
              dense
              :rules="[$rules.required]"
            />
            <div class="text-right">
              <v-btn
                class="white--text"
                :loading="buttonLoading === 'PAGE_TITLE'"
                :disabled="buttonLoading === 'PAGE_TITLE'"
                color="primary"
                @click="handlePageTitleSubmit"
              >
                SUBMIT
              </v-btn>
            </div>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="title">Product Information Customization</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form ref="productInfoForm" lazy-validation @submit.prevent="handleProductInfoSubmit">
            <v-text-field
              v-model="productName"
              label="Input Product Name"
              outlined
              dense
              :rules="[$rules.required]"
            />
            <v-text-field
              v-model="productVersion"
              label="Input Product Version"
              outlined
              dense
              :rules="[$rules.required]"
            />
            <div class="text-right">
              <v-btn
                class="white--text"
                :loading="buttonLoading === 'PRODUCT_VERSION'"
                :disabled="buttonLoading === 'PRODUCT_VERSION'"
                color="primary"
                @click="handleProductInfoSubmit"
              >
                SUBMIT
              </v-btn>
            </div>
          </v-form>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="title">Application Customization</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-form ref="form" lazy-validation @submit.prevent="submit">
            <v-text-field
              v-model="url"
              label="Input Website URL"
              outlined
              dense
              :rules="[$rules.required]"
            />
            <div class="text-right">
              <v-btn
                class="white--text"
                :loading="buttonLoading === 'SUBMIT'"
                :disabled="buttonLoading === 'SUBMIT'"
                color="primary"
                @click="submit"
              >
                SUBMIT
              </v-btn>
            </div>
          </v-form>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-data-table
                :headers="headers"
                :items="colorSettings"
                :items-per-page="5"
                class="elevation-1"
                hide-default-footer
              >
                <template v-slot:item.color="{ item }">
                  <drop
                    class="my-2"
                    :style="`width: 40px; height: 40px; background: ${item.color}; border-radius: 50%; border: solid 1px grey;`"
                    @dragover="handleDragover(item)"
                    @drop="handleDrop"
                  >
                  </drop>
                </template>
              </v-data-table>
              <v-sheet v-if="buttonLoading === 'APPLY' || buttonLoading === false">
                <v-btn
                  class="ma-2"
                  :loading="buttonLoading === 'APPLY'"
                  :disabled="buttonLoading === 'APPLY'"
                  color="primary"
                  @click="applyCustomColors"
                >
                  Apply Customization
                </v-btn>
              </v-sheet>
            </v-col>
            <v-col cols="12" md="6">
              <div v-if="colors" class="d-flex flex-wrap" style="max-height: 500px; overflow-y: scroll;">
                <div
                  v-for="(color, idx) in colors"
                  :key="idx"
                  class="text-center"
                  style="width: 100px;"
                >
                  <drag class="ma-2" :style="`width: 80px; height: 80px; background: ${color.Hex}`" :transfer-data="{ color }"></drag>
                  {{ color.Hex }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <br>

    <v-btn
      color="error"
      :loading="buttonLoading === 'RESET'"
      :disabled="buttonLoading === 'RESET'"
      @click="handleResetBtnClicked"
    >
      Set Default Settings
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { Drag, Drop } from 'vue-drag-drop'

export default {
  components: { Drag, Drop },
  data () {
    return {
      panel: [3],
      logoFileInput: undefined,
      imageFileInput: undefined,
      logoFileSrc: '',
      imageFileSrc: '',

      url: '',
      tab: null,
      // customizationColor: this.privateColors[0],
      customizationColor: null,

      selectedItem: null,

      headers: [
        { text: 'Color name', value: 'name' },
        { text: 'Color', value: 'color' }
      ],
      colorSettings: [
        {
          name: 'Background',
          key: 'color_background',
          color: '#ffffff'
        }, {
          name: 'Primary',
          key: 'color_primary',
          color: '#ffffff'
        }, {
          name: 'Secondary',
          key: 'color_secondary',
          color: '#ffffff'
        }, {
          name: 'Accent',
          key: 'color_accent',
          color: '#ffffff'
        }, {
          name: 'Surface',
          key: 'color_surface',
          color: '#ffffff'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      uploadingLogo: (state) => state.settings.uploadingLogo,
      uploadingImage: (state) => state.settings.uploadingImage,
      
      logoFile: (state) => state.settings.logoFile,
      colors: (state) => state.settings.colors,
      privateColors: (state) => state.settings.privateColors,
      basicColors: (state) => state.settings.basicColors,
      buttonLoading: (state) => state.settings.buttonLoading
    }),
    logoFilePath() {
      return this.logoFile ? this.logoFile : require('../../assets/imgs/logo-aec.png')
    },
    productName: {
      get () {
        return this.$store.state.settings.productName
      },
      set (value) {
        this.$store.commit('settings/SET_PRODUCT_NAME', value)
      }
    },
    productVersion: {
      get () {
        return this.$store.state.settings.productVersion
      },
      set (value) {
        this.$store.commit('settings/SET_PRODUCT_VERSION', value)
      }
    },
    pageTitle: {
      get () {
        return this.$store.state.settings.pageTitle
      },
      set (value) {
        this.$store.commit('settings/SET_PAGE_TITLE', value)
      }
    }
  },
  mounted() {
    this.setBasicColors()
  },
  methods: {
    ...mapActions({
      'grabColors': 'settings/grabColors',
      'resetSettings': 'settings/resetSettings',
      'setInitialSetting': 'settings/setInitialSetting',
      'applyWebsiteColors': 'settings/applyWebsiteColors',
      'uploadLogo': 'settings/uploadLogo',
      'uploadImage': 'settings/uploadImage',
      'setPageTitle': 'settings/setPageTitle',
      'setProductInfo': 'settings/setProductInfo',
      'updateAuthBackground': 'settings/updateAuthBackground'
    }),
    async submit () {
      if (this.$refs.form.validate()) {
        this.grabColors(this.url)

        //-- Generic Random Images --//
        this.updateAuthBackground()
      }
    },
    async handlePageTitleSubmit() {
      if (this.$refs.pageTitleForm.validate()) {
        this.setPageTitle({ pageTitle: this.pageTitle })
      }
    },
    async handleProductInfoSubmit() {
      if (this.$refs.productInfoForm.validate()) {
        this.setProductInfo({ productName: this.productName, productVersion: this.productVersion })
      }
    },
    applyCustomColors () {

      // if (this.customizationColor.hex) {
      //   this.customizationColor = this.customizationColor.hex
      // }
      // this.$vuetify.theme.themes.light.primary = this.customizationColor
      // let colors = [
      //   this.customizationColor
      // ]

      // if (this.colors.length) {
      //   this.$vuetify.theme.themes.light.accent = this.colors[1].Hex
      //   this.$vuetify.theme.themes.light.background = this.colors[2].Hex
      //   colors = [
      //     this.customizationColor,
      //     this.colors[1].Hex,
      //     this.colors[2].Hex
      //   ]
      // }
      this.applyWebsiteColors({
        colors: this.colorSettings
      })

      // this.updateAuthBackground()
    },
    handleColorClicked (color) {
      this.customizationColor = color
    },
    handleResetBtnClicked () {
      this.resetSettings().then(() => {
        this.setInitialSetting({}).then(() => {
          this.$vuetify.theme.themes.light.background = '#ffffff'
          this.$vuetify.theme.themes.light.primary = '#092954'
          this.$vuetify.theme.themes.light.secondary = '#508FF0'
          this.$vuetify.theme.themes.light.accent = '#003066'
          this.$vuetify.theme.themes.light.surface = '#f2f5f8'
        })
      })
    },
    prepareLogo(file) {
      if (file) {
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onload = () => {
          this.logoFileSrc = reader.result
        }
      }
    },
    prepareImage(file) {
      if (file) {
        const reader = new FileReader()

        reader.readAsDataURL(file)
        reader.onload = () => {
          this.imageFileSrc = reader.result
        }
      }
    },
    handleUpload() {
      const formData = new FormData()

      formData.append('logo', this.logoFileInput)
      this.uploadLogo({
        formData
      })
    },
    handleImageUpload() {
      const formData = new FormData()

      formData.append('image', this.imageFileInput)
      this.uploadImage({
        formData
      })
    },
    handleDrop(data, event) {
      const selectedSetting = this.colorSettings.find((setting) => setting.name === this.selectedItem.name)

      selectedSetting.color = data.color.Hex
    },
    handleDragover(item) {
      this.selectedItem = item
    },
    setBasicColors() {
      this.colorSettings.map((item) => {
        if (this.basicColors[item.key]) {
          item.color = this.basicColors[item.key]
        }

        return item
      })
    }
  }
}
</script>
