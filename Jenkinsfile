pipeline {
    agent { label 'windows' }

    environment {
        HOME = '.'
        PATH = "C:\\WINDOWS\\SYSTEM32;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;C:\\Program Files\\Docker"
    }
    stages {
        stage('Build') {
            steps {
                nodejs(nodeJSInstallationName: 'node') {
                    bat 'npm install'
                    bat 'npm run build core'
                }
            }
        }
        // stage('Test') {
        //     steps {
        //         nodejs(nodeJSInstallationName: 'node') {
        //             // sh 'npm run ng test'
        //             // sh 'npm run ng e2e'
        //         }
        //     }
        // }
        // stage('Deploy') {
        //     steps {
        //         sh 'rsync -v'
        //     }
        // }
        stage('SSH transfer') {
            steps{
                script {
                    if (env.INSTALL) {
                        sshPublisher(
                        continueOnError: false, failOnError: true,
                        publishers: [
                            sshPublisherDesc(
                            configName: "mdc2-app-1",
                            verbose: true,
                            transfers: [
                            sshTransfer(
                            sourceFiles: "dist/**",
                            removePrefix: ".",
                            remoteDirectory: "${env.BUILD_NUMBER}",
                            execCommand: "echo run commands after copy?"
                            )
                            ])
                        ])
                    }
                }
            }
        }
        stage('Docker build and push') {
            steps {
                script {
                    def customImage = docker.build("10.0.2.204:5000/mainappui:2.${env.BUILD_ID}")
                    customImage.push()
                }
            }
        }
    }
}
