import { BaseView } from 'edit_channel/views';
import kVueHelper from 'utils/kVueHelper';
import perseusTest from '../perseustest';

// TODO async these? Def async the preview import
import imageTemplate from '../hbtemplates/preview_templates/image.handlebars';
import documentTemplate from '../hbtemplates/preview_templates/document.handlebars';

export default BaseView.extend({
  initialize(options) {
    // file is specified, get the template if kolibri renderer isn't necessary
    if(options.previewFile){
      this.template = this.getStudioTemplate(options);
    }

    this.on('destroy', () => {
      if (this.vuePreview) {
        // important, particularly here. Destroy clears event listeners
        this.vuePreview.$destroy();
        this.vuePreview = null;
      }
      this.off();
    });

    this.render();
  },
  setupKolibriComponent(){
    // dupe the global component. Likely to be modified.
    const { contentRenderer } = Object.assign({}, window.kolibriGlobal.coreVue.components);

    // mock up vue props here

    const kind = this.model.get('kind');
    const assessment = kind === 'exercise';
    const itemId = assessment ? this.model.get('assessment_item_ids')[0] : null;
    const files = this.model.get('files').map(file => {
      return Object.assign({
        extension: file.file_format,
        lang: file.language,
        thumbnail: file.preset.thumbnail,
        priority: file.preset.order,
        available: true,
      }, file)
    });


    // Modify contentRenderer if assessment
    if(assessment){

      // currentViewClass is a `data` property set in the `created` hook via promise
      // the component housed in currentViewClass is rendered via a `v-if`d `<component :is="">`
      // this means that the component and its associated `ref` doesn't exist until:
      // 1) The promise is returned, setting the correct `data` property
      // 2) The DOM updates to reflect the changes in `data`
      Object.assign(contentRenderer, {
        watch: {
          // using a watcher to listen for changes in the data field
          currentViewClass() {
            // giving the component a $nextTick to update the DOM
            // note: binds `this` to the scope of the component
            this.$nextTick(function(){

              // override loadItemData because itemId is necessary, but causes the component to look for
              this.$refs.contentView.loadItemData = () => null;

              // perseus renderer is v-if'd based on itemId. Need DOM to update.
              this.$refs.contentView.$nextTick(function(){
                // files that aren't being served.

                // TODO STOP USING DUMMY DATA
                const item = JSON.parse(perseusTest.perseusObject.itemData)

                // copied from perseus renderer index
                if (this.validateItemData(item)) {
                  this.item = item;
                  if (this.$el) {
                    // Don't try to render if our component is not mounted yet.
                    this.renderItem();
                  } else {
                    this.$once('mounted', this.renderItem);
                  }
                } else {
                  console.error('Loaded item was malformed', item);
                }
              });
            });
          },
        },
      });
    }

    const propsData = {
      kind,
      assessment,
      files,
      itemId,
      available: true,
      interactive: false,
    };

    // passing el here so that vue has context about its parent elements.
    // context needed to use responsiveElement properly
    return kVueHelper(contentRenderer, {
      propsData,
      el: this.el,
    });
  },
  getStudioTemplate({ previewFile, intl_data }) {
    const imageFormats = ['jpg', 'jpeg', 'png'];

    // Needs image template (not in kolibri)
    if (imageFormats.includes(previewFile.file_format)) {

      const imageSource = () => {
        if (this.model.has("thumbnail_encoding")) {
          return this.model.get("thumbnail_encoding").base64 || previewFile.storage_url;
        }
        return previewFile.storage_url;
      }

      return imageTemplate({ source: imageSource() }, { data: intl_data });
    }

    // Needs subtitle template (not in kolibri)
    if (previewFile.file_format === 'srt') {
      return documentTemplate({ source: previewFile.storage_url }, { data: intl_data });
    }

    return '';
  },
  render() {
    if(this.template){
      this.$el.html(this.template);
      return this;
    }

    // Turns out kolibri renderer is necessary
    this.vuePreview = this.setupKolibriComponent();
    return this;
  },
});
