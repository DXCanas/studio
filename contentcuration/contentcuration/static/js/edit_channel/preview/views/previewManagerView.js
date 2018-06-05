import { BaseView } from 'edit_channel/views';
import { FormatPresetCollection } from 'edit_channel/models';

import PreviewView from './previewView';

import { translate } from 'edit_channel/utils/string_helper';
import { defer } from 'underscore';

var NAMESPACE = "preview";
var MESSAGES = {
  "show_fullscreen": "Show Fullscreen",
  "hide_fullscreen": "Hide Fullscreen",
  "select_file": "Select a format to preview.",
  "preview_exercise": "Preview this exercise on the source website",
  "video_error": "Your browser does not support the video tag.",
  "image_error": "Image failed to load"
}

export default BaseView.extend({
  // probably for translations. Defined at the top of this file
  name: NAMESPACE,
  $trs: MESSAGES,
  // Template to be injected in modal, defined above.
  template: require("../hbtemplates/preview_manager.handlebars"),
  tabs_template: require("../hbtemplates/preview_templates/tabs.handlebars"),
  initialize() {
    this.currentPreviewIndex = 0;
    this.previews = this.getPreviews();


    this.on('changeContentPreview', previewIndex => {
      this.currentPreviewIndex = previewIndex;
      this.previewView.trigger('destroy');
      this.render();
    });


    this.listenTo(this.model, 'change:files', () => {
      this.previews = this.getPreviews();
      this.previewView.trigger('destroy');
      this.render();
    });

    // Trying to keep this logic limited to the scope of preview Views.
    // Using jquery-ui's `remove` event. Applies to widgets, unsure why getting called here

    // cannot use `listenTo`, unsure why.
    defer(() => this.$el.on("remove", function() {
      this.previewView.trigger('destroy');
      // call stopListening for all events
      this.remove();
      // unbind all `.on`s
      this.off();
    }));

    this.render();

  },
  getPreviews() {
    // array of previewabe files
    const previewableFiles = this.model.get('files').filter(file => {
      if (file.preset && file.preset.display && !(file.preset.subtitle)) {
        return true;
      }
      return false;
      // sort array of previewabe files by preset order
    }).sort(
      (file1, file2) => file1.preset.order - file2.preset.order
    );

    return previewableFiles;
  },
  events: {
    'click .preview_btn_tab': 'selectContentPreview',
  },
  render() {
    this.previewView = new PreviewView({
      model: this.model,
      previewFile: this.previews[this.currentPreviewIndex],
      intl_data: this.get_intl_data(),
    });

    this.$el.html(
      this.template({ file: true }, { data: this.get_intl_data() })
    );

    // set up preview tabs + dd child elements
    this.$("#preview_tabs_dropdown").html(
      this.tabs_template({ previews: this.previews })
    );

    this.$(".preview_format_switch").text(
      translate(this.previews[this.currentPreviewIndex].preset.id)
    );

    // NOTE: replaces the entire view on render.
    this.$('#preview_window').html(this.previewView.el);

    return this;
  },
  selectContentPreview(event) {
    // a <select> seems more appropriate
    const selectedIndex = event.target.getAttribute('value');

    // only change the preview if necessary
    if (selectedIndex !== this.currentPreviewIndex) {
      this.trigger('changeContentPreview', selectedIndex);
    }
  },
});
