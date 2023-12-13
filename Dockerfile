FROM directus/directus:10.8.2

USER root
RUN corepack enable
USER node

RUN pnpm install directus-extension-editorjs