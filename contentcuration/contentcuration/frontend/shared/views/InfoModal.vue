<template>

  <VDialog v-model="dialog" width="550">
    <template v-slot:activator="{ on }">
      <Icon color="primary" v-on="on">
        help
      </Icon>
    </template>

    <VCard>
      <VCardTitle class="headline">
        {{ header }}
      </VCardTitle>

      <VCardText>
        <slot name="content"></slot>
      </VCardText>
      <VCardActions>
        <slot name="extra-button" class="extra-button"></slot>
        <VSpacer />
        <VBtn color="primary" depressed autofocus @click="dialog = false">
          <b>{{ $tr('closeButtonLabel') }}</b>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>

</template>

<script>

  export default {
    name: 'InfoModal',
    props: {
      header: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        dialog: false,
      };
    },
    $trs: {
      closeButtonLabel: 'Close',
    },
  };

</script>

<style lang="less" scoped>

  .v-card__title {
    padding-bottom: 0;
  }

  .headline,
  /deep/ .headline {
    font-family: 'Noto Sans' !important;
  }

  /deep/ p {
    font-size: 12pt;
    color: var(--v-grey-darken3);
  }

</style>
