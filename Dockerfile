FROM mcr.microsoft.com/windows/servercore:ltsc2019

ENV chocolateyUseWindowsCompression false

RUN powershell -Command \
        iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1')); \
        choco feature disable --name showDownloadProgress

RUN choco install -y --force nodejs --version=12.18.1

WORKDIR "C:/app"
COPY . .

RUN npm install
RUN npm install -g @angular/cli
RUN ng build core
RUN npm run build-prod

EXPOSE 4200
CMD ng serve --host 0.0.0.0