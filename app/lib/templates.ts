export const DEFAULT_INVITE = {
  subject: ({ appName }: { appName: string }) => `Get Started with ${appName}`,
  text: ({ host, author }: { host: string; author: string }) => `Hi,

To create your account, simply go to ${host}/login and fill in your email. 

Best,
${author}
`,
  html: ({ host, author }: { host: string; author: string }) => `<p>Hi,</p>
<p>To create your account, simply go to <a href="${host}/login">${host}/login</a> and fill in your email.</p>
<p>Best,<br/>
${author}</p>
`,
};

export const NEW_USER_SIGNUP = {
  subject: ({ appName }: { appName: string }) =>
    `Get started now with ${appName}!`,
  text: ({ link, hostname }: { link: string; hostname: string }) =>
    `To create a new account at ${hostname}, simply click the link below\n${link}`,
  html: ({ link, hostname }: { link: string; hostname: string }) =>
    `To create a new account at ${hostname}, simply click <a href="${link}">this link</a>.`,
};

export const USER_LOGIN = {
  subject: ({ appName }: { appName: string }) => `Welcome back to ${appName}!`,
  text: ({ link }: { link: string }) =>
    `Just click the link below to log in\n${link}`,
  html: ({ link }: { link: string }) =>
    `Just click <a href="${link}">this link</a> to log in.`,
};
