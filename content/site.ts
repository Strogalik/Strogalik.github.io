import copy from './site-copy.ru.json';
export const site = { name: 'TMS', title: copy.home.seo.title, description: copy.home.seo.description, navigation: copy.navigation };
export const formCopy = {
  title: copy.leadForm.headings.saas, intro: 'Расскажите о задаче и оставьте контакт для ответа команды.',
  name: copy.leadForm.labels.name, company: copy.leadForm.labels.company, contact: copy.leadForm.labels.contact, message: copy.leadForm.labels.task,
  submit: copy.leadForm.submit, submitting: copy.leadForm.submitting,
  success: copy.leadForm.success, successText: 'Сервис приёма подтвердил доставку обращения.',
  consent: 'Разрешаю связаться со мной по поводу этого обращения и обработать указанные данные.',
  unavailable: 'Сейчас отправка обращений недоступна. Ваши данные не отправлены. Пожалуйста, попробуйте позже.',
};
