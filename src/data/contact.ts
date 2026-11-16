// Contact details shown in the Contact block on the home page.
// An entry with an empty `href` is hidden.

export interface ContactItem {
  icon: 'github' | 'linkedin' | 'x' | 'mail' | 'phone';
  label: string;
  value: string;
  href: string;
}

export const contacts: ContactItem[] = [
  { icon: 'github',   label: 'GitHub',   value: 'ravenZ3',                     href: 'https://github.com/ravenZ3' },
  { icon: 'linkedin', label: 'LinkedIn', value: 'ramjan-khandelwal',           href: 'https://www.linkedin.com/in/ramjan-khandelwal' },
  { icon: 'x',        label: 'X',        value: '@ramjankdl',                  href: 'https://x.com/ramjankdl' },
  { icon: 'mail',     label: 'Email',    value: 'ramjankhandelwal7@gmail.com', href: 'mailto:ramjankhandelwal7@gmail.com' },
  { icon: 'phone',    label: 'Phone',    value: '',                            href: '' },
];
