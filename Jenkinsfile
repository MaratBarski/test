pipeline {
    agent none
    environment {
        HOME = '.'
        MAJ = "2"
        IMG_TAG = "10.0.2.204:5000/mdclone-mainapp-ui:$MAJ.${env.BUILD_ID}"
    }
    stages {
        stage('Build') {
            agent { label 'windows' }
            stages {
                stage("Node"){
                    environment {
                        PATH = "C:\\WINDOWS\\SYSTEM32;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;C:\\Program Files\\Docker"
                    }
                    steps {
                        nodejs(nodeJSInstallationName: 'node') {
                            bat 'npm install'
                            bat 'ng build core'
                            bat '3.npm run build --prod'
                        }
                    }
                }
                stage('Docker build and push') {
                    steps {
                        script {
                            def customImage = docker.build("$IMG_TAG")
                            customImage.push()
                        }
                    }
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

        stage('SSH transfer') {
            steps{
                script {
                    if (env.INSTALL_SSH) {
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
        stage("K8s"){
            agent { label '203' }
            options {
                skipDefaultCheckout true
            }
            stages {
                stage("update running docker"){
                    when {
                        expression { env.INSTALL.toBoolean() == true }
                    }
                    steps {
                        sh 'echo Updating to version $IMG_TAG'
                        withCredentials([kubeconfigFile(credentialsId: '06c9a9c0-6244-4a71-b2d0-f078dfc206bf', variable: 'KUBECONFIG')]) {
                            sh 'kubectl set image deployment.apps/mdclone-mainapp-ui mdclone-mainapp-ui=$IMG_TAG'
                        }
                    }
                }
            }
        }
    }
}
