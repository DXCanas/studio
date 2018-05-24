import BaseViews from 'edit_channel/views';

// TODO async these? Def async the preview import
import imageTemplate from '../hbtemplates/preview_templates/image.handlebars';
import documentTemplate from '../hbtemplates/preview_templates/document.handlebars';

export default BaseViews.BaseView.extend({
    initialize(options) {
        this.vuePreview = null;

        this.content_model = this.model.get('content_model');

        this.listenTo(this.model, 'change:file_model', () => {
          // indiscriminately destroys our Vue instance. Not ideal.
          if(this.vuePreview) {
            this.vuePreview.$destroy();
            this.vuePreview = null;
          }
          this.render();
        });

        this.render();
    },
    previewTemplate(fileFormat) {
        const imageFormats = ['jpg','jpeg','png'];

        const isImage = imageFormats.includes(fileFormat);
        const isSubtitle = fileFormat === 'srt';

        if (isImage) {
            return imageTemplate({
                source: this.model.get('encoding') || this.model.get('file_model').storage_url,
            }, {
                data: this.model.get('intl_data')
            });
        }

        if (isSubtitle) {
            return documentTemplate({
                source: this.model.get('file_model').storage_url,
            }, {
                data: this.model.get('intl_data')
            });
        }

        // TODO try/catch this vue portion, use default otherwise
        // IDEA   VUE WRAPPER - streamline the props assignment process somehow?

        // first use of content_model here. Passed from parent of PreviewModalView.
        // that's probably where vue file's specced
        var kind = this.content_model.get('kind');
        // mock up props here
        var propsData = {
            kind: kind,
            // use the content model's files array?
            files: [{
                storage_url: this.model.get('file_model').storage_url,
                extension: fileFormat,
                available: true,
            }],
            available: true,
            assessment: kind === 'exercise',
            interactive: false,
            // why are we using `.get` instead of accessing directly?
            // other `*_model`s are probably not Backbone.Models.
            itemId: kind === 'exercise' ? this.content_model.get('assessment_item_ids')[0] : null
        };

        // TODO VUE WRAPPER - wrap up this process
        var ContentRendererComponent = Object.assign(
            {},
            // dupe contentRenderer from coreVue. Global var here.
            // this is a vue component object.
            window.kolibriGlobal.coreVue.components.contentRenderer
        );
        var Vue = window.kolibriGlobal.lib.vue;

        var ContentRenderer = Vue.extend(ContentRendererComponent);

        // Custom. No need for `Vue.use()` or `new Vuex.Store`
        if (!window.kolibriGlobal.coreVue.vuex.store.default.__initialized) {
            // QUESTION: Do we really need to call registerModule? is it initialized?
            window.kolibriGlobal.coreVue.vuex.store.default.registerModule();
        }
        // importing functional Vue components should be easier, though.
        // if this works purely with core store, should be fine

        // TODO not wrapping any events.
        this.vuePreview = new ContentRenderer({
            propsData: propsData,
            store: window.kolibriGlobal.coreVue.vuex.store.default,

        // starting renders the component. Keep a lookout for issues with responsiveWindow
        }).$mount();

        return this.vuePreview.$el;
    },
    render() {
        this.$el.html(
          this.previewTemplate(
            this.model.get('file_model').file_format
          )
        );

        return this;
    },
});