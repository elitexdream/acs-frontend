<template>
  <div>
    <div class="d-flex align-center">
      <div class="label font-italic text-caption">(Data displayed for last 24 hours)</div>
      <div>
        <v-icon class="ml-1 mr-0" color="#a4bcbb" x-small>$mdi-checkbox-blank</v-icon>
        <span class="text-caption">No Demand</span>
      </div>
      <div>
        <v-icon class="ml-1 mr-0" color="#508FF0" x-small>$mdi-checkbox-blank</v-icon>
        <span class="text-caption">Preventative Maintenance</span>
      </div>
      <div>
        <v-icon class="ml-1 mr-0" color="#06d6a0" x-small>$mdi-checkbox-blank</v-icon>
        <span class="text-caption">Machine Failure</span>
      </div>
      <div>
        <v-icon class="ml-1 mr-0" color="#505554" x-small>$mdi-checkbox-blank</v-icon>
        <span class="text-caption">Power Outage</span>
      </div>
      <div>
        <v-icon class="ml-1 mr-0" color="#ffd166" x-small>$mdi-checkbox-blank</v-icon>
        <span class="text-caption">Other</span>
      </div>
      <div>
        <v-icon class="ml-1 mr-0" color="#ea344e" x-small>$mdi-checkbox-blank</v-icon>
        <span class="text-caption">Change Over</span>
      </div>
    </div>
    <div class="d-flex justify-end">
      <div>
        <v-icon class="ml-1 mr-0" color="#FF1654" x-small>$mdi-circle</v-icon>
        <span class="text-caption">Target Availability</span>
      </div>
      <div>
        <v-icon class="ml-1 mr-0" color="#247BA0" x-small>$mdi-circle</v-icon>
        <span class="text-caption">Actual Availability</span>
      </div>
    </div>
  </div>
</template>