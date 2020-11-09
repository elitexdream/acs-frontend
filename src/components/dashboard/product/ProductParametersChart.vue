<template>
  <v-card class="d-flex flex-column flex-grow-1">
    <div v-if="loading" class="d-flex flex-grow-1 align-center justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else class="d-flex flex-column flex-grow-1">
      <v-card-title class="primary--text">
        <v-btn
          text
          class="ml-auto"
          @click="showChecks = !showChecks"
        >Add Graph</v-btn>
      </v-card-title>

      <v-card-text>
        <div class="px-2 pb-2">
          <v-expand-transition>
            <div v-show="showChecks">
              <v-row>
                <v-col xs="12" sm="6" md="4" class="py-1">
                  <v-checkbox v-model="parameterIds" class="mt-1" label="batch size" :value="1"></v-checkbox>
                  <v-checkbox v-model="parameterIds" class="mt-1" label="batch targets and action weights" :value="2"></v-checkbox>
                </v-col>
                <v-col xs="12" sm="6" md="4" class="py-1">
                  <v-checkbox v-model="parameterIds" class="mt-1" label="blender capability" :value="3"></v-checkbox>
                  <v-checkbox v-model="parameterIds" class="mt-1" label="process rate" :value="4"></v-checkbox>
                </v-col>
                <v-col xs="12" sm="6" md="4" class="py-1">
                  <v-checkbox v-model="parameterIds" class="mt-1" label="hopper stable" :value="5"></v-checkbox>
                  <v-checkbox v-model="parameterIds" class="mt-1" label="station conveying" :value="6"></v-checkbox>
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>

          <v-divider></v-divider>
          <div class="mt-2">
            <v-icon color="secondary">mdi-magnify</v-icon><span class="mx-1">Zoom</span>
            <v-icon color="secondary">mdi-flag</v-icon><span class="mx-1">Marker</span>
            <v-icon color="secondary">mdi-chart-areaspline</v-icon><span class="mx-1">Lines</span>
          </div>
          <apexchart
            type="area"
            height="450"
            :options="chartOptions"
            :series="computedParameters"
          >
          </apexchart>
        </div>
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
/*
|---------------------------------------------------------------------
| Product Parameters Card Component
|---------------------------------------------------------------------
|
| Product parameters component
| where update parameters of a certain product
|
*/
export default {
  components: {
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showChecks: false,
      parameterIds: [],
      parameterSeries: [
        {
          id: 1,
          name: 'batch size',
          data: [14, 16, 30, 32, 17]
        },
        {
          id: 2,
          name: 'batch targets and action weights',
          data: [17, 26, 25, 15, 32]
        },
        {
          id: 3,
          name: 'blender capability',
          data: [8, 22, 15, 20, 15]
        },
        {
          id: 4,
          name: 'process rate',
          data: [32, 9, 9, 38, 35]
        },
        {
          id: 5,
          name: 'hopper stable',
          data: [18, 6, 18, 18, 12]
        },
        {
          id: 6,
          name: 'station conveying',
          data: [22, 32, 12, 8, 10]
        }
      ],
      chartOptions: {
        chart: {
          type: 'area',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: ['2020-10-16T13:00', '2020-10-16T14:00', '2020-10-16T15:00', '2020-10-16T16:00', '2020-10-16T17:00']
        },
        yaxis: {
          type: 'datetime'
        },
        tooltip: {
          x: {
            format: 'yyyy-mm-dd HH:mm'
          }
        }
      }
    }
  },
  computed: {
    computedParameters() {
      return this.parameterSeries.filter( (param) => {
        return this.parameterIds.includes(param.id) 
      })
    }
  }
}
</script>