<template>
  <v-card
    id="device-downtime"
    :loading="isDowntimeTableLoading"
    :disabled="isDowntimeTableLoading"
  >
    <v-card-title>
      Device Downtimes
      <v-spacer></v-spacer>
      <v-btn
        class="ml-1"
        color="primary"
        @click="$emit('closed')"
      >Close
      </v-btn>
      <v-dialog
        v-model="dialog"
        max-width="400px"
      >
        <v-card>
          <v-card-title class="primary white--text">
            <span class="text-h5">Edit Downtime</span>
          </v-card-title>

          <v-card-text class="mt-4">
            <v-form ref="editForm" v-model="isFormValid" lazy-validation @submit.prevent="submit">
              <v-combobox
                v-model="editedItem.type"
                :items="downtimeTypes"
                item-text="name"
                item-value="id"
                label="Type"
                placeholder="Type of downtime plan"
                :rules="[$rules.required]"
                outlined
                dense
              ></v-combobox>

              <v-combobox
                v-model="editedItem.reason "
                :items="downtimeReasons"
                item-text="name"
                item-value="id"
                label="Reason"
                placeholder="Type in reason or choose from existing for ex: No Demand"
                :rules="[$rules.required]"
                outlined
                dense
              ></v-combobox>

              <v-textarea
                v-model="editedItem.comment"
                label="Comment"
                outlined
              ></v-textarea>

              <div class="d-flex">
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="closeDialog"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="isUpdatingDowntime"
                >
                  Save
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-card-text>
      <v-data-table
        class="flex-grow-1"
        :headers="headers"
        :items="downtimeTableData.data"
        :server-items-length="totalItems"
        :options.sync="options"
        @update:options="updateDowntimeData"
      >
        <template v-slot:item.device_id="{ item }">
          <span>{{ item.machine_name }}</span>
        </template>

        <template v-slot:item.location="{ item }">
          <span>{{ item.location_name }}</span>
        </template>

        <template v-slot:item.zone="{ item }">
          <span>{{ item.zone_name }}</span>
        </template>

        <template v-slot:item.start_time="{ item }">
          <span>{{ getTimeFromTimestamp(item.start_time) }}</span>
        </template>

        <template v-slot:item.end_time="{ item }">
          <span>{{ getTimeFromTimestamp(item.end_time) }}</span>
        </template>

        <template v-slot:item.type="{ item }">
          <span>{{ item.downtime_type_name }}</span>
        </template>

        <template v-slot:item.reason_id="{ item }">
          <span>{{ getDowntimeReason(item) }}</span>
        </template>

        <template v-slot:item.comment="{ item }">
          <span>{{ printComment(item) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editPlan(item)">
            <v-icon small>$mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
/*
|---------------------------------------------------------------------
| Location Component
|---------------------------------------------------------------------
|
*/

import { mapState, mapActions } from 'vuex'

const dateTimeIsoString = new Date().toISOString().substr(0, 10)

export default {
  data() {
    return {
      headers: [
        { text: 'Machine', value: 'device_id' },
        { text: 'Location', value: 'location' },
        { text: 'Zone', value: 'zone', sortable: true },
        { text: 'Start Time', value: 'start_time', align: 'center' },
        { text: 'End Time', value: 'end_time', align: 'center' },
        { text: 'Type', value: 'type', align: 'center' },
        { text: 'Reason', value: 'reason_id', align: 'center' },
        { text: 'Comment', value: 'comment', align: 'center' },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' }
      ],

      dialog: false,
      editedItem: {},
      defaultItem: {},
      isFormValid: true,
      options: {}
    }
  },
  computed: {
    ...mapState({
      downtimeTableData: (state) => state.devices.downtimeTableData,
      isDowntimeTableLoading: (state) => state.devices.isDowntimeTableLoading,
      downtimeTypes: (state) => state.devices.downtimeTypes,
      downtimeReasons: (state) => state.devices.downtimeReasons,
      isUpdatingDowntime: (state) => state.devices.isUpdatingDowntime
    }),
    totalItems () {
      if (this.downtimeTableData.pagination) {
        return this.downtimeTableData.pagination.totalItems
      }
      else {
        return 0
      }
    },
    routeParams() {
      return {
        location:this.$route.params.location,
        zone:this.$route.params.zone,
        machine_id:this.$route.params.configurationId,
        serial_number:this.$route.params.productId
      }
    }
  },
  mounted() {
    this.getDowntimeTableData({
      params:this.routeParams
    })
  },
  methods: {
    ...mapActions({
      getDowntimeTableData: 'devices/getDowntimeTableData',
      updateDowntime: 'devices/updateDowntime'
    }),
    updateDowntimeData() {
      this.getDowntimeTableData({
        params:{
          page:this.options.page,
          items:this.options.itemsPerPage,
          sort:this.options.sortBy.length ? this.options.sortBy[0] : null,
          order:this.options.sortDesc.length && this.options.sortDesc[0] ? 'desc' : 'asc',
          ...this.routeParams
        }
      })
    },
    editPlan(item) {
      const editType = this.downtimeTypes.find((type) => {
        return type.id === item.type
      })

      const editReason = this.downtimeReasons.find((reason) => {
        return reason.id === item.reason_id
      })

      Object.assign(this.editedItem, {
        'reason': editReason,
        'type': editType,
        'comment': item.comment,
        'id': item.id
      })

      this.dialog = true
      this.$nextTick(() => {
        this.$refs.editForm.resetValidation()
      })
    },
    closeDialog () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    submit() {
      if (this.$refs.editForm.validate()) {
        this.updateDowntime(this.editedItem)
          .then(() => {
            this.dialog = false
            this.getDowntimeTableData({
              params: this.routeParams
            })
          })
      }
    },
    machineName(item) {
      const _machine = this.deviceInfo.find((device) => {
        return Number(device.serial_number) === item.device_id
      })

      return _machine.configuration.name || ''
    },
    getTimeFromTimestamp(timestamp) {
      const date = timestamp !== -1 ? new Date(timestamp * 1000) : ''

      return date !== '' ? `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` : ''
    },
    getDowntimeReason(item) {
      const _reason = this.downtimeReasons.find((reason) => {
        return reason.id === item.reason_id
      })

      return _reason ? _reason.name : ''
    },
    printComment(item) {
      return item.comment ? item.comment : '?'
    }
  }
}
</script>
