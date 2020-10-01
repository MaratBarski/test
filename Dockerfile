FROM mcr.microsoft.com/windows/servercore:ltsc2019

ENV chocolateyUseWindowsCompression false

RUN powershell -Command \
        iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1')); \
        choco feature disable --name showDownloadProgress

RUN choco install -y --force nodejs --version=10.16.0

WORKDIR "C:/app"
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm install
RUN npm install -g @angular/cli
RUN ng build core
RUN npm run build-stage
# RUN node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod

EXPOSE 4200
CMD ng serve --host 0.0.0.0