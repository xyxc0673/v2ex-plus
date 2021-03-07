import { config } from '@/config';

const Origin = config.V2EX_BASE_URL;
const Referer = `${config.V2EX_BASE_URL}/signin`;
const ContentType = {
  form: 'application/x-www-form-urlencoded',
};

const loginFormHeaders = {
  Origin,
  Referer,
  'Content-Type': ContentType.form,
};

export { loginFormHeaders };
