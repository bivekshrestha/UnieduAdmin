import Vue from 'vue';
import {ValidationObserver, ValidationProvider} from "vee-validate";

Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

import {extend} from 'vee-validate';
import {required, email, min, confirmed, regex, is_not} from "vee-validate/dist/rules";

extend('email', {
  ...email,
  message: 'The {_field_} is not valid. Enter a valid email address.'
});

extend('min', {
  ...min,
  message: 'The {_field_} field must be {length} characters.'
});

extend('required', {
  ...required,
  message: 'The {_field_} field is required.'
});

extend('confirmed', {
  ...confirmed,
  message: 'The {_field_} field is does not match.'
});

extend('regex', {
  ...regex,
  message: 'The {_field_} field is invalid.'
});

extend('is_not', {
  ...is_not,
  message: 'The {_field_} cannot be same as old.'
});

