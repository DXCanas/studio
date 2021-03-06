import { mount } from '@vue/test-utils';
import EmailField from '../EmailField.vue';

function makeWrapper() {
  return mount(EmailField);
}

function runValidation(wrapper, value) {
  return wrapper.vm.emailRules.every(rule => rule(value) === true);
}

describe('emailField', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = makeWrapper();
  });
  it('should validate empty fields', () => {
    expect(runValidation(wrapper, '')).toBe(false);
    expect(runValidation(wrapper, ' ')).toBe(false);
  });
  it('should validate emails', () => {
    expect(runValidation(wrapper, 'a@')).toBe(false);
    expect(runValidation(wrapper, 'email')).toBe(false);
    expect(runValidation(wrapper, 'a.com')).toBe(false);
    expect(runValidation(wrapper, 'test@test.com')).toBe(true);
  });
});
